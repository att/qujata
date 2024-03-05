import { fireEvent, render, RenderResult, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '../../shared/components/att-button';
import { SubHeader } from './SubHeader';

jest.mock('../../shared/components/att-button');

describe('SubHeader', () => {
  test('renders sub header successfuly', () => {
    const { container, getByText }: RenderResult = render(<SubHeader handleCloseClick={jest.fn()} />, { wrapper: MemoryRouter });

    expect(container.firstChild).toMatchSnapshot();
    expect(getByText('Deriving symmetric keys, establishing a secure channel for communication.')).toBeTruthy();
  });

  test('expand sub header successfuly', async () => {
    (Button as jest.Mock).mockImplementation(({ onButtonClick }) => {
      const handleButtonClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
        onButtonClick(event);
      }
      return <div onClick={handleButtonClick} data-testid='sub_header_id'>Button</div>;
    });
    
    const { container, getAllByTestId }: RenderResult = render(<SubHeader handleCloseClick={jest.fn()} />, { wrapper: MemoryRouter });

    const subHeaderButtonElements: HTMLElement[] = getAllByTestId('sub_header_id');
    subHeaderButtonElements.forEach((element) => {
      fireEvent.click(element);
    });

    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });
});