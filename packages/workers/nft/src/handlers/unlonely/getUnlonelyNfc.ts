import response from '@hey/lib/response';

import type { WorkerRequest } from '../../types';

export default async (request: WorkerRequest) => {
  const { id } = request.query;

  if (!id) {
    return response({ success: false, error: 'No id provided' });
  }

  try {
    const unlonelyResponse = await fetch(
      'https://unlonely-vqeii.ondigitalocean.app/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-agent': 'Hey.xyz'
        },
        body: JSON.stringify({
          query: `
            query GetNFC {
              getNFC(id: "${id}") {
                id
                createdAt 
                videoLink
                openseaLink
                title
                owner {
                  username
                  FCImageUrl
                  lensImageUrl
                }
              }
            }
          `
        })
      }
    );
    const channel: {
      data: { getNFC: any };
    } = await unlonelyResponse.json();

    return response({
      success: true,
      result: channel.data.getNFC
    });
  } catch (error) {
    throw error;
  }
};
