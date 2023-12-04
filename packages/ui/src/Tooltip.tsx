import type { FC, ReactNode } from 'react';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface TooltipProps {
  children: ReactNode;
  className?: string;
  content: ReactNode;
  placement?: 'right' | 'top';
  withDelay?: boolean;
}

export const Tooltip: FC<TooltipProps> = ({
  children,
  className = '',
  content,
  placement = 'right',
  withDelay = false
}) => {
  return (
    <Tippy
      className="hidden !rounded-lg !text-xs !leading-6 tracking-wide sm:block"
      content={<span className={className}>{content}</span>}
      delay={[withDelay ? 500 : 0, 0]}
      duration={0}
      placement={placement}
    >
      <span>{children}</span>
    </Tippy>
  );
};
