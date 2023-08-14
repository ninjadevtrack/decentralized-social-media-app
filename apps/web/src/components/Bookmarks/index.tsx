import MetaTags from '@components/Common/MetaTags';
import RecommendedProfiles from '@components/Home/RecommendedProfiles';
import Trending from '@components/Home/Trending';
import FeedFocusType from '@components/Shared/FeedFocusType';
import Footer from '@components/Shared/Footer';
import { APP_NAME } from '@lenster/data/constants';
import { FeatureFlag } from '@lenster/data/feature-flags';
import { PAGEVIEW } from '@lenster/data/tracking';
import type { PublicationMainFocus } from '@lenster/lens';
import isFeatureEnabled from '@lenster/lib/isFeatureEnabled';
import { GridItemEight, GridItemFour, GridLayout } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import type { NextPage } from 'next';
import { useState } from 'react';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { useEffectOnce } from 'usehooks-ts';

import Feed from './Feed';

const Bookmarks: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [focus, setFocus] = useState<PublicationMainFocus>();
  const isTrendingWidgetEnabled = isFeatureEnabled(FeatureFlag.TrendingWidget);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'bookmarks' });
  });

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={t`Bookmarks • ${APP_NAME}`} />
      <GridItemEight className="space-y-5">
        <FeedFocusType focus={focus} setFocus={setFocus} />
        <Feed focus={focus} />
      </GridItemEight>
      <GridItemFour>
        {isTrendingWidgetEnabled && <Trending />}
        {currentProfile ? <RecommendedProfiles /> : null}
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Bookmarks;
