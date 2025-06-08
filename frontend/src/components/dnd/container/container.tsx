import { forwardRef } from 'react';
import classNames from 'classnames';
import { Action } from '../action';
import { Handle } from '../handle';
import { Remove } from '../remove';

import './dnd-container.css';

export interface Props {
  children: React.ReactNode;
  columns?: number;
  label?: string;
  style?: React.CSSProperties;
  horizontal?: boolean;
  hover?: boolean;
  handleProps?: React.HTMLAttributes<any>;
  scrollable?: boolean;
  shadow?: boolean;
  placeholder?: boolean;
  unstyled?: boolean;
  onClick?(): void;
  onRemove?(): void;
  onAdd?(): void;
}

export const Container = forwardRef<HTMLButtonElement & HTMLDivElement, Props>(
  (
    {
      children,
      columns = 1,
      handleProps,
      horizontal,
      hover,
      onClick,
      onRemove,
      onAdd,
      label,
      placeholder,
      style,
      scrollable,
      shadow,
      unstyled,
      ...props
    }: Props,
    ref,
  ) => {
    const Component = onClick ? 'button' : 'div';

    return (
      <Component
        {...props}
        ref={ref}
        style={
          {
            ...style,
            '--columns': columns,
          } as React.CSSProperties
        }
        className={classNames(
          'dnd-container',
          unstyled && 'unstyled',
          horizontal && 'horizontal',
          hover && 'hover',
          placeholder && 'placeholder',
          scrollable && 'scrollable',
          shadow && 'shadow',
        )}
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
      >
        {label ? (
          <div className="dnd-container_header">
            {label}
            <div className="dnd-container_actions">
              {onRemove ? <Remove onClick={onRemove} /> : undefined}
              {onAdd ? (
                <Action
                  onClick={onAdd}
                  active={{ fill: 'rgba(0,200,0,0.95)', background: 'rgba(0,200,0,0.1)' }}
                  style={{ margin: '0 4px' }}
                >
                  <svg width="12" height="12" viewBox="0 0 20 20">
                    <path d="M10 0a1 1 0 0 1 1 1v8h8a1 1 0 1 1 0 2h-8v8a1 1 0 1 1-2 0v-8H1a1 1 0 1 1 0-2h8V1a1 1 0 0 1 1-1z" />
                  </svg>
                </Action>
              ) : undefined}
              <Handle {...handleProps} />
            </div>
          </div>
        ) : null}
        {placeholder ? children : <ul>{children}</ul>}
      </Component>
    );
  },
);
