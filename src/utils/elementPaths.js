const paths = {
  bodyPath: './/body',
  agreeButtonPath: './/button[@mode="primary"]',
  loginButtonPath: ".//a[text() = 'Log In']",
  usernameInputPath: './/input[@id="id_username"]',
  passwordInputPath: './/input[@id="id_password"]',
  disclaimerInputPath: './/input[@id="user_disclaimer"]',
  loginSubmitButtonPath: './/input[@value="login"]',
  myProfileButtonPath: './/div[@id="account_user"]',
  pageSectionTitlePath: './/*[@id="follow_browse_tags"]//*[contains(concat(" ",normalize-space(@class)," ")," tags ")]//a',
  itemPlayerPath: './/div[contains(concat(" ",normalize-space(@class)," ")," sample_player_small ")]',
  itemPlayerTitlePath: './/*[contains(concat(" ",normalize-space(@class)," ")," title ")]',
  itemPlayerAuthorPath: './/a[contains(concat(" ",normalize-space(@class)," ")," user ")]',
  itemPlayerDownloadButtonPath: './/a[contains(concat(" ",normalize-space(@class)," ")," btn-download ")]',
  itemTagsPath: './/*[contains(concat(" ",normalize-space(@class)," ")," tags ")]//a',
  itemTagsAnchorPath: './/a',
  itemDescPath: './/*[contains(concat(" ",normalize-space(@class)," ")," description ")]',
  itemDescParagraphPath: './/p',
  lastPageLinkPath: './/li[contains(concat(" ",normalize-space(@class)," ")," last-page ")]',
  previousPageLinkPath: './/*[contains(concat(" ",normalize-space(@class)," ")," pagination ")]//*[contains(concat(" ",normalize-space(@class)," ")," previous-page ")]',
  pageLinksPath: './/*[contains(concat(" ",normalize-space(@class)," ")," pagination-links ")]',
  pageLinksNextAnchorPath: ".//a[text() = '>']",
  removeWarningLinkPath: './/a[@id="remove_warning_link"]',
  itemDownloadPath: './/*[@id="download"]//a',
};

module.exports = {
  ...paths,
};
