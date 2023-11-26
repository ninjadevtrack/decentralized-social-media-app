import Beta from '@components/Shared/Badges/Beta';
import {
  Bars3BottomLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/solid';
import { HEY_API_URL } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { PUBLICATION } from '@hey/data/tracking';
import humanize from '@hey/lib/humanize';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import type { Poll } from '@hey/types/hey';
import { Card, Spinner } from '@hey/ui';
import cn from '@hey/ui/cn';
import { getTimetoNow } from '@lib/formatTime';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import plur from 'plur';
import type { FC } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useProfileStore from 'src/store/persisted/useProfileStore';

interface ChoicesProps {
  poll: Poll;
  refetch?: () => void;
}

const Choices: FC<ChoicesProps> = ({ poll, refetch }) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const [pollSubmitting, setPollSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const { options, endsAt } = poll;
  const totalResponses = options.reduce((acc, { responses }) => {
    return acc + responses;
  }, 0);

  const votePoll = async (id: string) => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    try {
      setPollSubmitting(true);
      setSelectedOption(id);

      await axios.post(
        `${HEY_API_URL}/poll/act`,
        { poll: poll.id, option: id },
        { headers: getAuthWorkerHeaders() }
      );

      refetch?.();
      Leafwatch.track(PUBLICATION.WIDGET.POLL.VOTE, { poll_id: id });
      toast.success('Your poll has been casted!');
    } catch {
      toast.error(Errors.SomethingWentWrong);
    } finally {
      setPollSubmitting(false);
    }
  };

  return (
    <Card className="mt-3" onClick={stopEventPropagation}>
      <div className="space-y-1 p-3">
        {options.map(({ id, option, percentage, voted }) => (
          <button
            key={id}
            className="flex w-full items-center space-x-2.5 rounded-xl p-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-900 sm:text-sm"
            disabled={pollSubmitting}
            onClick={() => votePoll(id)}
          >
            {pollSubmitting && id === selectedOption ? (
              <Spinner className="mr-1" size="sm" />
            ) : (
              <CheckCircleIcon
                className={cn(
                  voted ? 'text-green-500' : 'text-gray-500',
                  'h-6 w-6 '
                )}
              />
            )}
            <div className="w-full space-y-1">
              <div className="flex items-center justify-between">
                <b>{option}</b>
                <div>
                  <span className="ld-text-gray-500">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="flex h-2.5 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-800">
                <div
                  style={{ width: `${percentage}%` }}
                  className={cn(voted ? 'bg-green-500' : 'bg-brand-500')}
                />
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between border-t px-5 py-3 dark:border-gray-700 ">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Bars3BottomLeftIcon className="h-4 w-4" />
          <span>
            {humanize(totalResponses ?? 0)} {plur('vote', totalResponses || 0)}
          </span>
          <span>·</span>
          {new Date(endsAt) > new Date() ? (
            <span>{getTimetoNow(new Date(endsAt))} left</span>
          ) : (
            <span>Poll ended</span>
          )}
        </div>
        <Beta />
      </div>
    </Card>
  );
};

export default Choices;
