import { render, fireEvent } from '@testing-library/react';
import { Experiments } from './Experiments';
import { useExperimentsData } from './hooks';
import { FetchDataStatus, useFetch } from '../../shared/hooks/useFetch';

jest.mock('./hooks');
jest.mock('../../shared/hooks/useFetch');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Experiments', () => {
  it('renders correctly', () => {
    (useExperimentsData as jest.Mock).mockReturnValue({
      test_suites: [{
        id: 15,
        name: "Experiment 1",
        end_time: 1705240065192,
        test_runs: [
          {
            id: 354,
            algorithm: "prime256v1",
            iterations: 100
          },
          {
            id: 355,
            algorithm: "prime256v1",
            iterations: 500
          }
        ]
      }],
      status: FetchDataStatus.Fetching,
    });
    (useFetch as jest.Mock).mockReturnValue({
      post: jest.fn(),
      status: FetchDataStatus.Fetching,
      error: null,
      cancelRequest: jest.fn(),
    });

    const { container } = render(<Experiments />);
    expect(container).toMatchSnapshot();
  });
});