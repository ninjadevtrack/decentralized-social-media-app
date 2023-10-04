import response from '@hey/lib/response';
import createSupabaseClient from '@hey/supabase/createSupabaseClient';

import getMembersCount from '../helpers/getMembersCount';
import type { WorkerRequest } from '../types';

export default async (request: WorkerRequest) => {
  const { slug } = request.params;

  try {
    const client = createSupabaseClient(request.env.SUPABASE_KEY);
    const { data } = await client
      .from('groups')
      .select('*')
      .eq('slug', slug)
      .single();

    return response({
      success: true,
      result: {
        ...data,
        members: await getMembersCount(data?.contract as `0x${string}`)
      }
    });
  } catch (error) {
    throw error;
  }
};
