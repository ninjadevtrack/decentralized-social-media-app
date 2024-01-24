import type { AnyPublication, Profile } from '@hey/lens';
import type { Metadata } from 'next';

import { APP_NAME, HANDLE_PREFIX } from '@hey/data/constants';
import {
  LimitType,
  ProfileDocument,
  PublicationsDocument,
  PublicationType
} from '@hey/lens';
import { apolloClient } from '@hey/lens/apollo';
import getAvatar from '@hey/lib/getAvatar';
import getProfile from '@hey/lib/getProfile';
import getPublicationData from '@hey/lib/getPublicationData';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import defaultMetadata from 'src/defaultMetadata';

interface Props {
  params: { handle: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = params;
  const { data } = await apolloClient().query({
    query: ProfileDocument,
    variables: { request: { forHandle: `${HANDLE_PREFIX}${handle}` } }
  });

  if (!data.profile) {
    return defaultMetadata;
  }

  const profile = data.profile as Profile;
  const { displayName, link, slugWithPrefix } = getProfile(profile);
  const title = `${displayName} (${slugWithPrefix}) • ${APP_NAME}`;

  return {
    alternates: { canonical: `https://hey.xyz/${link}` },
    applicationName: APP_NAME,
    creator: displayName,
    description: profile?.metadata?.bio,
    keywords: [
      'hey',
      'hey.xyz',
      'social media profile',
      'social media',
      'lenster',
      'user profile',
      'lens',
      'lens protocol',
      'decentralized',
      'web3',
      displayName,
      slugWithPrefix
    ],
    metadataBase: new URL(`https://hey.xyz/${link}`),
    openGraph: {
      images: [getAvatar(profile)],
      siteName: 'Hey',
      type: 'profile'
    },
    other: { 'lens:id': profile.id },
    publisher: displayName,
    title: title,
    twitter: { card: 'summary', site: '@heydotxyz' }
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
          from: metadata.other?.['lens:id'],
          publicationTypes: [
            PublicationType.Post,
            PublicationType.Quote,
            PublicationType.Mirror
          ]
        }
      }
    }
  });

  if (!metadata) {
    return <h1>{params.handle}</h1>;
  }

  return (
    <>
      <h1>{metadata.title?.toString()}</h1>
      <h2>{metadata.description?.toString()}</h2>
      <div>
        <h3>Publications</h3>
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
