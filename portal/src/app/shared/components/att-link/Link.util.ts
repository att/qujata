import cn from 'classnames';
import { LinkCssClassBySize, LinkCssClassByStyleType } from './Link.const';
import { BaseLinkProps } from './Link.model';

export function getLinkClassName({ className, size, styleType }: BaseLinkProps) {
  return cn(className, LinkCssClassBySize.get(size), LinkCssClassByStyleType.get(styleType));
}
