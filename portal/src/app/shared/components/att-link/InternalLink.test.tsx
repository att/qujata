import { render, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { InternalLink, InternalLinkProps } from './InternalLink';
import { LinkSize, LinkStyle } from './Link.model';

describe('InternalLink', () => {
  test('renders large primary link', () => {
    const props: InternalLinkProps = {
      link: 'test-link',
      styleType: LinkStyle.PRIMARY,
      size: LinkSize.LARGE,
      children: undefined,
    };
    const { container }: RenderResult = render(<InternalLink {...props}>large primary link</InternalLink>, { wrapper: MemoryRouter });
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders medium secondary link', () => {
    const props: InternalLinkProps = {
      link: 'test-link',
      styleType: LinkStyle.SECONDARY,
      size: LinkSize.MEDIUM,
      children: undefined,
    };
    const { container }: RenderResult = render(<InternalLink {...props}>medium secondary link</InternalLink>, { wrapper: MemoryRouter });
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders regular link', () => {
    const props: InternalLinkProps = {
      link: 'test-link',
      styleType: LinkStyle.NONE,
      size: LinkSize.NONE,
      queryParams: 'test=2',
      children: undefined,
    };
    const { container }: RenderResult = render(<InternalLink {...props}>regular link</InternalLink>, { wrapper: MemoryRouter });
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders wrapper link', () => {
    const props: InternalLinkProps = {
      link: 'test-link',
      styleType: LinkStyle.WRAPPER,
      size: LinkSize.NONE,
      replaceUrl: true,
      className: 'test-class-name',
      children: undefined,
    };
    const { container }: RenderResult = render(<InternalLink {...props}><span>wrapper link</span></InternalLink>, { wrapper: MemoryRouter });
    expect(container.firstChild).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('test-class-name');
  });
});
