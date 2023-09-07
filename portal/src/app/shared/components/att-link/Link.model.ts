export interface BaseLinkProps {
  link: string;
  linkTitle?: string;
  styleType: LinkStyle;
  size: LinkSize;
  className?: string;
  children: React.ReactNode;
  onLinkClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  e2eId?: string;
}

interface IBaseLink {
  link: string;
  linkTitle?: string;
  styleType: LinkStyle;
  size: LinkSize;
  className?: string;
  e2eId?: string;
  target?: LinkTarget;
  rel?: LinkRel;
  text: string;
}

export interface IExternalLink extends IBaseLink {
  target?: LinkTarget;
  rel?: LinkRel;
}

export enum LinkStyle {
  PRIMARY,
  SECONDARY,
  WRAPPER,
  TEXT,
  NONE,
}

export enum LinkSize {
  SMALL,
  MEDIUM,
  LARGE,
  NONE,
}

export enum LinkTarget {
  BLANK = '_blank',
  SELF = '_self',
  PARENT = '_parent',
  TOP = '_top',
  FRAMENAME = 'framename',
}

export enum LinkRel {
  ALTERNATE = 'alternate',
  AUTHOR = 'author',
  BOOKMARK = 'bookmark',
  EXTERNAL = 'external',
  HELP = 'help',
  LICENSE = 'license',
  NEXT = 'next',
  NO_OPENER = 'noopener',
  NOFOLLOW = 'nofollow',
  NONE = '',
  NOREFERRER = 'noreferrer',
  PREV = 'prev',
  SEARCH = 'search',
  TAG = 'tag',
}
