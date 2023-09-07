import { useMemo } from 'react';
import { Link as RouterLink, Path, useResolvedPath } from 'react-router-dom';
import { BaseLinkProps } from './Link.model';
import { getLinkClassName } from './Link.util';

export interface InternalLinkProps extends BaseLinkProps {
  queryParams?: string;
  replaceUrl?: boolean;
}

export const InternalLink: React.FC<InternalLinkProps> = (props: InternalLinkProps) => {
  const pathname: string = useFixReactRouterRelativePathname(props.link);
  return (
    <RouterLink
      to={{
        pathname,
        search: props.queryParams,
      }}
      replace={props.replaceUrl}
      className={getLinkClassName(props)}
      onClick={props.onLinkClick}
      title={props.linkTitle}
      data-cy={props.e2eId}
    >
      {props.children}
    </RouterLink>
  );
};

/*
  https://reactrouter.com/docs/en/v6/upgrading/v5#note-on-link-to-values
  react router Link component support link back "up" to parent routes, using a leading '..' segment
  From some reason it's working fine when "to" is a string but if it's an object it's not working
  To solve it, we will resolve the path here and send the absolute  path to Link component
*/
function useFixReactRouterRelativePathname(pathname: string): string {
  const memoizedTo: Partial<Path> = useMemo<Partial<Path>>(() => ({ pathname }), [pathname]);
  return useResolvedPath(memoizedTo).pathname;
}
