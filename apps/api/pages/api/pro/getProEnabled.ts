import { Errors } from '@hey/data/errors';
import allowCors from '@utils/allowCors';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import createRedisClient from '@utils/createRedisClient';
import prisma from '@utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const redis = createRedisClient();
    const cache = await redis.get(`pro:${id}`);

    if (cache) {
      return res
        .status(200)
        .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
        .json({
          success: true,
          cached: true,
          enabled: Boolean(JSON.parse(cache))
        });
    }

    const data = await prisma.pro.findFirst({
      where: { profileId: id as string }
    });
    await redis.set(`pro:${id}`, JSON.stringify(data));

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({ success: true, enabled: Boolean(data) });
  } catch (error) {
    return catchedError(res, error);
  }
};

export default allowCors(handler);
