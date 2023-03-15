import { expect, test } from '@playwright/test';
import { APP_NAME } from 'data/constants';

import { BASE_URL } from '../../constants';

// Check footer is present
test('has footer', async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page.getByTestId('footer')).toContainText(`© ${new Date().getFullYear()} ${APP_NAME}`);
});

// Check locale selector is present
test('has has locale selector', async ({ page }) => {
  await page.goto(BASE_URL);
  const localeSelector = page.getByTestId('locale-selector');
  await expect(localeSelector).toContainText('English');

  // click locale selector and expect locale dropdown to be visible and contain Chinese
  await localeSelector.click();
  const localeSelectorMenu = page.getByTestId('locale-selector-menu');
  await expect(localeSelectorMenu).toContainText('Chinese');
});
