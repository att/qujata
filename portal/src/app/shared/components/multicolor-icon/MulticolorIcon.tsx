import React, { NamedExoticComponent, ReactNode } from 'react';
import cn from 'classnames';

export interface MulticolorIconProps {
  baseClass: string;
  nameClass: string;
  shapesAmount: number;
  className?: string;
}

export const MulticolorIcon: React.FC<MulticolorIconProps> = (props: MulticolorIconProps) => {
  if (props.shapesAmount < 1) {
    // eslint-disable-next-line no-null/no-null
    return null;
  }
  const items: ReactNode[] = [];
  for (let i: number = 0; i < props.shapesAmount; i += 1) {
    const iconPathClassName: string = `${props.nameClass}-path${i + 1}`;
    items.push(<i key={i} className={iconPathClassName} />);
  }
  return (
    <i className={cn(props.className, props.baseClass, props.nameClass)}>
      {items}
    </i>
  );
};

export const MulticolorIconMemoized: NamedExoticComponent<MulticolorIconProps> = React.memo<MulticolorIconProps>(MulticolorIcon);
