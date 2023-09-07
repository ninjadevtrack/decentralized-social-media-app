import MetaTags from '@components/Common/MetaTags';
import { APP_NAME } from '@lenster/data/constants';
import { PAGEVIEW } from '@lenster/data/tracking';
import { Card, GridItemEight, GridLayout } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import type { NextPage } from 'next';
import NotLoggedIn from 'src/pages/notloggedin';
import { useAppStore } from 'src/store/app';
import { useEffectOnce } from 'usehooks-ts';

import PreviewList from './PreviewList';

const NoConversationSelected = () => {
  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'messages' });
  });

  return (
    <div className="flex h-full flex-col text-center">
      <div className="m-auto">
        <span className="text-center text-5xl">👋</span>
        <h3 className="mb-2 mt-3 text-lg">
          <Trans>Select a conversation</Trans>
        </h3>
        <p className="text-md lt-text-gray-500 max-w-xs">
          <Trans>
            Choose an existing conversation or create a new one to start
            messaging
          </Trans>
        </p>
      </div>
    </div>
  );
};

const Messages: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout classNameChild="md:gap-8">
      <MetaTags title={t`Messages • ${APP_NAME}`} />
      <PreviewList />
      <GridItemEight className="xs:hidden xs:mx-2 mb-0 h-[calc(100vh-8rem)] sm:mx-2 sm:hidden md:col-span-8 md:hidden lg:block">
        <Card className="h-full">
          <NoConversationSelected />
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Messages;
