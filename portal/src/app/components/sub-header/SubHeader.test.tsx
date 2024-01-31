import { render, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '../../shared/components/att-button';
import { SubHeader } from './SubHeader';

jest.mock('../../shared/components/att-button');

describe('SubHeader', () => {
  test('renders sub header ', () => {
    (Button as jest.Mock).mockImplementation(() => <div>Button</div>);
    const { container, getByText }: RenderResult = render(<SubHeader handleCloseClick={jest.fn()} />, { wrapper: MemoryRouter });
    expect(container.firstChild).toMatchSnapshot();
    expect(getByText('That’s what we are doing on each iteration:')).toBeTruthy();
  });
});