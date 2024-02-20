import {
  GARDENER_FEATURE_ID,
  GARDENER_MODE_FEATURE_ID,
  STAFF_FEATURE_ID,
  STAFF_MODE_FEATURE_ID,
  VERIFIED_FEATURE_ID
} from '../../lib/constants';
import { prisma } from '../seed';

const seedProfileFeatures = async (): Promise<number> => {
  const profileIds = ['0x0d', '0x06', '0x0383'];

  const data = profileIds.map((profileId) => {
    return [
      { featureId: VERIFIED_FEATURE_ID, profileId },
      { featureId: STAFF_FEATURE_ID, profileId },
      { featureId: STAFF_MODE_FEATURE_ID, profileId },
      { featureId: GARDENER_FEATURE_ID, profileId },
      { featureId: GARDENER_MODE_FEATURE_ID, profileId }
    ];
  });

  const profileFeatures = await prisma.profileFeature.createMany({
    data: data.flat()
  });

  return profileFeatures.count;
};

export default seedProfileFeatures;
