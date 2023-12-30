import getAuthWorkerHeadersForTest from '@hey/lib/getAuthWorkerHeadersForTest';
import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('internal/feature/kill', async () => {
  test('should kill a feature', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/feature/kill`,
      { enabled: false, id: '0779d74f-0426-4988-b4c4-2b632f5de8e1' },
      { headers: await getAuthWorkerHeadersForTest() }
    );

    expect(response.data.enabled).toBeFalsy();
  });

  test('should un-kill a feature', async () => {
    const response = await axios.post(
      `${TEST_URL}/internal/feature/kill`,
      { enabled: true, id: '0779d74f-0426-4988-b4c4-2b632f5de8e1' },
      { headers: await getAuthWorkerHeadersForTest() }
    );

    expect(response.data.enabled).toBeTruthy();
  });
});
