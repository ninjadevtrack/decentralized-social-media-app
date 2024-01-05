import { APP_NAME } from '@hey/data/constants';
import getURLs from '@hey/lib/getURLs';
import getNft from '@hey/lib/nft/getNft';
import {
  audio,
  image,
  liveStream,
  mint,
  textOnly,
  video
} from '@lens-protocol/metadata';
import getUserLocale from '@lib/getUserLocale';
import { useCallback } from 'react';
import { usePublicationAttachmentStore } from 'src/store/non-persisted/publication/usePublicationAttachmentStore';
import { usePublicationAudioStore } from 'src/store/non-persisted/publication/usePublicationAudioStore';
import { usePublicationLicenseStore } from 'src/store/non-persisted/publication/usePublicationLicenseStore';
import { usePublicationLiveStore } from 'src/store/non-persisted/publication/usePublicationLiveStore';
import { usePublicationVideoStore } from 'src/store/non-persisted/publication/usePublicationVideoStore';
import { v4 as uuid } from 'uuid';

interface UsePublicationMetadataProps {
  baseMetadata: any;
}

const usePublicationMetadata = () => {
  const videoDurationInSeconds = usePublicationVideoStore(
    (state) => state.videoDurationInSeconds
  );
  const videoThumbnail = usePublicationVideoStore(
    (state) => state.videoThumbnail
  );
  const audioPublication = usePublicationAudioStore(
    (state) => state.audioPublication
  );
  const license = usePublicationLicenseStore((state) => state.license);
  const attachments = usePublicationAttachmentStore(
    (state) => state.attachments
  );
  const liveVideoConfig = usePublicationLiveStore(
    (state) => state.liveVideoConfig
  );
  const showLiveVideoEditor = usePublicationLiveStore(
    (state) => state.showLiveVideoEditor
  );

  const attachmentsHasAudio = attachments[0]?.type === 'Audio';
  const attachmentsHasVideo = attachments[0]?.type === 'Video';

  const cover = attachmentsHasAudio
    ? audioPublication.cover
    : attachmentsHasVideo
      ? videoThumbnail.url
      : attachments[0]?.uri;

  const getMetadata = useCallback(
    ({ baseMetadata }: UsePublicationMetadataProps) => {
      const urls = getURLs(baseMetadata.content);

      const hasAttachments = attachments.length;
      const isImage = attachments[0]?.type === 'Image';
      const isAudio = attachments[0]?.type === 'Audio';
      const isVideo = attachments[0]?.type === 'Video';
      const isMint = Boolean(getNft(urls)?.mintLink);
      const isLiveStream = Boolean(showLiveVideoEditor && liveVideoConfig.id);

      const localBaseMetadata = {
        appId: APP_NAME,
        id: uuid(),
        locale: getUserLocale()
      };

      const attachmentsToBeUploaded = attachments.map((attachment) => ({
        cover: cover,
        item: attachment.uri,
        type: attachment.mimeType
      }));

      switch (true) {
        case isMint:
          return mint({
            ...baseMetadata,
            ...localBaseMetadata,
            ...(hasAttachments && { attachments: attachmentsToBeUploaded }),
            mintLink: getNft(urls)?.mintLink
          });
        case isLiveStream:
          return liveStream({
            ...baseMetadata,
            ...localBaseMetadata,
            liveUrl: `https://livepeercdn.studio/hls/${liveVideoConfig.playbackId}/index.m3u8`,
            playbackUrl: `https://livepeercdn.studio/hls/${liveVideoConfig.playbackId}/index.m3u8`,
            startsAt: new Date().toISOString()
          });
        case !hasAttachments:
          return textOnly({
            ...baseMetadata,
            ...localBaseMetadata
          });
        case isImage:
          return image({
            ...baseMetadata,
            ...localBaseMetadata,
            attachments: attachmentsToBeUploaded,
            image: {
              item: attachments[0]?.uri,
              type: attachments[0]?.mimeType
            }
          });
        case isAudio:
          return audio({
            ...baseMetadata,
            ...localBaseMetadata,
            attachments: attachmentsToBeUploaded,
            audio: {
              artist: audioPublication.artist,
              cover: audioPublication.cover,
              item: attachments[0]?.uri,
              type: attachments[0]?.mimeType,
              ...(license && { license })
            }
          });
        case isVideo:
          return video({
            ...baseMetadata,
            ...localBaseMetadata,
            attachments: attachmentsToBeUploaded,
            video: {
              duration: parseInt(videoDurationInSeconds),
              item: attachments[0]?.uri,
              type: attachments[0]?.mimeType,
              ...(license && { license })
            }
          });
        default:
          return null;
      }
    },
    [
      attachments,
      videoDurationInSeconds,
      audioPublication,
      cover,
      showLiveVideoEditor,
      liveVideoConfig,
      license
    ]
  );

  return getMetadata;
};

export default usePublicationMetadata;
