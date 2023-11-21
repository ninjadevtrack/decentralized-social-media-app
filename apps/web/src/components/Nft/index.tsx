import MetaTags from '@components/Common/MetaTags';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { Card, GridItemEight, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useSearchParams } from 'next/navigation';
import Custom500 from 'src/app/500';
import useOpenseaNft from 'src/hooks/opensea/useOpenseaNft';
import { useEffectOnce } from 'usehooks-ts';

import NftDetails from './Details';
import NftPageShimmer from './Shimmer';

const ViewNft: NextPage = () => {
  const searchParams = useSearchParams();
  const chain = searchParams.get('chain');
  const address = searchParams.get('address');
  const token = searchParams.get('token');

  const {
    data: nft,
    loading,
    error
  } = useOpenseaNft({
    chain: parseInt(chain as string),
    address: address as string,
    token: token as string
  });

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'nft' });
  });

  if (loading) {
    return <NftPageShimmer />;
  }

  if (error) {
    return <Custom500 />;
  }

  return (
    <GridLayout className="pt-6">
      <MetaTags title={`${nft.name} • ${APP_NAME}`} />
      <GridItemEight className="space-y-5">
        <Card>
          <img
            width={500}
            height={500}
            className="h-full w-full rounded-xl"
            src={nft?.image_url.replace('w=500', 'w=1500')}
            alt="nft"
            draggable={false}
          />
        </Card>
      </GridItemEight>
      <NftDetails nft={nft} />
    </GridLayout>
  );
};

export default ViewNft;
