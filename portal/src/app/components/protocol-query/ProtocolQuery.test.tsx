import '@testing-library/jest-dom';
import { RenderResult, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ProtocolQuery, ProtocolQueryProps } from './ProtocolQuery';
import { PROTOCOL_QUERY_EN } from './translate/en';

describe('ProtocolQuery', () => {
  let props: ProtocolQueryProps;
  beforeAll(() => {
    // Prepare the props for the ProtocolQuery component
    props = {
      isFetching: false,
      canExportFile: true,
      onRunClick: jest.fn(),
      onDownloadDataClicked: jest.fn(),
    };
  });

  test('should render ProtocolQuery', () => {
    // Render the ProtocolQuery component with the prepared props
    const { container }: RenderResult = render(<ProtocolQuery {...props} />);

    // Snapshot Matching
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render spinner when isFetching is true', () => {
    props.isFetching = true;
    render(<ProtocolQuery {...props} />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  test('should call onRunClick when form is submitted', () => {
    render(<ProtocolQuery {...props} />);
    const form = screen.getByTestId('protocol-query-form');
    fireEvent.submit(form);
    expect(props.onRunClick).toHaveBeenCalled();
  });

  test('should check all values were rendered', () => {
    // Render the ProtocolQuery component with the prepared props
    const { getByText }: RenderResult = render(<ProtocolQuery {...props} />);
    
    // Assert that the form elements are rendered
    expect(getByText(PROTOCOL_QUERY_EN.FIELDS_LABEL.ALGORITHM)).toBeInTheDocument();
    expect(getByText(PROTOCOL_QUERY_EN.FIELDS_LABEL.ITERATIONS_NUMBER)).toBeInTheDocument();
    expect(getByText(PROTOCOL_QUERY_EN.ACTION_BUTTONS.RUN)).toBeTruthy();
  });

  test('should handle form submission', async () => {
    render(<ProtocolQuery {...props} />);

    // Find the form and submit it
    const form = screen.getByTestId('protocol-query-form');
    fireEvent.submit(form);

    // Assert that the onRunClick function has been called
    expect(props.onRunClick).toHaveBeenCalled();
  });
});
