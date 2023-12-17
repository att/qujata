import { ExperimentTable } from './components/experiment-table';
import styles from './Experiment.module.scss';
import { Charts } from './components/charts';
import { SubHeader } from './components/sub-header';
import { ITestResultData } from '../../../../models/test-result.interface';

export const Experiment: React.FC = () => {
  // const { data } = useExperimentData();
  const experimentData: ITestResultData[] = [
    {
      algorithm: 'RSA1',
      iterations: 500,
      messageSizeBytes: 1,
      results: {
        averageCPU: 0.1,
        averageMemory: 0.1,
        errorRate: 0.1,
        bytesThroughput: 0.1,
        messagesThroughput: 0.1,
        averageTLSHandshakeTime: 0.1,
      }
    },
    {
      algorithm: 'RSA2',
      iterations: 100,
      messageSizeBytes: 1,
      results: {
        averageCPU: 0.1,
        averageMemory: 0.1,
        errorRate: 0.1,
        bytesThroughput: 0.1,
        messagesThroughput: 0.1,
        averageTLSHandshakeTime: 0.1,
      }
    },
    {
      algorithm: 'RSA3',
      iterations: 700,
      messageSizeBytes: 1,
      results: {
        averageCPU: 0.1,
        averageMemory: 0.1,
        errorRate: 0.1,
        bytesThroughput: 0.1,
        messagesThroughput: 0.1,
        averageTLSHandshakeTime: 0.1,
      }
    },
    {
      algorithm: 'RSA4',
      iterations: 800,
      messageSizeBytes: 1,
      results: {
        averageCPU: 0.1,
        averageMemory: 0.1,
        errorRate: 0.1,
        bytesThroughput: 0.1,
        messagesThroughput: 0.1,
        averageTLSHandshakeTime: 0.1,
      }
    },
    {
      algorithm: 'RSA5',
      iterations: 900,
      messageSizeBytes: 1,
      results: {
        averageCPU: 0.1,
        averageMemory: 0.1,
        errorRate: 0.1,
        bytesThroughput: 0.1,
        messagesThroughput: 0.1,
        averageTLSHandshakeTime: 0.1,
      }
    },
    {
      algorithm: 'RSA6',
      iterations: 1000,
      messageSizeBytes: 1,
      results: {
        averageCPU: 0.1,
        averageMemory: 0.1,
        errorRate: 0.1,
        bytesThroughput: 0.1,
        messagesThroughput: 0.1,
        averageTLSHandshakeTime: 0.1,
      }
    }
  ];

  return (
      <div className={styles.experiment_wrapper}>
        <SubHeader linkTitle='Experiment Name' />
        <ExperimentTable data={experimentData} />
        <Charts />
      </div>
  );
}

