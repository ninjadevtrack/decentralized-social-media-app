import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('nft/unlonely/getUnlonelyChannel', async () => {
  test('should return unlonely channel', async () => {
    const response = await axios.get(
      `${TEST_URL}/nft/unlonely/getUnlonelyChannel`,
      { params: { slug: 'pixelnunc' } }
    );

    expect(response.data.channel.id).toEqual('145');
    expect(response.data.channel.slug).toEqual('pixelnunc');
  });
});
