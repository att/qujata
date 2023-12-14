export interface IResult {
    averageCPU: number;
    averageMemory: number;
    errorRate: number;
    bytesThroughput: number;
    messagesThroughput: number;
    averageTLSHandshakeTime: number;
}

export interface ITestResultData {
    algorithm: string;
    iterations: number;
    messageSizeBytes: number;
    results: IResult;
}
