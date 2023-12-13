import { ITestResultData } from '../../../../../../models/test-result.interface';
import { BarChart } from '../../../../../dashboard/components/charts/BarChart';
import styles from './Charts.module.scss';
import { useChartsData } from './hooks/useChartsData';
import { tooltipKeys, tooltipLabels } from './models/bar-chart.const';
import { CHARTS_EN } from './translate/en';
import { getChartTitleByType, getKeysOfData } from './utils/chart.utils';

const testRuns: ITestResultData[] =  [ 
    { 
      algorithm: "Algorithm1", 
      iterations: 1000, 
      messageSizeBytes: 1024, 
      results:  
      { 
        averageCPU: 25.5, 
        averageMemory: 512, 
        errorRate: 0.05, 
        bytesThroughput: 2048000, 
        messagesThroughput: 500, 
        averageTLSHandshakeTime: 10.2 
	  } 
    },
    { 
        algorithm: "Algorithm2", 
        iterations: 1030, 
        messageSizeBytes: 24, 
        results:  
        { 
          averageCPU: 25, 
          averageMemory: 52, 
          errorRate: 0.5, 
          bytesThroughput: 200, 
          messagesThroughput: 0, 
          averageTLSHandshakeTime: 10
        } 
      },
      { 
        algorithm: "Algorithm1", 
        iterations: 103, 
        messageSizeBytes: 2, 
        results:  
        { 
          averageCPU: 25, 
          averageMemory: 22, 
          errorRate: 0.5, 
          bytesThroughput: 200, 
          messagesThroughput: 20, 
          averageTLSHandshakeTime: 1
        } 
      }   
  ]
export const Charts: React.FC = () => {
    const { data , labels } = useChartsData(testRuns);
    const keysOfData: string[] = getKeysOfData(testRuns[0].results);

    return (
        <div className={styles.charts_wrapper}>
          <div className={styles.title}>{CHARTS_EN.TITLE}</div>
          <div className={styles.chart_wrapper}>
            {keysOfData.map((key) => (
                <BarChart title={getChartTitleByType(key)} labels={labels} data={data} tooltipKeys={tooltipKeys} tooltipLabels={tooltipLabels} keyOfData={key} />
            ))}
          </div>
        </div>
    );
}
