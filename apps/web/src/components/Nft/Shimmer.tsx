import type { FC } from 'react';

import Footer from '@components/Shared/Footer';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';

const NftPageShimmer: FC = () => {
  return (
    <GridLayout>
      <GridItemEight className="space-y-5">
        <img
          className="shimmer h-full w-full rounded-xl"
          height={500}
          width={500}
        />
      </GridItemEight>
      <GridItemFour className="space-y-5">
        <Card className="flex justify-between p-5">
          <div className="shimmer h-3 w-1/2 rounded-lg" />
          <div className="shimmer h-3 w-1/4 rounded-lg" />
        </Card>
        <Card className="flex justify-between p-5">
          <div className="shimmer h-3 w-1/2 rounded-lg" />
          <div className="shimmer h-3 w-1/4 rounded-lg" />
        </Card>
        <Card className="flex justify-between p-5">
          <div className="shimmer h-3 w-1/2 rounded-lg" />
          <div className="shimmer h-3 w-1/4 rounded-lg" />
        </Card>
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default NftPageShimmer;
