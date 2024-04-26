import type { FC } from 'react';

import CountdownTimer from '@components/Shared/CountdownTimer';
import { APP_NAME, STATIC_IMAGES_URL } from '@hey/data/constants';
import { MISCELLANEOUS } from '@hey/data/tracking';
import { Button, Card } from '@hey/ui';
import Link from 'next/link';
import { Leafwatch } from 'src/helpers/leafwatch';

const Gitcoin: FC = () => {
  return (
    <Card
      as="aside"
      className="mb-4 space-y-4 !border-[#3D614D] !bg-[#3D614D]/10 p-5 font-serif text-[#3D614D] dark:bg-[#3D614D]/50"
    >
      <img
        alt="Gitcoin emoji"
        className="mx-auto h-20"
        src={`${STATIC_IMAGES_URL}/brands/gitcoin.svg`}
      />
      <div className="space-y-3 text-center text-sm">
        <div className="font-bold">
          Support {APP_NAME} on Gitcoin Grants Round 20
        </div>
        <div className="text-lg font-bold tracking-wide">
          <CountdownTimer targetDate={new Date(1701302340 * 1000).toString()} />
        </div>
        <div>
          <Link
            className="font-bold underline"
            href="https://hey.xyz/gitcoin"
            onClick={() => Leafwatch.track(MISCELLANEOUS.OPEN_GITCOIN)}
            target="_blank"
          >
            <Button>Contribute now</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default Gitcoin;
