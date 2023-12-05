import { render, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { InternalLink } from '../att-link';
import { GlobalHeader } from './GlobalHeader';

const tabs = [
  {
    link: '/',
    title: 'Home',
  },
  {
    link: '/all-experiments',
    title: 'All Experiments',
  }
];
jest.mock('../att-link');
describe('GlobalHeader', () => {
  test('renders global header ', () => {
    (InternalLink as jest.Mock).mockImplementation(() => <div>InternalLink</div>);
    const { container }: RenderResult = render(<GlobalHeader tabs={tabs} />, { wrapper: MemoryRouter });
    expect(container.firstChild).toMatchSnapshot();
  });
});
