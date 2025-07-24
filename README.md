# 1FE (One Frontend) 🚀

A modern frontend framework and toolchain that provides a unified development experience for building performant web applications with server-side rendering capabilities.

## 📋 Prerequisites

- **Node.js** `>= 22` (required)
- **Yarn** (package manager)
- **Git** with SSH access to submodules

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd 1fe

# Install dependencies
yarn install

# Build all packages
yarn build
```

## 📦 Project Structure

This is a monorepo containing the following packages:

### Core Packages

- **`@1fe/shell`** - Frontend shell/runtime for 1FE applications
- **`@1fe/server`** - Server-side rendering and backend utilities  
- **`@1fe/cli`** - Command-line tools for development and build processes
- **`@1fe/create-1fe-app`** - Scaffolding tool for new 1FE applications

### Configuration Packages

- **`@1fe/eslint-config`** - Shared ESLint configuration
- **`@1fe/typescript-config`** - Shared TypeScript configurations

## 🛠️ Development Commands

### Building

```bash
# Build all packages
yarn build

# Build packages in watch mode
yarn dev

# Clean all build artifacts
yarn clean
```

### Testing

```bash
# Run unit tests across all packages
yarn test

# Run E2E tests (Playwright)
yarn test:playwright

# Type checking
yarn typecheck
```

## 📖 Development Workflow

### Working with Submodules

This project uses Git submodules. Make sure they're initialized:

```bash
git submodule update --init --recursive
```

## 📚 Useful Resources

- **Turbo Documentation** - This project uses Turbo for monorepo management
- **TypeScript** - All packages are written in TypeScript
- **Playwright** - Used for E2E testing

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Pull Request Process

- All PRs trigger automated CI/CD pipeline
- Tests must pass: Build ✅ Lint ✅ Unit Tests ✅ E2E Tests ✅
- Code review required before merging
- Publishing happens automatically on merge to `main`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
