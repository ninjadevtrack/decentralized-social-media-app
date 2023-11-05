import Video from '@components/Shared/Video';
import {
  ClipboardDocumentIcon,
  SignalIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { IS_MAINNET, LIVE_WORKER_URL } from '@hey/data/constants';
import { Card, Spinner, Tooltip } from '@hey/ui';
import axios from 'axios';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { hydrateAuthTokens } from 'src/store/useAuthPersistStore';
import { usePublicationStore } from 'src/store/usePublicationStore';

const LivestreamEditor: FC = () => {
  const liveVideoConfig = usePublicationStore((state) => state.liveVideoConfig);
  const setLiveVideoConfig = usePublicationStore(
    (state) => state.setLiveVideoConfig
  );
  const setShowLiveVideoEditor = usePublicationStore(
    (state) => state.setShowLiveVideoEditor
  );
  const resetLiveVideoConfig = usePublicationStore(
    (state) => state.resetLiveVideoConfig
  );

  const [creating, setCreating] = useState(false);

  const createLiveStream = async () => {
    try {
      setCreating(true);
      const response = await axios.post(
        `${LIVE_WORKER_URL}/create`,
        undefined,
        {
          headers: {
            'X-Access-Token': hydrateAuthTokens().accessToken,
            'X-Lens-Network': IS_MAINNET ? 'mainnet' : 'testnet'
          }
        }
      );
      const { data } = response;
      setLiveVideoConfig({
        id: data.result.id,
        playbackId: data.result.playbackId,
        streamKey: data.result.streamKey
      });
    } catch {
      toast.error('Error creating live stream');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card className="m-5 px-5 py-3" forceRounded>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm">
          <VideoCameraIcon className="text-brand-500 h-4 w-4" />
          <b>Go Live</b>
        </div>
        <div className="flex items-center space-x-3">
          <Tooltip placement="top" content="Delete">
            <button
              className="flex"
              onClick={() => {
                resetLiveVideoConfig();
                setShowLiveVideoEditor(false);
              }}
            >
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {liveVideoConfig.playbackId.length > 0 ? (
          <>
            <Card className="space-y-2 p-3">
              <div className="flex items-center space-x-1">
                <b>Stream URL:</b>
                <div className="">rtmp://rtmp.livepeer.com/live</div>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      'rtmp://rtmp.livepeer.com/live'
                    );
                    toast.success('Copied to clipboard!');
                  }}
                >
                  <ClipboardDocumentIcon className="h-4 w-4 text-gray-400" />
                </button>
              </div>
              <div className="flex items-center space-x-1">
                <b>Stream Key:</b>
                <div className="">{liveVideoConfig.streamKey}</div>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      liveVideoConfig.streamKey
                    );
                    toast.success('Copied to clipboard!');
                  }}
                >
                  <ClipboardDocumentIcon className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </Card>
            <Video
              src={`https://livepeercdn.studio/hls/${liveVideoConfig.playbackId}/index.m3u8`}
            />
          </>
        ) : (
          <button className="w-full" onClick={createLiveStream}>
            <Card className="flex justify-center p-3 font-bold hover:bg-gray-50 dark:hover:bg-gray-900">
              <div className="flex items-center space-x-2">
                {creating ? (
                  <>
                    <Spinner size="xs" />
                    <div>Creating Live Stream...</div>
                  </>
                ) : (
                  <>
                    <SignalIcon className="text-brand-500 h-5 w-5" />
                    <div>Create Live Stream</div>
                  </>
                )}
              </div>
            </Card>
          </button>
        )}
      </div>
    </Card>
  );
};

export default LivestreamEditor;
