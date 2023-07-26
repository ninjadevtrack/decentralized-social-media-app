import MetaTags from '@components/Common/MetaTags';
import { APP_NAME } from '@lenster/data/constants';
import { FeatureFlag } from '@lenster/data/feature-flags';
import { PAGEVIEW } from '@lenster/data/tracking';
import isFeatureEnabled from '@lenster/lib/isFeatureEnabled';
import {
  GridItemEight,
  GridItemFour,
  GridLayout,
  PageLoading
} from '@lenster/ui';
import fetchCommunity from '@lib/communities/fetchCommunity';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';
import DeleteSettings from './Delete';

const DangerSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const isCommunitiesEnabled = isFeatureEnabled(FeatureFlag.Communities);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, {
      page: 'community-settings',
      subpage: 'danger'
    });
  });

  const {
    query: { slug }
  } = useRouter();

  const { data, isLoading, error } = useQuery(['community', slug], () =>
    fetchCommunity(slug as string).then((res) => res)
  );

  if (!isCommunitiesEnabled) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  if (isLoading) {
    return <PageLoading message={t`Loading settings`} />;
  }

  const community = data;

  if (!currentProfile || !community || community.admin !== currentProfile.id) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={t`Delete Community • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar community={community} />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <DeleteSettings community={community} />
      </GridItemEight>
    </GridLayout>
  );
};

export default DangerSettings;
