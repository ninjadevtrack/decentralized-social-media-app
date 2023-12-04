import type { DragEndEvent } from '@dnd-kit/core';
import type { FC } from 'react';

import { closestCenter, DndContext } from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext
} from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import { useNftGalleryStore } from 'src/store/non-persisted/useNftGalleryStore';

import DraggableCard from './DraggableCard';

const ReArrange: FC = () => {
  const gallery = useNftGalleryStore((state) => state.gallery);
  const setGallery = useNftGalleryStore((state) => state.setGallery);
  const [allNfts, setAllNfts] = useState(gallery.items);

  useEffect(() => {
    setGallery({ ...gallery, items: allNfts });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allNfts]);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) {
      return;
    }

    setAllNfts((items) => {
      const newItems = arrayMove(
        items,
        items.findIndex((i) => i.itemId === active?.id),
        items.findIndex((i) => i.itemId === over?.id)
      ).map((item, i) => {
        item.newOrder = i;
        return item;
      });
      const movedItem = items.find((i) => i.itemId === active?.id);
      if (movedItem) {
        let reArranged = gallery.reArrangedItems;
        let alreadyExistsIndex = gallery.reArrangedItems.findIndex(
          (i) => i.itemId === active?.id
        );
        if (alreadyExistsIndex >= 0) {
          reArranged[alreadyExistsIndex].newOrder = movedItem.newOrder;
        } else {
          reArranged.push(movedItem);
        }
        setGallery({
          ...gallery,
          reArrangedItems: reArranged
        });
      }
      return newItems;
    });
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={allNfts.map(
          (i) => `${i.contract.chainId}_${i.contract.address}_${i.tokenId}`
        )}
        strategy={rectSortingStrategy}
      >
        <div className="grid gap-5 py-5 md:grid-cols-3">
          {allNfts.map((item) => {
            const id = `${item.contract.chainId}_${item.contract.address}_${item.tokenId}`;
            return <DraggableCard id={id} key={id} nft={item} />;
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default ReArrange;
