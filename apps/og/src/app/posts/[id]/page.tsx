import type { AnyPublication } from '@hey/lens';
import type { Metadata } from 'next';

import { APP_NAME } from '@hey/data/constants';
import {
  LimitType,
  PublicationDocument,
  PublicationsDocument
} from '@hey/lens';
import { apolloClient } from '@hey/lens/apollo';
import getProfile from '@hey/lib/getProfile';
import getPublicationData from '@hey/lib/getPublicationData';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import defaultMetadata from 'src/defaultMetadata';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const { data } = await apolloClient().query({
    query: PublicationDocument,
    variables: { request: { forId: id } }
  });

  if (!data.publication) {
    return defaultMetadata;
  }

  const publication = data.publication as AnyPublication;
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const { by: profile, metadata } = targetPublication;
  const filteredContent = getPublicationData(metadata)?.content || '';
  const filteredAttachments = getPublicationData(metadata)?.attachments || [];
  const filteredAsset = getPublicationData(metadata)?.asset;

  const assetIsImage = filteredAsset?.type === 'Image';
  const assetIsVideo = filteredAsset?.type === 'Video';
  const assetIsAudio = filteredAsset?.type === 'Audio';

  const getOGImages = () => {
    if (assetIsImage) {
      if (filteredAttachments.length > 0) {
        return filteredAttachments.map((attachment) => attachment.uri);
      }

      return [filteredAsset?.uri];
    }

    if (assetIsVideo) {
      if (filteredAttachments.length > 0) {
        return filteredAttachments.map((attachment) => attachment.uri);
      }

      return [filteredAsset?.cover];
    }

    if (assetIsAudio) {
      if (filteredAttachments.length > 0) {
        return filteredAttachments.map((attachment) => attachment.uri);
      }

      return [filteredAsset?.cover];
    }

    return [];
  };

  const { displayName, link, slugWithPrefix } = getProfile(profile);
  const title = `${targetPublication.__typename} by ${slugWithPrefix} • ${APP_NAME}`;

  return {
    alternates: { canonical: `https://hey.xyz/posts/${targetPublication.id}` },
    applicationName: APP_NAME,
    authors: {
      name: displayName,
      url: `https://hey.xyz/${link}`
    },
    creator: displayName,
    description: filteredContent || title,
    keywords: [
      'hey',
      'hey.xyz',
      'social media post',
      'social media',
      'lenster',
      'user post',
      'like',
      'share',
      'post',
      'publication',
      'lens',
      'lens protocol',
      'decentralized',
      'web3',
      displayName,
      slugWithPrefix
    ],
    metadataBase: new URL(`https://hey.xyz/posts/${targetPublication.id}`),
    openGraph: {
      images: getOGImages() as any,
      siteName: 'Hey',
      type: 'article'
    },
    other: {
      'count:actions': targetPublication.stats.countOpenActions,
      'count:comments': targetPublication.stats.comments,
      'count:likes': targetPublication.stats.reactions,
      'count:mirrors': targetPublication.stats.mirrors,
      'count:quotes': targetPublication.stats.quotes,
      'lens:id': targetPublication.id
    },
    publisher: displayName,
    title: title,
    twitter: {
      card: assetIsAudio ? 'summary' : 'summary_large_image',
      site: '@heydotxyz'
    }
  };
}

export default async function Page({ params }: Props) {
  const metadata = await generateMetadata({ params });
  const { data } = await apolloClient().query({
    query: PublicationsDocument,
    variables: {
      request: {
        limit: LimitType.Fifty,
        where: {
          commentOn: {
            id: metadata.other?.['lens:id'],
            ranking: { filter: 'RELEVANT' }
          }
        }
      }
    }
  });

  if (!metadata) {
    return <h1>{params.id}</h1>;
  }

  return (
    <>
      <h1>{metadata.title?.toString()}</h1>
      <h2>{metadata.description?.toString()}</h2>
      <div>
        <b>Stats</b>
        <ul>
          <li>Actions: {metadata.other?.['count:actions']}</li>
          <li>Comments: {metadata.other?.['count:comments']}</li>
          <li>Likes: {metadata.other?.['count:likes']}</li>
          <li>Mirrors: {metadata.other?.['count:mirrors']}</li>
          <li>Quotes: {metadata.other?.['count:quotes']}</li>
        </ul>
      </div>
      <div>
        <h3>Comments</h3>
        <ul>
          {data?.publications?.items?.map((publication: AnyPublication) => {
            const targetPublication = isMirrorPublication(publication)
              ? publication.mirrorOn
              : publication;
            const filteredContent =
              getPublicationData(targetPublication.metadata)?.content || '';

            return (
              <li key={publication.id}>
                <a href={`https://hey.xyz/posts/${publication.id}`}>
                  {filteredContent}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
