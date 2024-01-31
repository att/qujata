import { ITestRunResult, ITestRunResultData } from '../../../shared/models/test-run-result.interface';

export type TestRunSubset = Pick<ITestRunResultData, 'id' | 'algorithm' | 'iterations'>;
export type Experiment = Pick<ITestRunResult, 'id' | 'name' | 'end_time'> & { test_runs: TestRunSubset[] };

export interface ExperimentData {
    id: number;
    name: string;
    algorithms: string[];
    iterations: number[];
    end_time: number;
};
