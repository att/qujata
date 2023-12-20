export interface IResult extends Partial<ITestRunPlaceholders> {
    averageCPU: number;
    averageMemory: number;
}

export interface ITestRunResultData {
    id: number;
    algorithm: string;
    iterations: number;
    messageSizeBytes?: number;
    results: IResult;
}

// This interface is a placeholder for the table columns which are not implemented yet (N/A)
export interface ITestRunPlaceholders {
    errorRate?: number;
    bytesThroughput?: number;
    messagesThroughput?: number;
    averageTLSHandshakeTime?: number;
}

export interface IEnvironmentInfo {
    codeRelease: string;
    cpu: string;
    cpuArchitecture: string;
    cpuClockSpeed: string;
    cpuCores: number;
    nodeSize: string;
    operatingSystem: string;
    resourceName: string;
}

export interface ITestRunResult {
    id: number;
    name: string;
    description: string;
    start_time: string;
    end_time: string;
    environment_info: IEnvironmentInfo;
    testRuns: ITestRunResultData[];
}
