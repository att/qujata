import { ExperimentTable } from './components/experiment-table';
import styles from './Experiment.module.scss';
import { Charts } from './components/charts';
import { SubHeader } from './components/sub-header';
import { ITestRunResult } from '../../../../shared/models/test-run-result.interface';

export const Experiment: React.FC = () => {
  const experimentData: ITestRunResult = {
    "id": 1,
    "name": "test1",
    "description": "test1",
    "start_time": "Thu, 14 Dec 2023 15:37:31 GMT",
    "end_time": "Thu, 14 Dec 2023 15:38:39 GMT",
    "environment_info": {
      "codeRelease": "1.1.0",
      "cpu": "RELACE_WITH_CPU",
      "cpuArchitecture": "RELACE_WITH_CPU_ARCHITECTURE",
      "cpuClockSpeed": "RELACE_WITH_CLOCK_SPEED",
      "cpuCores": 0,
      "nodeSize": "RELACE_WITH_NODE_SIZE",
      "operatingSystem": "RELACE_WITH_OPERATING_SYSTEM",
      "resourceName": "RELACE_WITH_RESOURCE_NAME"
    },
   
    "testRuns": [
      {
        "id":1,
        "algorithm": "bikel1",
        "iterations": 1000,
        "results": {
          "averageCPU": 3.5,
          "averageMemory": 3
        }
      },
      {
        "id":2,
        "algorithm": "bikel1",
        "iterations": 2000,
        "results": {
          "averageCPU": 7.0,
          "averageMemory": 6
        }
      },
      {
       "id":3,
        "algorithm": "kyber512",
        "iterations": 1000,
        "results": {
          "averageCPU": 1.7,
          "averageMemory": 2
        }
      },
      {
        "id":4,
        "algorithm": "kyber512",
        "iterations": 2000,
        "results": {
          "averageCPU": 2.6,
          "averageMemory": 2
        }
      }
    ]
  };

  return (
      <div className={styles.experiment_wrapper}>
        <SubHeader linkTitle='Experiment Name' />
        <ExperimentTable data={experimentData} />
        <Charts />
      </div>
  );
}

