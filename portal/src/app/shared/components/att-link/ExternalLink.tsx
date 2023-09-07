import { BaseLinkProps, LinkRel, LinkTarget } from './Link.model';
import { getLinkClassName } from './Link.util';

export interface ExternalLinkProps extends BaseLinkProps {
  target?: LinkTarget;
  rel?: LinkRel;
}

export const ExternalLink: React.FC<ExternalLinkProps> = (props: ExternalLinkProps) => (
  <a
    href={props.link}
    target={props.target || LinkTarget.SELF}
    rel={props.rel || LinkRel.NONE}
    className={getLinkClassName(props)}
    onClick={props.onLinkClick}
    title={props.linkTitle}
    data-cy={props.e2eId}
  >
    {props.children}
  </a>
);
