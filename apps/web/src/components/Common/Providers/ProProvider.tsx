import type { FC } from 'react';

import getPro from '@hey/lib/api/getPro';
import { useQuery } from '@tanstack/react-query';
import getCurrentSession from 'src/helpers/getCurrentSession';
import { useProStore } from 'src/store/non-persisted/useProStore';

const ProProvider: FC = () => {
  const { id: sessionProfileId } = getCurrentSession();
  const { setIsPro, setProExpiresAt } = useProStore();

  useQuery({
    enabled: Boolean(sessionProfileId),
    queryFn: () =>
      getPro(sessionProfileId).then((data) => {
        setIsPro(data.isPro);
        setProExpiresAt(data.expiresAt);
      }),
    queryKey: ['getPro', sessionProfileId || '']
  });

  return null;
};

export default ProProvider;
