const { test } = require('@playwright/test');
const dotenv = require('dotenv');

dotenv.config();

test('basic test', async ({ page }) => {
  // Go to https://freesound.org/
  await page.goto('https://freesound.org/');
});
