export interface IResult {
    average_cpu: number;
    average_memory: number;
    bytes_throughput: number;
    request_throughput: number;
}

export interface ITestRunResultData {
    id: number;
    algorithm: string;
    iterations: number;
    message_size: number;
    results: IResult;
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
    start_time: number;
    end_time: number;
    environment_info: IEnvironmentInfo;
    test_runs: ITestRunResultData[];
}
