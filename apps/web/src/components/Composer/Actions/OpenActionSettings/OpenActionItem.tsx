import type { OpenAction } from '@hey/data/enums';
import type { FC, ReactNode } from 'react';

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Card } from '@hey/ui';
import {
  ScreenType,
  useOpenActionStore
} from 'src/store/non-persisted/publication/useOpenActionStore';

interface OpenActionItemProps {
  description: string;
  icon: ReactNode;
  selected: boolean;
  title: string;
  type: OpenAction;
}

const OpenActionItem: FC<OpenActionItemProps> = ({
  description,
  icon,
  selected,
  title,
  type
}) => {
  const setScreen = useOpenActionStore((state) => state.setScreen);
  const setSelectedOpenAction = useOpenActionStore(
    (state) => state.setSelectedOpenAction
  );

  const onOpenActionSelected = (name: OpenAction) => {
    setScreen(ScreenType.Config);
    setSelectedOpenAction(name);
  };

  return (
    <Card
      className="flex cursor-pointer items-center justify-between p-5"
      forceRounded
      onClick={() => onOpenActionSelected(type)}
    >
      <div className="flex items-center space-x-3">
        <div className="text-brand-500">{icon}</div>
        <div className="space-y-1">
          <div className="font-bold">{title}</div>
          <div className="text-sm">{description}</div>
        </div>
      </div>
      {selected ? (
        <CheckCircleIcon className="size-5 text-green-500" />
      ) : (
        <ArrowRightIcon className="size-5 text-gray-400" />
      )}
    </Card>
  );
};

export default OpenActionItem;
