/* eslint-disable no-await-in-loop */
const { getAllElements, checkForElement, waitFor } = require('./driverUtils');
const {
  itemPlayerPath,
  itemTagsPath,
  itemDescPath,
  itemPlayerTitlePath,
  itemPlayerAuthorPath,
  lastPageLinkPath,
  previousPageLinkPath,
  removeWarningLinkPath,
  itemDownloadPath,
} = require('./elementPaths');

const itemIsBlackListed = (itemText) => {
  const blackListString = process.env.BLACKLISTED_TERMS;

  if (!blackListString) {
    return true;
  }

  const blackListedTerms = blackListString.split(/, |,/);

  for (let j = 0; j < blackListedTerms.length; j += 1) {
    const term = blackListedTerms[j];

    if (itemText.includes(term.toLocaleLowerCase())) {
      return true;
    }
  }

  return false;
};

const itemIsWhiteListed = (itemText) => {
  const whiteListString = process.env.WHITELISTED_TERMS;

  if (!whiteListString) {
    return false;
  }

  const whitelistedTerms = whiteListString.split(/, |,/);

  for (let j = 0; j < whitelistedTerms.length; j += 1) {
    const term = whitelistedTerms[j];

    if (itemText.includes(term.toLocaleLowerCase())) {
      return true;
    }
  }

  return false;
};

const printState = (index, length) => {
  const resolvedLength = length % 2 === 0 ? length : (length + 1);

  const percentage = Math.floor((index / resolvedLength) * 100);

  switch (percentage) {
    case 0:
      console.log(`starting download of ${resolvedLength} items`);
      break;
    case 25:
      console.log(`${percentage * 100}% done`);
      break;
    case 50:
      console.log(`${percentage * 100}% done`);
      break;
    case 75:
      console.log(`${percentage * 100}% done`);
      break;

    default:
      break;
  }
};

const itemÛtils = {
  getItemsOnPage: async (driver) => {
    const finalList = [];

    // should go to last page, then travel 2 pages
    const lastPageLinkElement = await checkForElement(driver, lastPageLinkPath);
    await lastPageLinkElement.click();
    waitFor(1000);

    for (let j = 0; j < 2; j += 1) {
      const playerItems = await getAllElements(driver, itemPlayerPath);

      for (let i = 0; i < playerItems.length; i += 1) {
        const item = playerItems[i];
        const tags = [];
        let desc = '';

        const titleElement = await checkForElement(item, itemPlayerTitlePath);
        const title = await titleElement.getAttribute('innerText');
        const authorElement = await checkForElement(item, itemPlayerAuthorPath);
        const author = await authorElement.getAttribute('innerText');
        const url = await titleElement.getAttribute('href');
        const id = url.split('/')[url.split('/').length - 2];

        const tagsElements = await getAllElements(item, itemTagsPath);

        for (let k = 0; k < tagsElements.length; k += 1) {
          const anchor = await tagsElements[j].getAttribute('innerText');
          tags.push(anchor);
        }

        const descriptionElement = await checkForElement(item, itemDescPath);
        desc = await descriptionElement.getAttribute('innerText');

        finalList.push({
          id,
          title,
          author,
          tags,
          desc,
          url,
        });
      }

      const previousPageLinksElement = await checkForElement(driver, previousPageLinkPath);
      await previousPageLinksElement.click();
      waitFor(1000);
    }

    return finalList;
  },
  filterItems: (items) => {
    const goodies = [];
    const maybes = [];

    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      const itemText = `${item.title} ${item.author} ${item.desc} ${item.tags.join(' ')}`.toLocaleLowerCase();

      if (!itemIsBlackListed(itemText)) {
        if (itemIsWhiteListed(itemText)) {
          goodies.push(item);
        } else {
          maybes.push(item);
        }
      }
    }

    return ({
      goodies,
      maybes,
    });
  },
  downloadItems: async (driver, items) => {
    const originalWindow = await driver.getWindowHandle();

    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];

      printState(i, items.length);
      await driver.switchTo().newWindow('tab');
      await driver.get(item.url);
      await waitFor(1000);

      // remove warning if needed
      const removeWarningLinkElement = await checkForElement(driver, removeWarningLinkPath);

      if (removeWarningLinkElement) {
        await removeWarningLinkElement.click();
        await waitFor(1000);
      }

      const downloadButtonElement = await checkForElement(driver, itemDownloadPath);

      await downloadButtonElement.click();
      await waitFor(3000);

      // const donwloadLimitReached = await wasDownloadLimitReached(driver);

      // if (donwloadLimitReached) {
      //   console.warn('Donwload limit was reached');
      //   await driver.close();
      //   await driver.switchTo().window(originalWindow);
      //   return ({
      //     donwloadLimitReached: true,
      //     currentIndex: i,
      //   });
      // }

      await driver.close();
      await driver.switchTo().window(originalWindow);
    }

    await driver.switchTo().window(originalWindow);

    return ({
      donwloadLimitReached: false,
      currentIndex: 0,
    });
  },
};

module.exports = {
  ...itemÛtils,
};
