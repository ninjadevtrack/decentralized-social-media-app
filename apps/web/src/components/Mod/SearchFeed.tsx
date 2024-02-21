import type { AnyPublication, PublicationSearchRequest } from '@hey/lens';
import type { FC } from 'react';

import GardenerActions from '@components/Publication/Actions/GardenerActions';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { GARDENER } from '@hey/data/tracking';
import {
  CustomFiltersType,
  LimitType,
  useSearchPublicationsQuery
} from '@hey/lens';
import { Button, Card, EmptyState, ErrorMessage, Input } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';
import { useInView } from 'react-cool-inview';

const SearchFeed: FC = () => {
  const [query, setQuery] = useState('');
  const [value, setValue] = useState('');

  // Variables
  const request: PublicationSearchRequest = {
    limit: LimitType.Fifty,
    query,
    where: { customFilters: [CustomFiltersType.Gardeners] }
  };

  const { data, error, fetchMore, loading } = useSearchPublicationsQuery({
    skip: !query,
    variables: { request }
  });

  const search = data?.searchPublications;
  const publications = search?.items as AnyPublication[];
  const pageInfo = search?.pageInfo;
  const hasMore = pageInfo?.next;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  });

  const Search = () => {
    return (
      <form
        className="flex items-center space-x-2"
        onSubmit={() => {
          Leafwatch.track(GARDENER.SEARCH_PUBLICATION, { query: value });
          setQuery(value);
        }}
      >
        <Input
          autoFocus
          onChange={(event) => {
            setValue(event.target.value);
          }}
          placeholder="Search Publications"
          type="text"
          value={value}
        />
        <Button size="lg">Search</Button>
      </form>
    );
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <Search />
        <PublicationsShimmer />
      </div>
    );
  }

  if (!query || publications?.length === 0) {
    return (
      <div className="space-y-5">
        <Search />
        <EmptyState
          icon={<RectangleStackIcon className="text-brand-500 size-8" />}
          message="No posts yet!"
        />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load search feed" />;
  }

  return (
    <div className="space-y-5">
      <Search />
      {publications?.map((publication, index) => (
        <Card key={`${publication.id}_${index}`}>
          <SinglePublication
            isFirst
            isLast={false}
            publication={publication as AnyPublication}
            showActions={false}
            showThread={false}
          />
          <div>
            <div className="divider" />
            <div className="m-5 space-y-2">
              <b>Gardener actions</b>
              <GardenerActions publicationId={publication.id} />
            </div>
          </div>
        </Card>
      ))}
      {hasMore ? <span ref={observe} /> : null}
    </div>
  );
};

export default SearchFeed;
