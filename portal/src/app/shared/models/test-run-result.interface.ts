export interface IResult {
    averageCPU: number;
    averageMemory: number;
}

export interface ITestRunResultData {
    id: number;
    algorithm: string;
    iterations: number;
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
