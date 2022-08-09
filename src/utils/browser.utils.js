const path = require('path');
const { URLSearchParams, URL } = require('url');
const { moveFile } = require('./fs.utils');
const { getTextOfElement } = require('./playwright-helpers/utils/browser.utils');

const blacklistedTerms = process.env.BLACKLISTED_TERMS.split(',').filter((term) => !!term).map((term) => term.toLocaleLowerCase());

console.log({ blacklistedTerms });

const hasBlacklistedTerm = (item) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const term of blacklistedTerms) {
    if (item.toLocaleLowerCase().includes(term)) {
      return term;
    }
  }

  return false;
};

const getItemDataArray = async (items, { tag }) => {
  const itemDataArray = [];
  const numberOfItems = await items.count();

  for (let i = 0; i < numberOfItems; i += 1) {
    const item = await items.nth(i);
    const title = await getTextOfElement({ page: item, query: '.title' });
    const author = await getTextOfElement({ page: item, query: '.user' });
    let href = await item.locator('.title').getAttribute('href');

    const hrefSplit = href.split('/');
    let id = hrefSplit.pop();

    if (!id) {
      id = hrefSplit.pop();
    }

    href = `https://freesound.org${href}`;

    const tempItem = {
      id,
      title,
      author,
      href,
      tag,
    };

    const forCheck = JSON.stringify(tempItem);
    const hasBLTerm = hasBlacklistedTerm(forCheck);

    if (hasBLTerm) {
      console.log(`item ${title} has a blacklisted term ${hasBLTerm} 😢`);
    } else {
      const filename = `${`${id}-${author}-${title}`.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 100)}.wav`;

      itemDataArray.push({
        id,
        title,
        author,
        href,
        filename,
        tag,
      });
    }
  }

  return itemDataArray;
};

const downloadItem = async ({
  context, item, tag,
}) => {
  const { href, title, filename } = item;

  // console.log({ href });

  const page = await context.newPage();

  await page.goto(href);

  const wariningLink = await page.locator('a#remove_warning_link');
  const wariningLinkCount = await wariningLink.count();

  if (wariningLinkCount) {
    await wariningLink.click();
  }

  const downloadButton = await page.locator('a[title="download sound"]');

  try {
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 5000 }),
      downloadButton.click(),
    ]);

    console.log('will wait for', title);

    const downloadPath = await download.path();

    // console.log({ downloadPath });

    if (downloadPath) {
      moveFile(
        downloadPath,
        path.join(process.env.TRIAGE_PATH, tag, filename),
        [
          path.join(process.env.TRIAGE_PATH, tag),
        ],
      );
    }

    await page.waitForTimeout(3000);

    await page.close();
    return 'success';
  } catch (error) {
    console.log('error downloading');
    await page.close();
    return 'error';
  }
};

const getItemsInPage = async ({ page, tag }) => {
  const items = await page.locator('.sample_player_small');

  try {
    await items.first().waitFor({ state: 'visible', timeout: 3000 });

    const numberOfItems = await items.count();

    console.log({ numberOfItems });

    const itemDataArray = await getItemDataArray(items, { tag });

    return itemDataArray;
  } catch (error) {
    console.log('no items were found');

    return [];
  }
};

const downloadFromPages = async ({ page, context }) => {
  const pages = process.env.PAGE_URLS.split(',').filter((pageString) => pageString);
  const pagesToCheckForTag = process.env.PAGES_TO_CHECK_FOR_TAG || 3;

  console.log({ pages });
  let storedItems = [];

  for (let i = 0; i < pages.length; i += 1) {
    const currentUrl = pages[i];

    console.log({ currentUrl });

    await page.goto(currentUrl);

    let tag = 'other';
    const urlObject = new URL(currentUrl);
    const { pathname } = urlObject;

    if (pathname.includes('tag')) {
      const urlSplit = currentUrl.split('/');
      tag = urlSplit.pop();

      if (!tag) {
        tag = urlSplit.pop();
      }
    } else {
      const search = new URLSearchParams(currentUrl);
      tag = search.get('ffTag');
    }

    console.log({
      tag,
    });

    // go to last page
    const lastPageLinks = await page.locator('a[title="Last Page"]');
    await lastPageLinks.nth(0).click();

    for (let j = 0; j < pagesToCheckForTag; j += 1) {
      const itemDataArray = await getItemsInPage({ page, tag });

      storedItems = [...storedItems, ...itemDataArray];

      const pagination = await page.locator('.pagination li');
      const numberOfPages = await pagination.count();
      let lastPageIndex = numberOfPages - 1;
      let currentPageIndex = null;

      while (!currentPageIndex) {
        const currentPage = await pagination.nth(lastPageIndex);
        const classList = await currentPage.getAttribute('class');

        if (classList.includes('current-page')) {
          currentPageIndex = lastPageIndex;
        } else {
          lastPageIndex -= 1;
        }
      }

      await pagination.nth(currentPageIndex - 1).click();
    }
  }

  storedItems = storedItems.filter(
    (stItem) => storedItems.filter((item) => item.id === stItem.id).length === 1,
  );

  for (let j = 0; j < storedItems.length; j += 1) {
    const item = storedItems[j];
    const { tag } = item;

    const result = await downloadItem({
      context, item, tag,
    });

    if (result === 'error') {
      storedItems = storedItems.slice(j);
      return {
        hasHitLimit: true,
        storedItems,
      };
    }
  }

  return {
    hasHitLimit: false,
    storedItems,
  };
};

module.exports = {
  getItemDataArray,
  downloadItem,
  downloadFromPages,
};
