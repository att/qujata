import { render, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NavigationTab } from './NavigationTab';

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
describe('NavigationTab', () => {
  test('renders Navigation Tab', () => {
    const { container }: RenderResult = render(<NavigationTab tabs={tabs} />, { wrapper: MemoryRouter });
    expect(container.firstChild).toMatchSnapshot();
  });
});
