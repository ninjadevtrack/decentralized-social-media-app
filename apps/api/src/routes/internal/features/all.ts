import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import heyPg from 'src/db/heyPg';
import catchedError from 'src/helpers/catchedError';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import { notAllowed } from 'src/helpers/responses';

export const get: Handler = async (req, res) => {
  if (!(await validateIsStaff(req))) {
    return notAllowed(res);
  }

  try {
    const data = await heyPg.query(`
      SELECT *
      FROM "Feature"
      ORDER BY priority DESC;
    `);
    logger.info('All features fetched');

    return res.status(200).json({ features: data, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
