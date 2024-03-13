import type { FollowersRequest, Profile } from '@hey/lens';
import type { FC } from 'react';

import UserProfile from '@components/Shared/UserProfile';
import { ArrowLeftIcon, UsersIcon } from '@heroicons/react/24/outline';
import { ProfileLinkSource } from '@hey/data/tracking';
import { LimitType, useFollowersQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import Link from 'next/link';
import { Virtuoso } from 'react-virtuoso';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import ProfileListShimmer from './ProfileListShimmer';

interface FollowersProps {
  handle: string;
  profileId: string;
}

const Followers: FC<FollowersProps> = ({ handle, profileId }) => {
  const { currentProfile } = useProfileStore();

  // Variables
  const request: FollowersRequest = {
    limit: LimitType.TwentyFive,
    of: profileId
  };

  const { data, error, fetchMore, loading } = useFollowersQuery({
    skip: !profileId,
    variables: { request }
  });

  const followers = data?.followers?.items;
  const pageInfo = data?.followers?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  if (loading) {
    return <ProfileListShimmer />;
  }

  if (followers?.length === 0) {
    return (
      <EmptyState
        hideCard
        icon={<UsersIcon className="size-8" />}
        message={
          <div>
            <span className="mr-1 font-bold">@{handle}</span>
            <span>doesn’t have any followers yet.</span>
          </div>
        }
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load followers"
      />
    );
  }

  return (
    <Card className="divide-y-[1px] dark:divide-gray-700">
      <div className="flex items-center space-x-3 p-5">
        <Link href={`/u/${handle}`}>
          <ArrowLeftIcon className="size-5" />
        </Link>
        <b className="text-lg">Followers</b>
      </div>
      <Virtuoso
        className="virtual-profile-list-window"
        data={followers}
        endReached={onEndReached}
        itemContent={(_, follower) => {
          return (
            <div className="p-5">
              <UserProfile
                profile={follower as Profile}
                showBio
                showFollowUnfollowButton={currentProfile?.id !== follower.id}
                showUserPreview={false}
                source={ProfileLinkSource.Followers}
              />
            </div>
          );
        }}
        useWindowScroll
      />
    </Card>
  );
};

export default Followers;
