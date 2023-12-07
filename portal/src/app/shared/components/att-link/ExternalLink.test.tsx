import { render, RenderResult } from '@testing-library/react';
import { ExternalLink, ExternalLinkProps } from './ExternalLink';
import { LinkRel, LinkSize, LinkStyle, LinkTarget } from './Link.model';

describe('ExternalLink', () => {
  test('renders external wrapper link', () => {
    const props: ExternalLinkProps = {
      link: 'test-link',
      styleType: LinkStyle.WRAPPER,
      size: LinkSize.NONE,
      target: LinkTarget.SELF,
      rel: LinkRel.NO_OPENER,
      children: undefined,
    };
    const { container }: RenderResult = render(<ExternalLink {...props}><span>external wrapper link</span></ExternalLink>);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders external link', () => {
    const props: ExternalLinkProps = {
      link: 'test-link',
      styleType: LinkStyle.NONE,
      size: LinkSize.NONE,
      target: LinkTarget.SELF,
      rel: LinkRel.NO_OPENER,
      className: 'test-class-name',
      children: undefined,
    };
    const { container }: RenderResult = render(<ExternalLink {...props}>external link</ExternalLink>);
    expect(container.firstChild).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('test-class-name');
  });

  test('renders external link with default target and rel attributes', () => {
    const props: ExternalLinkProps = {
      link: 'test-link',
      styleType: LinkStyle.NONE,
      size: LinkSize.NONE,
      className: 'test-class-name',
      children: undefined,
    };
    const { container }: RenderResult = render(<ExternalLink {...props}>external link</ExternalLink>);
    expect(container.firstChild).toMatchSnapshot();
  });
});
