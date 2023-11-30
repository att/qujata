import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';

const dataObject = [
    {
        algorithm: "Algorithm1",
        iterations: 1000,
        messageSizeBytes: 102,
        results: {
            averageCPU: 25,
            averageMemory: 512,
            errorRate: 0.05,
            bytesThroughput: 2048000,
            messagesThroughput: 500,
            averageTLSHandshakeTime: 10.2
        }
    },
    {
        algorithm: "Algorithm1",
        iterations: 1,
        messageSizeBytes: 12,
        results: {
            averageCPU: 5,
            averageMemory: 512,
            errorRate: 0.05,
            bytesThroughput: 2048000,
            messagesThroughput: 500,
            averageTLSHandshakeTime: 10.2
        }
    },
    {
        algorithm: "Algorithm2",
        iterations: 2000,
        messageSizeBytes: 124,
        results: {
            averageCPU: 28,
            averageMemory: 512,
            errorRate: 0.05,
            bytesThroughput: 2048000,
            messagesThroughput: 500,
            averageTLSHandshakeTime: 10.2
        }
    }
];

function getLabels(): string[] {
    const labels: string[] = [];
    dataObject.forEach((value, key) => {
        labels.push(value.algorithm);
    });
    return labels;
}

function sortData(dataObject: any[]) {
    return dataObject.sort((a, b) => {
        if (a.algorithm < b.algorithm) return -1;
        if (a.algorithm > b.algorithm) return 1;
        if (a.iterations < b.iterations) return -1;
        if (a.iterations > b.iterations) return 1;
        if (a.messageSizeBytes < b.messageSizeBytes) return -1;
        if (a.messageSizeBytes > b.messageSizeBytes) return 1;
        return 0;
    });
}
const colors: string[] = ['#05BBFF', '#086CE1', '#FF8500', 'rgba(54, 162, 235, 0.2)'];

let options: any = {
    scales: {
        x: {
          display: false, // Hide x-axis labels
        },
        y: {
          // y-axis options...
        },
    },
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Memory (%)',
        },
    }
};
export const BarChart: React.FC = () => {
    Chart.register(...registerables);

    const sortedData = sortData(dataObject);
    console.log('sortedData---', sortedData);

    const labels = sortedData.map((obj, index) => `${obj.algorithm}-${index}`);
    // const labels = sortedData.map(data => data.algorithm);
    console.log('labels---', labels);

    const dataValues = dataObject.map((obj: any) => obj.results.averageCPU);
    console.log('dataValues---', dataValues);

    // Create a dataset for each algorithm
    const datasets = labels.map((label, i) => ({
        label: label,
        data: [dataValues[i]],
        backgroundColor: colors[i % colors.length],
        borderWidth: 0,
    }));
    const data: {labels: string[], datasets: any} = {
        labels: labels,
        datasets: datasets,
    };

    options = {
        ...options,
        plugins: {
          tooltip: {
            displayColors: false,
            callbacks: {
              title: function (context: any) {
                const index = context[0].datasetIndex;
                return labels[index]; // Show algorithm name as title
              },
              label: function (context: any) {
                const index = context.datasetIndex;
                const cpu = dataValues[index];
                const size = sortedData[index].messageSizeBytes;
                const iterations = sortedData[index].iterations;
                return `${cpu} (Message Size: ${size}, Iterations: ${iterations})`;
              },
            },
          },
        },
      };

    return (
        <Bar data={data} options={options} />
    );
}