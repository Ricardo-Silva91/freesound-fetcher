# freesound-fetcher
selenium script for searching and downloading files from https://freesound.org/

## Contents

 - [requirements](#requirements)



 ## Requirements

 In order for the script to work, you need to have [selenium-webdriver](https://www.selenium.dev/documentation/getting_started/) set up on your system.
 You will also need to create the `.env` file for your project.
 start by copying the `.env.sample` file:

```
cp .env.sample .env
```

 Then, on the new `.env` file, fill the following fields:

 | name | description | default |
 |------|-------------|---------|
 | CHROME_PATH | full path to the chrome (or brave) executable to use. | - |
 | PROFILE_PATH | full path to the profile directory (can be empty, the profile will create itself if it doesn't exist).  | - |
 | PROFILE_NAME | profile name. | default |
 | LANDING_URL | landing url for the script. | https://freesound.org/ |
 | PAGE_URLS | pages to download from (separated by ',') | https://freesound.org/browse/tags/sfx/ |
 | FREESOUND_EMAIL | user email to login. | - |
 | FREESOUND_PASSWORD | user password to login. | - |
 | BLACKLISTED_TERMS | words/phrases used to blacklist an item (if they are found in the item's title, description, author or tags, the item will not be downloaded). | Drums |
 | WHITELISTED_TERMS | words/phrases used to whitelist an item, these items are stored in the 'goodies' directory (only applies to not blacklisted items). | - |
 | GOODIES_PATH | path to the directory where whitelisted items will be stored. | - |
 | MAYBES_PATH | path to the directory where not blacklisted items will be stored. | - |
 | TRIAGE_PATH | path to the directory where downloads will be stored. (same as the one set in the browser) | - |
 
