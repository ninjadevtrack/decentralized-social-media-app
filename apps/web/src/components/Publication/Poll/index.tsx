import { HEY_API_URL } from '@hey/data/constants';
import { Poll } from '@hey/types/hey';
import { Spinner } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';

import Wrapper from '../../Shared/Embed/Wrapper';
import Choices from './Choices';

interface SnapshotProps {
  id: string;
}

const Poll: FC<SnapshotProps> = ({ id }) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  const fetchPoll = async (): Promise<Poll | null> => {
    try {
      const response = await axios.get(`${HEY_API_URL}/poll/get`, {
        params: { id }
      });
      const { data } = response;

      return data?.result;
    } catch {
      return null;
    }
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['fetchPoll', id],
    queryFn: fetchPoll
  });

  if (isLoading) {
    // TODO: Add skeleton loader here
    return (
      <Wrapper>
        <div className="flex items-center justify-center">
          <Spinner size="xs" />
        </div>
      </Wrapper>
    );
  }

  if (!data?.id || error) {
    return null;
  }

  return <Choices poll={data} refetch={refetch} />;
};

export default Poll;
