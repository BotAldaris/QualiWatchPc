// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::str::FromStr;

use polars::{
    df,
    frame::DataFrame,
    lazy::dsl::col,
    prelude::{IntoLazy, SortMultipleOptions},
    series::{IntoSeries, Series},
    time::{chunkedarray::StringMethods, Duration, DynamicGroupOptions},
};
use serde::Deserialize;
use tauri::http::header::{ACCEPT, CONTENT_TYPE};
use tauri_plugin_http::reqwest;

#[derive(Deserialize)]
struct ProdutoAdicionado {
    id: String,
    nome: String,
    data: String,
}
#[derive(Deserialize)]
struct ProdutoMonitorado {
    id: String,
    nome: String,
    #[serde(alias = "permaneciaEmEstoque")]
    permanecia_em_estoque: i32,
    #[serde(alias = "diasAteRemocaoAposAlerta")]
    dias_ate_remocao_apos_alerta: i32,
    data: String,
}

#[tauri::command]
async fn dados_estatisticas(
    tipo: i32,
    duracao: String,
    url: String,
    inicio: String,
    fim: String,
    inicio_ativo: bool,
    fim_ativo: bool,
) -> (Vec<String>, Vec<f64>, Option<String>) {
    let url_final = match generate_url(tipo, url, inicio, fim, inicio_ativo, fim_ativo) {
        Ok(ur) => ur,
        Err(err) => return (Vec::new(), Vec::new(), Some(err)),
    };
    let mut df = match generate_dados(url_final, tipo).await {
        Ok(df_ok) => df_ok,
        Err(err) => return (Vec::new(), Vec::new(), Some(err)),
    };
    df.apply("datas", sd).unwrap();
    match tipo {
        0 | 1 => {
            let (x, y) = groupy_date_count(df, duracao);
            return (x, y, None);
        }
        2 | 3 => {
            let (x, y) = groupy_date_mean(df, duracao);
            return (x, y, None);
        }
        _ => {
            return (
                Vec::new(),
                Vec::new(),
                Some(String::from_str("Tipo Invaldo").unwrap()),
            );
        }
    }
}

fn generate_url(
    tipo: i32,
    url: String,
    inicio: String,
    fim: String,
    inicio_ativo: bool,
    fim_ativo: bool,
) -> Result<String, String> {
    let mut end_url = url.clone();
    match tipo {
        0 | 1 => end_url.push_str("/api/Estatisticas/Produtos-Adicionados?adicionado="),
        2 | 3 => end_url.push_str("/api/Estatisticas/Produtos-Monitorados?"),
        _ => return Err(String::from("Tipo invalido")),
    }
    match tipo {
        0 => end_url.push_str("true"),
        1 => end_url.push_str("false"),
        _ => (),
    }
    if inicio_ativo {
        end_url.push_str(format!("&inicio={}", inicio).as_str())
    }
    if fim_ativo {
        end_url.push_str(format!("&fim={}", fim).as_str())
    }
    return Ok(end_url);
}

