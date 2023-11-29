import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import prisma from '@utils/prisma';
import redisPool from '@utils/redisPool';
import type { Handler } from 'express';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const redis = await redisPool.getConnection();
    const cache = await redis.get(`preferences:${id}`);

    if (cache) {
      logger.info('Profile preferences fetched from cache');
      return res
        .status(200)
        .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
        .json({ success: true, cached: true, result: JSON.parse(cache) });
    }

    const [preference, pro, features] = await prisma.$transaction([
      prisma.preference.findUnique({ where: { id: id as string } }),
      prisma.pro.findFirst({ where: { profileId: id as string } }),
      prisma.profileFeature.findMany({
        where: {
          profileId: id as string,
          enabled: true,
          feature: { enabled: true }
        },
        select: { feature: { select: { key: true } } }
      })
    ]);

    const response = {
      preference,
      pro: { enabled: Boolean(pro) },
      features: features.map((feature: any) => feature.feature?.key)
    };

    await redis.set(`preferences:${id}`, JSON.stringify(response));
    logger.info('Profile preferences fetched from DB');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({
        success: true,
        result: response
      });
  } catch (error) {
    return catchedError(res, error);
  }
};
