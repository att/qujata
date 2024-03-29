import { renderHook } from '@testing-library/react-hooks';
import { useDuplicateData, DuplicateData } from './useDuplicateData';
import { AttSelectOption } from '../../../shared/components/att-select';
import { ExperimentData } from '../../all-experiments/models/experiments.interface';

describe('useDuplicateData', () => {
  it('should set experiment name, algorithms, and iterations count when duplicate data is provided', () => {
    const setExperimentName = jest.fn();
    const setAlgorithms = jest.fn();
    const setIterationsCount = jest.fn();
    const setMessageSize = jest.fn();
    const setDuplicateData = jest.fn();

    const duplicateData: ExperimentData = {
      id: 1111,
      name: 'test',
      algorithms: ['algorithm1', 'algorithm2'],
      iterations: [1, 2, 3],
      message_sizes: [4, 5, 6],
      end_time: 1705240065192,
    };

    const { rerender } = renderHook((props: DuplicateData) => useDuplicateData(props), {
      initialProps: {
        data: undefined,
        setDuplicateData,
        setExperimentName,
        setAlgorithms,
        setIterationsCount,
        setMessageSize,
      } as DuplicateData
    });

    expect(setExperimentName).not.toHaveBeenCalled();
    expect(setAlgorithms).not.toHaveBeenCalled();
    expect(setIterationsCount).not.toHaveBeenCalled();
    expect(setDuplicateData).not.toHaveBeenCalled();

    rerender({
      data: duplicateData,
      setDuplicateData,
      setExperimentName,
      setAlgorithms,
      setIterationsCount,
      setMessageSize
    });

    expect(setExperimentName).toHaveBeenCalledWith(duplicateData.name);
    expect(setAlgorithms).toHaveBeenCalledWith(duplicateData.algorithms.map(algorithm => ({ label: algorithm, value: algorithm } as AttSelectOption)));
    expect(setIterationsCount).toHaveBeenCalledWith(duplicateData.iterations.map(iteration => ({ label: iteration.toString(), value: iteration.toString() } as AttSelectOption)));
    expect(setMessageSize).toHaveBeenCalledWith(duplicateData.message_sizes.map(messageSize => ({ label: messageSize.toString(), value: messageSize.toString() } as AttSelectOption)));
    expect(setDuplicateData).toHaveBeenCalledWith(undefined);
  });
});
