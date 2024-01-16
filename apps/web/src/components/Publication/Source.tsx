import type { FC } from 'react';

import { apps } from '@hey/data/apps';
import { STATIC_IMAGES_URL } from '@hey/data/constants';
import getAppName from '@hey/lib/getAppName';
import { Tooltip } from '@hey/ui';

interface SourceProps {
  publishedOn: string;
}

const Source: FC<SourceProps> = ({ publishedOn }) => {
  const show = apps.includes(publishedOn);

  if (!show) {
    return null;
  }

  const appName = getAppName(publishedOn);

  return (
    <Tooltip content={appName} placement="top">
      <img
        alt={appName}
        className="mt-0.5 size-3.5 rounded-sm"
        src={`${STATIC_IMAGES_URL}/source/${publishedOn}.jpeg`}
      />
    </Tooltip>
  );
};

export default Source;
