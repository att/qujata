import { ITestRunResult, ITestRunResultData } from '../../../shared/models/test-run-result.interface';

export type TestRunSubset = Pick<ITestRunResultData, 'id' | 'algorithm' | 'iterations' | 'message_size'>;
export type Experiment = Pick<ITestRunResult, 'id' | 'name' | 'end_time'> & { test_runs: TestRunSubset[] };

export interface ExperimentData {
    id: number;
    name: string;
    algorithms: string[];
    iterations: number[];
    message_sizes: number[];
    end_time: number;
};
