---
"@1fe/cli": patch
"@1fe/server": patch
"@1fe/shell": patch
"@1fe/create-1fe-app": patch
---

Add proper npm package metadata and fix missing license/repository info

- Add license, author, homepage, repository fields to all packages
- Include logo assets in package files for npm display
- Change access from restricted to public for better visibility

This fixes:
- Missing npm badges on package pages
- "none" license display on npmjs.com
- Missing GitHub repository links
- Logo not appearing on npm package pages