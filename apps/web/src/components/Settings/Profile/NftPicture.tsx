import { PhotographIcon } from '@heroicons/react/outline';
import type { Profile } from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import getAvatar from '@lenster/lib/getAvatar';
import { Button, Image } from '@lenster/ui';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';

import NftAvatarModal from './NftAvatarModal';

interface NftPictureProps {
  profile: Profile;
}

const NftPicture: FC<NftPictureProps> = ({ profile }) => {
  const [showNftAvatarModal, setShowNftAvatarModal] = useState<boolean>(false);

  return (
    <div className="space-y-3">
      <Image
        src={getAvatar(profile)}
        loading="lazy"
        className={'max-w-xs rounded-lg'}
        alt={formatHandle(profile?.handle)}
      />
      <Button
        icon={<PhotographIcon className="h-4 w-4" />}
        onClick={() => setShowNftAvatarModal(true)}
      >
        <Trans>Choose NFT avatar</Trans>
      </Button>
      <NftAvatarModal
        showNftAvatarModal={showNftAvatarModal}
        setShowNftAvatarModal={setShowNftAvatarModal}
      />
    </div>
  );
};

export default NftPicture;
