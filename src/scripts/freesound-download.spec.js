const dotenv = require('dotenv');

dotenv.config();

const { test, expect } = require('@playwright/test');
const path = require('path');
const { readFile, writeFile } = require('../utils/fs.utils');
const { downloadFromPages, downloadItem } = require('../utils/browser.utils');

test('basic test', async ({ page, context }) => {
  // Go to https://freesound.org/
  await page.goto('https://freesound.org/');

  const shouldLogin = true;

  if (shouldLogin) {
    // Click text=Log In
    await page.locator('text=Log In').click();
    await expect(page).toHaveURL('https://freesound.org/home/login/?next=/');

    await page.locator('input[id="id_username"]').click();

    await page.locator('input[id="id_username"]').fill(process.env.FREESOUND_EMAIL);

    await page.locator('input[id="id_password"]').click();

    await page.locator('input[id="id_password"]').fill(process.env.FREESOUND_PASSWORD);

    await page.locator('form input[value="login"]').click();

    await expect(page).toHaveURL('https://freesound.org/');
  }

  let savedItems = readFile(path.join(process.env.TRIAGE_PATH, '..', 'failedItems.json'));

  if (savedItems !== null && savedItems.length) {
    console.log('has saved items');

    for (let j = 0; j < savedItems.length; j += 1) {
      const item = savedItems[j];
      const { tag } = item;

      const result = await downloadItem({
        context, item, tag,
      });

      if (result === 'error') {
        console.log('hit limit');
        savedItems = savedItems.slice(j);
        writeFile(path.join(process.env.TRIAGE_PATH, '..', 'failedItems.json'), savedItems);
        return;
      }
    }

    writeFile(path.join(process.env.TRIAGE_PATH, '..', 'failedItems.json'), []);
  } else {
    const res = await downloadFromPages({ page, context });

    console.log({ res: res.hasHitLimit, si: res.storedItems.length });

    if (res.hasHitLimit) {
      writeFile(path.join(process.env.TRIAGE_PATH, '..', 'failedItems.json'), res.storedItems);
    }
  }
});
