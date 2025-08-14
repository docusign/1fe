---
"@1fe/server": patch
"@1fe/shell": patch  
"@1fe/cli": patch
"@1fe/create-1fe-app": patch
---

Remove SSH key requirements for submodules since repositories are now public

Fixed Dependabot CI failures by eliminating SSH key dependencies for accessing submodules:

- Converted submodule URL from SSH (`git@github.com:`) to HTTPS (`https://github.com/`)
- Removed SSH key input requirement from setup-submodules GitHub Action
- Simplified CI/CD workflow by removing SSH key parameters
- All submodule operations now work with public repository access

This resolves the "ssh-private-key argument is empty" error that was causing Dependabot PRs to fail in CI builds. Dependabot PRs can now run successfully without requiring repository secrets access.