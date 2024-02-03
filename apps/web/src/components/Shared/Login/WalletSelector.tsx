import type {
  LastLoggedInProfileRequest,
  Profile,
  ProfileManagersRequest
} from '@hey/lens';
import type { Dispatch, FC, SetStateAction } from 'react';
import type { Connector } from 'wagmi';

import SwitchNetwork from '@components/Shared/SwitchNetwork';
import { ArrowRightCircleIcon, KeyIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { Errors } from '@hey/data/errors';
import { AUTH } from '@hey/data/tracking';
import {
  useAuthenticateMutation,
  useChallengeLazyQuery,
  useProfilesManagedQuery
} from '@hey/lens';
import getWalletDetails from '@hey/lib/getWalletDetails';
import { Button, Card, Spinner } from '@hey/ui';
import cn from '@hey/ui/cn';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CHAIN } from 'src/constants';
import { signIn } from 'src/store/persisted/useAuthStore';
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useSignMessage
} from 'wagmi';

import UserProfile from '../UserProfile';

interface WalletSelectorProps {
  setHasConnected?: Dispatch<SetStateAction<boolean>>;
}

const WalletSelector: FC<WalletSelectorProps> = ({ setHasConnected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loggingInProfileId, setLoggingInProfileId] = useState<null | string>(
    null
  );

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const chain = useChainId();
  const { connectAsync, connectors, error, isPending } = useConnect();

  const { disconnect } = useDisconnect();
  const { address, connector: activeConnector } = useAccount();
  const { signMessageAsync } = useSignMessage({ mutation: { onError } });
  const [loadChallenge, { error: errorChallenge }] = useChallengeLazyQuery({
    fetchPolicy: 'no-cache'
  });
  const [authenticate, { error: errorAuthenticate }] =
    useAuthenticateMutation();
  const request: LastLoggedInProfileRequest | ProfileManagersRequest = {
    for: address
  };
  const { data: profilesManaged, loading: profilesManagedLoading } =
    useProfilesManagedQuery({
      skip: !address,
      variables: {
        lastLoggedInProfileRequest: request,
        profilesManagedRequest: request
      }
    });

  const onConnect = async (connector: Connector) => {
    try {
      const account = await connectAsync({ connector });
      if (account) {
        setHasConnected?.(true);
      }
      Leafwatch.track(AUTH.CONNECT_WALLET, {
        wallet: connector.name.toLowerCase()
      });
    } catch {}
  };

  const handleSign = async (id?: string) => {
    try {
      setLoggingInProfileId(id || null);
      setIsLoading(true);
      // Get challenge
      const challenge = await loadChallenge({
        variables: { request: { ...(id && { for: id }), signedBy: address } }
      });

      if (!challenge?.data?.challenge?.text) {
        return toast.error(Errors.SomethingWentWrong);
      }

      // Get signature
      const signature = await signMessageAsync({
        message: challenge?.data?.challenge?.text
      });

      // Auth user and set cookies
      const auth = await authenticate({
        variables: { request: { id: challenge.data.challenge.id, signature } }
      });
      const accessToken = auth.data?.authenticate.accessToken;
      const refreshToken = auth.data?.authenticate.refreshToken;
      signIn({ accessToken, refreshToken });
      Leafwatch.track(AUTH.SIWL);
      location.reload();
    } catch {}
  };

  const allProfiles = profilesManaged?.profilesManaged.items || [];
  const lastLogin = profilesManaged?.lastLoggedInProfile;

  const remainingProfiles = lastLogin
    ? allProfiles.filter((profile) => profile.id !== lastLogin.id)
    : allProfiles;

  const profiles = lastLogin
    ? [lastLogin, ...remainingProfiles]
    : remainingProfiles;

  return activeConnector?.id ? (
    <div className="space-y-3">
      <div className="space-y-2.5">
        {chain === CHAIN.id ? (
          profilesManagedLoading ? (
            <Card className="w-full dark:divide-gray-700" forceRounded>
              <div className="space-y-2 p-4 text-center text-sm font-bold">
                <Spinner className="mx-auto" size="sm" />
                <div>Loading profiles managed by you...</div>
              </div>
            </Card>
          ) : profiles.length > 0 ? (
            <Card className="w-full dark:divide-gray-700" forceRounded>
              {profiles.map((profile) => (
                <div
                  className="flex items-center justify-between p-3"
                  key={profile.id}
                >
                  <UserProfile
                    linkToProfile={false}
                    profile={profile as Profile}
                    showUserPreview={false}
                  />
                  <Button
                    disabled={isLoading && loggingInProfileId === profile.id}
                    icon={
                      isLoading && loggingInProfileId === profile.id ? (
                        <Spinner size="xs" />
                      ) : (
                        <ArrowRightCircleIcon className="size-4" />
                      )
                    }
                    onClick={() => handleSign(profile.id)}
                  >
                    Login
                  </Button>
                </div>
              ))}
            </Card>
          ) : (
            <div>
              <Button
                disabled={isLoading}
                icon={
                  isLoading ? (
                    <Spinner size="xs" />
                  ) : (
                    <ArrowRightCircleIcon className="size-4" />
                  )
                }
                onClick={() => handleSign()}
              >
                Sign in with Lens
              </Button>
            </div>
          )
        ) : (
          <SwitchNetwork toChainId={CHAIN.id} />
        )}
        <button
          className="flex items-center space-x-1 text-sm underline"
          onClick={() => {
            disconnect?.();
            Leafwatch.track(AUTH.CHANGE_WALLET);
          }}
          type="reset"
        >
          <KeyIcon className="size-4" />
          <div>Change wallet</div>
        </button>
      </div>
      {errorChallenge || errorAuthenticate ? (
        <div className="flex items-center space-x-1 font-bold text-red-500">
          <XCircleIcon className="size-5" />
          <div>{Errors.SomethingWentWrong}</div>
        </div>
      ) : null}
    </div>
  ) : (
    <div className="inline-block w-full space-y-3 overflow-hidden text-left align-middle">
      {connectors
        .filter(
          // This removes last connector if it's injected
          (connector, index, self) =>
            self.findIndex((c) => c.type === connector.type) === index
        )
        .map((connector) => {
          return (
            <button
              className={cn(
                {
                  'hover:bg-gray-100 dark:hover:bg-gray-700':
                    connector.id !== activeConnector?.id
                },
                'flex w-full items-center justify-between space-x-2.5 overflow-hidden rounded-xl border px-4 py-3 outline-none dark:border-gray-700'
              )}
              disabled={connector.id === activeConnector?.id || isPending}
              key={connector.id}
              onClick={() => onConnect(connector)}
              type="button"
            >
              <span>
                {connector.id === 'injected'
                  ? 'Browser Wallet'
                  : getWalletDetails(connector.name).name}
              </span>
              <img
                alt={connector.id}
                className="size-6"
                draggable={false}
                height={24}
                src={getWalletDetails(connector.name).logo}
                width={24}
              />
            </button>
          );
        })}
      {error?.message ? (
        <div className="flex items-center space-x-1 text-red-500">
          <XCircleIcon className="size-5" />
          <div>{error?.message || 'Failed to connect'}</div>
        </div>
      ) : null}
    </div>
  );
};

export default WalletSelector;
