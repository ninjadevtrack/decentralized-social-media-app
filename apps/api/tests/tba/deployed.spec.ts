import { TEST_URL } from '@utils/constants';
import axios from 'axios';
import { describe, expect, test } from 'vitest';

describe('tba/deployed', () => {
  test('should return true for a deployed contract', async () => {
    const response = await axios.get(`${TEST_URL}/tba/deployed`, {
      params: { address: '0x9AF37db37E74A0Fd6c12cDc84cC4C870d0bd41b9' }
    });
    expect(response.data.deployed).toBeTruthy();
  });

  test('should return false for a non-deployed contract', async () => {
    const response = await axios.get(`${TEST_URL}/tba/deployed`, {
      params: { address: '0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF' }
    });
    expect(response.data.deployed).toBeFalsy();
  });
});
