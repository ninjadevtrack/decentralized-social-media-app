import type { FeatureFlag } from '@hey/data/feature-flags';
import { hydrateFeatureFlags } from 'src/store/non-persisted/useFeatureFlagsStore';

import getCurrentSession from './getCurrentSession';

/**
 * Checks if a feature is enabled for the current user
 * @param key The feature flag key
 * @returns Whether the feature is enabled
 */
const isFeatureEnabled = (key: FeatureFlag) => {
  const { id: sessionProfileId } = getCurrentSession();
  const { featureFlags } = hydrateFeatureFlags();

  if (!sessionProfileId) {
    return false;
  }

  return featureFlags.includes(key);
};

export default isFeatureEnabled;
