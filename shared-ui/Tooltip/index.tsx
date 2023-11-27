import * as TooltipRadix from '@radix-ui/react-tooltip';
import './style.css';
import { ReactNode } from 'react';

interface ITooltipProps {
  children: ReactNode;
  title: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip = ({ children, title, side }: ITooltipProps) => {
  return (
    <TooltipRadix.Provider delayDuration={50}>
      <TooltipRadix.Root>
        <TooltipRadix.Trigger asChild>{children}</TooltipRadix.Trigger>
        <TooltipRadix.Portal>
          <TooltipRadix.Content
            className='TooltipContent'
            sideOffset={5}
            side={side}
          >
            {title}
            <TooltipRadix.Arrow className='TooltipArrow' />
          </TooltipRadix.Content>
        </TooltipRadix.Portal>
      </TooltipRadix.Root>
    </TooltipRadix.Provider>
  );
};

export default Tooltip;
