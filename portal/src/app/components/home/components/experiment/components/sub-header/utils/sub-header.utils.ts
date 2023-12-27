import { uniq } from "lodash";
import { ITestRunResultData } from "../../../../../../../shared/models/test-run-result.interface";

export function getAlgorithmsName(data: ITestRunResultData[]): string {
    const algorithms: string[] = data.map((item: ITestRunResultData) => item.algorithm);
    const uniqueAlgorithms: string[] = uniq(algorithms);

    return uniqueAlgorithms.join(', ');;
}

export function getIterations(data: ITestRunResultData[]): string {
    const iterations: number[] = data.map((item: ITestRunResultData) => item.iterations);
    const uniqueIterations: number[] = uniq(iterations);
    const orderIterations: number[] = uniqueIterations.sort((a: number, b: number) => a - b);

    return orderIterations.join(', ');;
}
