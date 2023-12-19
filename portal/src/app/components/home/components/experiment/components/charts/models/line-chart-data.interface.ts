interface IDatasets {
    label: string;
    data: any;
    fill: boolean;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
}

export interface ILineChartData {
    labels: number[];
    datasets: IDatasets[];
}
