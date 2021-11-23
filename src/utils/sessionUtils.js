/* eslint-disable no-await-in-loop */

const { checkForElement } = require('./driverUtils');
const {
  agreeButtonPath,
  myProfileButtonPath,
  loginButtonPath,
  usernameInputPath,
  passwordInputPath,
  loginSubmitButtonPath,
  bodyPath,
} = require('./elementPaths');

const sessionUtils = {
  checkEnvironment: () => {
    const {
      CHROME_PATH,
      PROFILE_PATH,
      PROFILE_NAME,
      LANDING_URL,
      GOODIES_PATH,
      MAYBES_PATH,
      TRIAGE_PATH,
      PAGE_URLS,
      FREESOUND_EMAIL,
      FREESOUND_PASSWORD,
    } = process.env;

    if (!CHROME_PATH
      || !PROFILE_PATH
      || !PROFILE_NAME
      || !LANDING_URL
      || !GOODIES_PATH
      || !MAYBES_PATH
      || !TRIAGE_PATH
      || !PAGE_URLS
      || !FREESOUND_EMAIL
      || !FREESOUND_PASSWORD) {
      return false;
    }

    return true;
  },
  dealWithCookiePolicy: async (driver) => {
    const agreeButton = await checkForElement(driver, agreeButtonPath);

    if (agreeButton) {
      await agreeButton.click();
    }
  },
  dealWithLogin: async (driver) => {
    let myProfileButton = await checkForElement(driver, myProfileButtonPath);

    if (!myProfileButton) {
      const loginButton = await checkForElement(driver, loginButtonPath);

      await loginButton.click();

      const usernameInput = await checkForElement(driver, usernameInputPath);
      const passwordInput = await checkForElement(driver, passwordInputPath);

      if (usernameInput) {
        usernameInput.sendKeys(process.env.FREESOUND_EMAIL);
        passwordInput.sendKeys(process.env.FREESOUND_PASSWORD);

        const loginSubmitButton = await checkForElement(driver, loginSubmitButtonPath);

        loginSubmitButton.click();

        myProfileButton = await checkForElement(driver, myProfileButtonPath);

        if (!myProfileButton) {
          driver.close();
          return;
        }

        await driver.get(process.env.LANDING_URL);
      }
    }
  },
  wasDownloadLimitReached: async (driver) => {
    const bodyElement = await checkForElement(driver, bodyPath);
    const bodyText = await bodyElement.getAttribute('innerText');
    const checkString = 'Sorry, due to high demand, download limits are in place and you have reached the limit.\nTry again in 24 hours.';

    return bodyText === checkString;
  },
};

module.exports = {
  ...sessionUtils,
};
