import humanize from '@hey/lib/humanize';
import { Plural } from '@lingui/macro';
import type { FC } from 'react';

import { useGroupMemberCountStore } from './Details';

const Members: FC = () => {
  const membersCount = useGroupMemberCountStore((state) => state.membersCount);

  return (
    <div className="text-left">
      <div className="text-xl">{humanize(membersCount)}</div>
      <div className="lt-text-gray-500">
        <Plural
          value={membersCount}
          zero="Member"
          one="Member"
          other="Members"
        />
      </div>
    </div>
  );
};

export default Members;
