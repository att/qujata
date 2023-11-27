import { render, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { InternalLink } from '../att-link';
import { GlobalHeader } from './GlobalHeader';

jest.mock('../att-link');
describe('GlobalHeader', () => {
  test('renders global header ', () => {
    (InternalLink as jest.Mock).mockImplementation(() => <div>InternalLink</div>);
    const { container }: RenderResult = render(<GlobalHeader title='react' />, { wrapper: MemoryRouter });
    expect(container.firstChild).toMatchSnapshot();
  });
});
