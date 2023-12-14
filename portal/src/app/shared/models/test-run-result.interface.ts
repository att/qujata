export interface IResult {
    averageCPU: number;
    averageMemory: number;
    errorRate: number;
    bytesThroughput: number;
    messagesThroughput: number;
    averageTLSHandshakeTime: number;
}

interface ITestRunResultData {
    algorithm: string;
    iterations: number;
    messageSizeBytes: number;
    results: IResult;
}

interface IEnvironmentInfo {
    resourceName: string;
    operatingSystem: string;
    cpu: string;
    cpuArchitecture: string;
    cpuCores: string;
    cpuClockSpeed: string;
    nodeSize: string;
    codeRelease: string;
    testSuiteId: number;
    testSuiteName: string;
}

export interface ITestRunResult {
    environment_info: IEnvironmentInfo;
    testRuns: ITestRunResultData[];
}
