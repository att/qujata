import '@testing-library/jest-dom';
import { RenderResult, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ProtocolQuery, ProtocolQueryProps } from './ProtocolQuery';
import { PROTOCOL_QUERY_EN } from './translate/en';
import { AttSelectOption, AttSelectProps } from '../../shared/components/att-select';
import { handleAlgorithmsSelection } from './utils';

jest.mock('./utils');
jest.mock('../../shared/components/att-select', () => {
  return {
    __esModule: true,
    AttSelect: (props: AttSelectProps) => {
      function onChange() {
        props.onChange({ label: 'regular', value: 'regular' });
      }
      
      return <div onClick={onChange} data-testid='att_select_options'>Options</div>;
    },
  };
});

describe('ProtocolQuery', () => {
  let protocolQueryProps: ProtocolQueryProps;
  let mockOptions: AttSelectOption[];
  let mockAlgosBySection: Record<string, AttSelectOption[]>;
  let mockPrevSelectedValues: string[];

  beforeEach(() => {
    protocolQueryProps = {
      isFetching: false,
      onRunClick: jest.fn(),
      setDuplicateData: jest.fn()
    };

    mockOptions = [{ label: 'test', value: 'test' }];
    mockAlgosBySection = { 'Classic': mockOptions };
    mockPrevSelectedValues = ['value1', 'value2'];

    (handleAlgorithmsSelection as jest.Mock).mockImplementation(() => ({
      newSelectedOptions: [{ label: 'regular', value: 'regular' }],
      selectedValues: ['regular']
    }));
  });

  test('should render ProtocolQuery correctly', async () => {
    const { container, getByTestId, getAllByTestId }: RenderResult = render(<ProtocolQuery {...protocolQueryProps} />);
    const experimentNameInputElement: HTMLElement = getByTestId('experiment_name_input');
    const descriptionInputElement: HTMLElement = getByTestId('description_input');
    const optionsElements: HTMLElement[] = getAllByTestId('att_select_options');

    fireEvent.change(experimentNameInputElement, { target: { value: 'new name' } });
    fireEvent.change(descriptionInputElement, { target: { value: 'new description' } });
    optionsElements.forEach((element) => {
      fireEvent.click(element);
    });
    
    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });

  test('should render spinner when isFetching is true', () => {
    protocolQueryProps.isFetching = true;
    render(<ProtocolQuery {...protocolQueryProps} />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  test('should call onRunClick when form is submitted', () => {
    render(<ProtocolQuery {...protocolQueryProps} />);
    const form = screen.getByTestId('protocol-query-form');
    fireEvent.submit(form);
    expect(protocolQueryProps.onRunClick).toHaveBeenCalled();
  });

  test('should check all values were rendered', () => {
    const { getByText }: RenderResult = render(<ProtocolQuery {...protocolQueryProps} />);
    
    expect(getByText(PROTOCOL_QUERY_EN.FIELDS_LABEL.ALGORITHM)).toBeInTheDocument();
    expect(getByText(PROTOCOL_QUERY_EN.FIELDS_LABEL.ITERATIONS_NUMBER)).toBeInTheDocument();
    expect(getByText(PROTOCOL_QUERY_EN.ACTION_BUTTONS.RUN)).toBeTruthy();
  });

  test('should handle form submission', async () => {
    render(<ProtocolQuery {...protocolQueryProps} />);

    const form = screen.getByTestId('protocol-query-form');
    fireEvent.submit(form);

    expect(protocolQueryProps.onRunClick).toHaveBeenCalled();
  });
});
