---
'@1fe/server': patch
'@1fe/shell': patch
'@1fe/cli': patch
'@1fe/create-1fe-app': patch
---

Replace non-working BundlePhobia badges with working bundlejs.com alternatives

Updated bundle size badges across all package README files to use bundlejs.com instead of the non-functional bundlephobia.com service. The new badges provide better functionality and are actively maintained:

- Changed badge URLs from `bundlephobia.com/result?p=package` to `bundlejs.com/?q=package`
- Updated badge image URLs from `img.shields.io/bundlephobia/minzip/package` to `deno.bundlejs.com/?q=package&badge=detailed`
- All npm package badges remain functional and working correctly

This ensures users can access working bundle analysis tools and view accurate bundle size information.
