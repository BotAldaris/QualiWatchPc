import { Component, onMount } from "solid-js";
import { Chart, Title, Tooltip, Legend, Colors } from "chart.js";
import { Bar } from "solid-chartjs";

interface IProps {
  data: number[];
  labels: string[];
  label: string;
}

const BarChart: Component<IProps> = (props) => {
  onMount(() => {
    Chart.register(Title, Tooltip, Legend, Colors);
  });

  const chartData = {
    labels: props.labels,
    datasets: [
      {
        label: props.label,
        data: props.data,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div>
      <Bar data={chartData} options={chartOptions} width={500} height={500} />
    </div>
  );
};

export default BarChart;
