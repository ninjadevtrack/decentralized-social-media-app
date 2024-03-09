import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { StarIcon } from '@heroicons/react/24/outline';
import { PROFILE } from '@hey/data/tracking';
import getProfile from '@hey/lib/getProfile';
import { Button, Modal } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import Loader from '../../Loader';
import Slug from '../../Slug';

const FollowModule = dynamic(() => import('./FollowModule'), {
  loading: () => <Loader message="Loading Super follow" />
});

interface SuperFollowProps {
  again?: boolean;
  profile: Profile;
  small?: boolean;
}

const SuperFollow: FC<SuperFollowProps> = ({
  again = false,
  profile,
  small = false
}) => {
  const [showFollowModal, setShowFollowModal] = useState(false);
  const { currentProfile } = useProfileStore();
  const { setShowAuthModal } = useGlobalModalStateStore();

  return (
    <>
      <Button
        aria-label="Super follow"
        className="!px-3 !py-1.5 text-sm"
        onClick={() => {
          if (!currentProfile) {
            setShowAuthModal(true);
            return;
          }
          setShowFollowModal(!showFollowModal);
          Leafwatch.track(PROFILE.OPEN_SUPER_FOLLOW);
        }}
        outline
        size={small ? 'sm' : 'md'}
      >
        Super follow
      </Button>
      <Modal
        icon={<StarIcon className="size-5" />}
        onClose={() => setShowFollowModal(false)}
        show={showFollowModal}
        title={
          <span>
            Super follow <Slug slug={getProfile(profile).slugWithPrefix} />{' '}
            {again ? 'again' : ''}
          </span>
        }
      >
        <FollowModule
          again={again}
          profile={profile}
          setShowFollowModal={setShowFollowModal}
        />
      </Modal>
    </>
  );
};

export default SuperFollow;
