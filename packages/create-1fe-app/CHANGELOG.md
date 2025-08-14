# @1fe/create-1fe-app

## 0.0.6

### Patch Changes

- 07d9186: Replace non-working BundlePhobia badges with working bundlejs.com alternatives

  Updated bundle size badges across all package README files to use bundlejs.com instead of the non-functional bundlephobia.com service. The new badges provide better functionality and are actively maintained:
  - Changed badge URLs from `bundlephobia.com/result?p=package` to `bundlejs.com/?q=package`
  - Updated badge image URLs from `img.shields.io/bundlephobia/minzip/package` to `deno.bundlejs.com/?q=package&badge=detailed`
  - All npm package badges remain functional and working correctly

  This ensures users can access working bundle analysis tools and view accurate bundle size information.

## 0.0.5

### Patch Changes

- 01c8301: Add proper npm package metadata and fix missing license/repository info
  - Add license, author, homepage, repository fields to all packages
  - Include logo assets in package files for npm display
  - Change access from restricted to public for better visibility

  This fixes:
  - Missing npm badges on package pages
  - "none" license display on npmjs.com
  - Missing GitHub repository links
  - Logo not appearing on npm package pages

## 0.0.4

### Patch Changes

- 3f760a5: Manual patch version bump for all packages

## 0.0.3

### Patch Changes

- 464a88d: Patch bump all packages for release

## 0.0.2

### Patch Changes

- 8c2fca5: Adding a node version check to create-1fe-app scaffold package.
