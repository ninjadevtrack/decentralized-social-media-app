import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import PublicationWrapper from '@components/Shared/PublicationWrapper';
import pushToImpressions from '@lib/pushToImpressions';
import { useInView } from 'react-cool-inview';

import PublicationActions from './Actions';
import HiddenPublication from './HiddenPublication';
import PublicationAvatar from './PublicationAvatar';
import PublicationBody from './PublicationBody';
import PublicationHeader from './PublicationHeader';

interface ThreadBodyProps {
  publication: AnyPublication;
}

const ThreadBody: FC<ThreadBodyProps> = ({ publication }) => {
  const { observe } = useInView({
    onChange: ({ inView }) => {
      if (!inView) {
        return;
      }

      pushToImpressions(publication.id);
    }
  });

  return (
    <PublicationWrapper publication={publication}>
      <span ref={observe} />
      <div className="relative flex items-start space-x-3 pb-5">
        <PublicationAvatar publication={publication} />
        <div className="absolute bottom-0 left-[11.1px] h-full border-[0.9px] border-solid border-gray-300 dark:border-gray-700" />
        <div className="w-full">
          <PublicationHeader publication={publication} />
          {publication.isHidden ? (
            <HiddenPublication type={publication.__typename} />
          ) : (
            <>
              <PublicationBody publication={publication} />
              <PublicationActions publication={publication} />
            </>
          )}
        </div>
      </div>
    </PublicationWrapper>
  );
};

export default ThreadBody;
