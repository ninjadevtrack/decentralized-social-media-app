import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { RectangleStackIcon as RectangleStackIconSolid } from '@heroicons/react/24/solid';
import { PUBLICATION } from '@hey/data/tracking';
import type { AnyPublication } from '@hey/lens';
import humanize from '@hey/lib/humanize';
import nFormatter from '@hey/lib/nFormatter';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Modal, Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { motion } from 'framer-motion';
import plur from 'plur';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useOpenActionOptimisticStore } from 'src/store/OptimisticActions/useOpenActionOptimisticStore';

import List from './List';

interface OpenActionProps {
  publication: AnyPublication;
  showCount: boolean;
}

const OpenAction: FC<OpenActionProps> = ({ publication, showCount }) => {
  const getOpenActionCountByPublicationId = useOpenActionOptimisticStore(
    (state) => state.getOpenActionCountByPublicationId
  );
  const hasActedByMe = useOpenActionOptimisticStore(
    (state) => state.hasActedByMe
  );
  const setOpenActionPublicationConfig = useOpenActionOptimisticStore(
    (state) => state.setOpenActionPublicationConfig
  );

  const [showOpenActionModal, setShowOpenActionModal] = useState(false);
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;
  const hasActed = hasActedByMe(targetPublication.id);
  const openActionCount = getOpenActionCountByPublicationId(
    targetPublication.id
  );

  useEffect(() => {
    setOpenActionPublicationConfig(targetPublication.id, {
      countOpenActions: targetPublication.stats.countOpenActions,
      acted: targetPublication.operations.hasActed.value
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publication]);

  const iconClassName = showCount
    ? 'w-[17px] sm:w-[20px]'
    : 'w-[15px] sm:w-[18px]';

  return (
    <>
      <div
        className={cn(
          hasActed ? 'text-brand-500' : 'ld-text-gray-500',
          'flex items-center space-x-1'
        )}
      >
        <motion.button
          className={cn(
            hasActed
              ? 'hover:bg-brand-300/20 outline-brand-500'
              : 'outline-gray-400 hover:bg-gray-300/20',
            'rounded-full p-1.5 outline-offset-2'
          )}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setShowOpenActionModal(true);
            Leafwatch.track(PUBLICATION.COLLECT_MODULE.OPEN_COLLECT);
          }}
          aria-label="Action"
        >
          <Tooltip
            placement="top"
            content={`${humanize(openActionCount)} ${plur(
              'Action',
              openActionCount
            )}`}
            withDelay
          >
            {hasActed ? (
              <RectangleStackIconSolid className={iconClassName} />
            ) : (
              <RectangleStackIcon className={iconClassName} />
            )}
          </Tooltip>
        </motion.button>
        {openActionCount > 0 && !showCount ? (
          <span className="text-[11px] sm:text-xs">
            {nFormatter(openActionCount)}
          </span>
        ) : null}
      </div>
      <Modal
        title="Open Actions"
        icon={<RectangleStackIcon className="text-brand-500 h-5 w-5" />}
        show={showOpenActionModal}
        onClose={() => setShowOpenActionModal(false)}
      >
        <List publication={publication} />
      </Modal>
    </>
  );
};

export default OpenAction;
