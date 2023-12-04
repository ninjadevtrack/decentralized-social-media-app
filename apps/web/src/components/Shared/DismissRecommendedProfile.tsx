import type { Profile } from '@hey/lens';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { PROFILE } from '@hey/data/tracking';
import { useDismissRecommendedProfilesMutation } from '@hey/lens';
import { Leafwatch } from '@lib/leafwatch';
import { type FC } from 'react';

interface DismissRecommendedProfileProps {
  dismissPosition?: number;
  dismissSource?: string;
  profile: Profile;
}

const DismissRecommendedProfile: FC<DismissRecommendedProfileProps> = ({
  dismissPosition,
  dismissSource,
  profile
}) => {
  const [dismissRecommendedProfile] = useDismissRecommendedProfilesMutation({
    update: (cache) => {
      cache.evict({ id: cache.identify(profile) });
    },
    variables: { request: { dismiss: [profile.id] } }
  });

  const handleDismiss = async () => {
    await dismissRecommendedProfile();
    Leafwatch.track(PROFILE.DISMISS_RECOMMENDED_PROFILE, {
      ...(dismissSource && { dismiss_source: dismissSource }),
      ...(dismissPosition && { dismiss_position: dismissPosition }),
      dismiss_target: profile.id
    });
  };

  return (
    <button onClick={handleDismiss}>
      <XMarkIcon className="h-4 w-4 text-gray-500" />
    </button>
  );
};

export default DismissRecommendedProfile;
