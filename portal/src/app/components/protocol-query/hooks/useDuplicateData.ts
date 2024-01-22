import { useEffect } from 'react';
import { AttSelectOption } from '../../../shared/components/att-select';
import { ExperimentData } from '../../all-experiments/hooks';

export type DuplicateData = {
  data: ExperimentData | undefined,
  setDuplicateData: (data: any) => void,
  setExperimentName: (name: string) => void,
  setAlgorithms: (options: AttSelectOption[]) => void,
  setIterationsCount: (options: AttSelectOption[]) => void
}
export const useDuplicateData = (duplicate: DuplicateData) => {
  useEffect(() => {
    if (duplicate.data) {
      const duplicateData = duplicate.data;
      if (duplicateData.name) {
        duplicate.setExperimentName(duplicateData.name);
      }
      if (duplicateData.algorithms) {
        const algorithmOptions = duplicateData.algorithms.map((algorithm: string) => {
          return { label: algorithm, value: algorithm } as AttSelectOption;
        });
        duplicate.setAlgorithms(algorithmOptions);
      }

      if (duplicateData.iterations) {
        const iterationsOptions = duplicateData.iterations.map((iteration: number) => {
          return { label: iteration.toString(), value: iteration.toString() } as AttSelectOption;
        });
        duplicate.setIterationsCount(iterationsOptions);
      }
      duplicate.setDuplicateData(undefined);
    }
  }, [duplicate]);
};
