# 1fe (One Frontend) 🚀

A micro-frontend platform that allows teams to focus on creating experiences for the front end utilizing shared utilities and governance controls provided by a single platform team. 1fe achieves this by standardizing the development, deployment and execution of frontend experiences.

Visit our [documentation site](https://1fe.com/start-here/) for comprehensive guides and API references.

## 📋 Prerequisites

- **Node.js** `>= 22` (required)
- **Yarn** (package manager)
- **Git** with SSH access to submodules

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/docusign/1fe.git
cd 1fe

# Install dependencies
yarn install

# Build all packages
yarn build
```

## 📦 Project Structure

This monorepo contains the core packages that power the 1fe ecosystem:

### Core Packages

- **`@1fe/server`** - Express server that serves as the backbone of a 1fe instance, handling dynamic configuration and widget loading
- **`@1fe/shell`** - Application shell providing common UI components, layout, and platform utilities (the "sandbox") to widgets
- **`@1fe/cli`** - Command-line tools for building, developing, and validating widgets with standardized configurations
- **`@1fe/create-1fe-app`** - Scaffolding tool for quickly creating new 1fe instances

### Configuration Packages

- **`@1fe/eslint-config`** - Shared ESLint configuration enforced across all widgets
- **`@1fe/typescript-config`** - Shared TypeScript configurations for consistent builds

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

### Package Development

Each package in this monorepo can be developed independently:

```bash
# Work on a specific package
cd packages/1fe-server
yarn dev

# Test a specific package
cd packages/1fe-cli
yarn test
```

## 🤝 Contributing

We welcome contributions!

### Pull Request Process

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Quality Requirements

- All PRs trigger automated CI/CD pipeline
- Tests must pass: Build ✅ Lint ✅ Unit Tests ✅ E2E Tests ✅
- Code review required before merging
- Publishing happens automatically on merge to `main`

## 💬 Community & Support

- **[Documentation](https://1fe.com/start-here/)** - Comprehensive guides and references
- **[GitHub Issues](https://github.com/docusign/1fe/discussions)** - Bug reports and feature requests
- **[GitHub Discussions](https://github.com/docusign/1fe/discussions)** - Community questions and ideas

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Ready to get started?** Check out our [Installation Guide](https://1fe.com/getting-started/installation) or explore the [demo site](https://demo.1fe.com) to see 1fe in action!
