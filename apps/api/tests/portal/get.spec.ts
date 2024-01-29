import getAuthApiHeadersForTest from '@hey/lib/getAuthApiHeadersForTest';
import axios from 'axios';
import { TEST_URL } from 'src/lib/constants';
import { describe, expect, test } from 'vitest';

describe('portal/get', () => {
  test('should return hey portal', async () => {
    const response = await axios.post(
      `${TEST_URL}/portal/get`,
      {
        buttonIndex: 1,
        postUrl:
          'https://heyportals.vercel.app/q/90ca4789-0d81-4a22-a83c-4de26044d00b?state=eyJpbmRleCI6MCwic2NvcmUiOjAsInNlbGVjdGVkIjpudWxsfQ'
      },
      { headers: await getAuthApiHeadersForTest() }
    );

    expect(response.data.portal.version).toEqual('vLatest');
    expect(response.data.portal.buttons[0].button).toEqual('A');
    expect(response.data.portal.buttons[0].type).toEqual('submit');
  });
});