async fn generate_dados(url: String, tipo: i32) -> Result<DataFrame, String> {
    let client = reqwest::Client::new();
    let response = match client
        .get(url)
        .header(CONTENT_TYPE, "application/json")
        .header(ACCEPT, "application/json")
        .send()
        .await
    {
        Ok(res) => res,
        Err(e) => {
            return Err(format!(
                "Erro ao pegar os dados no endpoint, erro: {}",
                e.to_string()
            ))
        }
    };
    match response.status() {
        reqwest::StatusCode::OK => (),
        _ => {
            return Err(format!("Status Code não foi aceito."));
        }
    };
    match tipo {
        0 | 1 => {
            let dados = response.json::<Vec<ProdutoAdicionado>>().await.unwrap();
            let mut datas: Vec<String> = Vec::with_capacity(dados.len());
            let mut valores: Vec<i32> = Vec::with_capacity(dados.len());
            for dado in dados {
                datas.push(dado.data);
                valores.push(1)
            }
            match df!("datas" => datas,"valores" => valores) {
                Ok(df) => return Ok(df),
                Err(e) => return Err(format!("Erro ao gerar o dataFrame, erro:{}", e.to_string())),
            };
        }
        2 => {
            let dados = response.json::<Vec<ProdutoMonitorado>>().await.unwrap();
            let mut datas: Vec<String> = Vec::with_capacity(dados.len());
            let mut valores: Vec<i32> = Vec::with_capacity(dados.len());
            for dado in dados {
                datas.push(dado.data);
                valores.push(dado.permanecia_em_estoque);
            }
            match df!("datas" => datas,"valores" => valores) {
                Ok(df) => return Ok(df),
                Err(e) => return Err(format!("Erro ao gerar o dataFrame, erro:{}", e.to_string())),
            };
        }
        3 => {
            let dados = response.json::<Vec<ProdutoMonitorado>>().await.unwrap();
            let mut datas: Vec<String> = Vec::with_capacity(dados.len());
            let mut valores: Vec<i32> = Vec::with_capacity(dados.len());
            for dado in dados {
                datas.push(dado.data);
                valores.push(dado.dias_ate_remocao_apos_alerta);
            }
            match df!("datas" => datas,"valores" => valores) {
                Ok(df) => return Ok(df),
                Err(e) => return Err(format!("Erro ao gerar o dataFrame, erro:{}", e.to_string())),
            };
        }
        _ => return Err(String::from_str("Tipo inválido").unwrap()),
    }
}

fn groupy_date_count(mut df: DataFrame, duracao: String) -> (Vec<String>, Vec<f64>) {
    df = df
        .lazy()
        .sort(
            ["datas"],
            SortMultipleOptions::default().with_maintain_order(true),
        )
        .group_by_dynamic(
            col("datas"),
            [],
            DynamicGroupOptions {
                every: Duration::parse(&duracao),
                period: Duration::parse(&duracao),
                offset: Duration::parse("0"),
                ..Default::default()
            },
        )
        .agg([col("valores").sum()])
        .collect()
        .unwrap();
    let dates_options = df["datas"].date().unwrap().to_string("%Y-%m-%d");
    let mut dates: Vec<String> = Vec::with_capacity(dates_options.len());
    for i in &dates_options {
        dates.push(i.unwrap().to_string())
    }
    let values_options = df["valores"].i32().unwrap();
    let mut values: Vec<f64> = Vec::with_capacity(values_options.len());
    for i in values_options {
        values.push(i.unwrap().into())
    }
    return (dates, values);
}

fn groupy_date_mean(mut df: DataFrame, duracao: String) -> (Vec<String>, Vec<f64>) {
    df = df
        .lazy()
        .sort(
            ["datas"],
            SortMultipleOptions::default().with_maintain_order(true),
        )
        .group_by_dynamic(
            col("datas"),
            [],
            DynamicGroupOptions {
                every: Duration::parse(&duracao),
                period: Duration::parse(&duracao),
                offset: Duration::parse("0"),
                ..Default::default()
            },
        )
        .agg([col("valores").mean()])
        .collect()
        .unwrap();
    let dates_options = df["datas"].date().unwrap().to_string("%Y-%m-%d");
    let mut dates: Vec<String> = Vec::with_capacity(dates_options.len());
    for i in &dates_options {
        dates.push(i.unwrap().to_string())
    }
    let values_options = df["valores"].f64().unwrap();
    let mut values: Vec<f64> = Vec::with_capacity(values_options.len());
    for i in values_options {
        values.push(i.unwrap())
    }
    return (dates, values);
}
fn sd(str_val: &Series) -> Series {
    str_val
        .str()
        .unwrap()
        .as_date_not_exact(Some("%Y-%m-%d"))
        .unwrap()
        .into_series()
}
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![dados_estatisticas])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
