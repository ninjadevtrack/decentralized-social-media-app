import { ENS_RESOLVER_WORKER_URL } from '@lenster/data/constants';
import axios from 'axios';

export const resolveEns = async (addresses: string[]) => {
  const response = await axios.post(ENS_RESOLVER_WORKER_URL, {
    addresses: addresses.map((address) => address.split('/')[0])
  });

  return response.data;
};
