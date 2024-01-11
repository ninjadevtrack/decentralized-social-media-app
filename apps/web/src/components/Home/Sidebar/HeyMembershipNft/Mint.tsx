import type { Post } from '@hey/lens';
import type { FC } from 'react';

import CollectAction from '@components/Publication/LensOpenActions/CollectModule/CollectAction';
import Loader from '@components/Shared/Loader';
import { Errors } from '@hey/data';
import { APP_NAME } from '@hey/data/constants';
import { usePublicationQuery } from '@hey/lens';
import { ErrorMessage } from '@hey/ui';
import cn from '@hey/ui/cn';
import { signatureFont } from '@lib/fonts';
import Link from 'next/link';

interface MintProps {
  onCollectSuccess: () => void;
}

const Mint: FC<MintProps> = ({ onCollectSuccess }) => {
  const { data, error, loading } = usePublicationQuery({
    variables: { request: { forId: '0x06-0x05' } }
  });

  if (loading) {
    return (
      <div className="m-5">
        <Loader message="Loading NFT" />
      </div>
    );
  }

  if (!data?.publication || error) {
    return (
      <ErrorMessage
        className="m-5"
        error={
          error || {
            message: Errors.SomethingWentWrong,
            name: 'Failed to load NFT'
          }
        }
        title="Failed to load NFT"
      />
    );
  }

  const publication = data?.publication as Post;
  const openAction = publication.openActionModules[0];

  return (
    <div className="p-5">
      <img
        className="mb-4 h-[250px] w-full rounded-xl border object-cover dark:border-gray-700"
        src="https://ipfs.decentralized-content.com/ipfs/bafybeib6infyovvtawokys4ejjr4r3qk4soy7jqriejp2wbmttedupsy64"
      />
      <div className="linkify mt-5 space-y-3 font-serif">
        <b>Thanks for Being a {APP_NAME} Member!</b>
        <div>
          Your journey with us has been invaluable. By supporting "{APP_NAME}",
          you're not just a part of our story, but you're also fueling the
          vibrant future of{' '}
          <Link
            className="font-bold"
            href="https://github.com/heyxyz/hey"
            target="_blank"
          >
            open-source
          </Link>{' '}
          development. Here's to more innovation and collaboration ahead!
        </div>
        <div
          className={cn(
            'flex items-center space-x-2 pt-3 text-2xl',
            signatureFont.className
          )}
        >
          <div>-</div>
          <img className="size-6" src="/logo.png" />
          <div>Team Hey</div>
        </div>
      </div>
      <div className="mt-6">
        <CollectAction
          buttonTitle="Collect for 5 MATIC"
          className="!mt-0 w-full justify-center"
          countOpenActions={0}
          forceShowCollect
          onCollectSuccess={onCollectSuccess}
          openAction={openAction}
          publication={publication}
        />
      </div>
    </div>
  );
};

export default Mint;
