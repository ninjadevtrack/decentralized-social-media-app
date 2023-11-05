import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { STATIC_IMAGES_URL } from '@hey/data/constants';
import type { Profile } from '@hey/lens';
import { Tooltip } from '@hey/ui';
import { type FC, memo } from 'react';

interface SybilProps {
  profile: Profile;
}

const Sybil: FC<SybilProps> = ({ profile }) => {
  if (!profile?.onchainIdentity?.sybilDotOrg?.verified) {
    return null;
  }

  return (
    <Tooltip
      content={
        <span>
          <span className="flex items-center space-x-1">
            <span>Sybil verified</span>
            <CheckCircleIcon className="h-4 w-4" />
          </span>
          <span>
            X:{' '}
            <b>
              @{profile?.onchainIdentity?.sybilDotOrg?.source?.twitter?.handle}
            </b>
          </span>
        </span>
      }
      placement="top"
    >
      <img
        className="drop-shadow-xl"
        height={75}
        width={75}
        src={`${STATIC_IMAGES_URL}/badges/sybil.png`}
        alt="Sybil Badge"
      />
    </Tooltip>
  );
};

export default memo(Sybil);
