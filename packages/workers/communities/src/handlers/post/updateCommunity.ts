import hasOwnedLensProfiles from '@lenster/lib/hasOwnedLensProfiles';
import validateLensAccount from '@lenster/lib/validateLensAccount';
import type { Community } from '@lenster/types/communities';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { error, type IRequest } from 'itty-router';
import { Client } from 'pg';
import { boolean, object, string } from 'zod';

import type { Env } from '../../types';

type ExtensionRequest = Community & {
  accessToken: string;
  isMainnet: boolean;
};

const validationSchema = object({
  id: string().uuid(),
  name: string().min(1, { message: 'Name is required!' }),
  slug: string().min(1, { message: 'Slug is required!' }),
  description: string().optional().nullable(),
  image: string().optional().nullable(),
  nsfw: boolean().optional().nullable(),
  twitter: string().optional().nullable(),
  website: string().optional().nullable(),
  admin: string(),
  accessToken: string().regex(/^([\w=]+)\.([\w=]+)\.([\w+/=\-]*)/),
  isMainnet: boolean()
});

export default async (request: IRequest, env: Env) => {
  const body = await request.json();
  if (!body) {
    return error(400, 'Bad request!');
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return new Response(
      JSON.stringify({ success: false, error: validation.error.issues })
    );
  }

  const {
    id,
    name,
    slug,
    description,
    avatar,
    nsfw,
    twitter,
    website,
    admin,
    accessToken,
    isMainnet
  } = body as ExtensionRequest;

  try {
    const isAuthenticated = await validateLensAccount(accessToken, isMainnet);
    if (!isAuthenticated) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid access token!' })
      );
    }

    const { payload } = jwt.decode(accessToken);
    const hasOwned = await hasOwnedLensProfiles(payload.id, admin, isMainnet);
    if (!hasOwned) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid profile ID' })
      );
    }

    const client = new Client(env.DB_URL);
    await client.connect();

    const query = {
      text: `
        UPDATE communities
        SET
          name = $2,
          slug = $3,
          description = $4,
          avatar = $5,
          nsfw = $6,
          twitter = $7,
          website = $8
        WHERE id = $1
        RETURNING *;
      `,
      values: [id, name, slug, description, avatar, nsfw, twitter, website]
    };

    const result = await client.query(query);

    return new Response(JSON.stringify(result.rows[0]));
  } catch (error) {
    throw error;
  }
};
