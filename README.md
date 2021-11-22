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
 | CHROME_PATH | desc | - |
 | PROFILE_PATH | desc | - |
 | PROFILE_NAME | desc | default |
 | LANDING_URL | desc | https://freesound.org/ |
 | GOODIES_PATH | desc | - |
 | MAYBES_PATH | desc | - |
 | TRIAGE_PATH | desc | - |
 | PAGE_URLS | desc | https://freesound.org/browse/tags/sfx/ |
 | LOOPERMAN_EMAIL | desc | - |
 | LOOPERMAN_PASSWORD | desc | - |
 | WHITELISTED_TERMS | desc | - |
 | BLACKLISTED_TERMS | desc | Drums |
 
