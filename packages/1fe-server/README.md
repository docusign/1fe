![1FE Logo](./assets/1fe-logo.svg)

# @1fe/server

[![npm version](https://badge.fury.io/js/@1fe%2Fserver.svg)](https://www.npmjs.com/package/@1fe/server) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Join the community](https://img.shields.io/badge/Join%20the%20community-1fe.com-blue)](https://1fe.com)

Express server that serves as the backbone of a 1fe instance, handling dynamic configuration, widget loading, and platform services.

Follow our documentation [here](https://1fe.com/start-here/) to get started with your own 1fe instance.

## Installation

```bash
npm install @1fe/server
# or
yarn add @1fe/server
```

## What is @1fe/server?

The `@1fe/server` package provides a complete Express.js server implementation for hosting 1fe applications. It includes:

- **Dynamic configuration management** with live updates
- **Widget loading** and version coordination
- **CSP (Content Security Policy)** management
- **Health monitoring**

## Quick Start

### Basic Server Setup

```typescript
import oneFEServer from '@1fe/server';

const app = oneFEServer({
  port: 3000,
  configManagement: {
    widgetVersions: {
      url: 'https://your-cdn.com/configs/widget-versions.json',
    },
    libraryVersions: {
      url: 'https://your-cdn.com/configs/lib-versions.json',
    },
    dynamicConfigs: {
      url: 'https://your-cdn.com/configs/live.json',
    },
    refreshMs: 30000,
  },
  cspConfigs: {
    'script-src': ["'self'", 'https://your-cdn.com'],
    'style-src': ["'self'", "'unsafe-inline'"],
  },
});

app.listen(3000, () => {
  console.log('1fe server running on port 3000');
});
```

To learn more, follow the reference guide [here](https://1fe.com/reference/1fe-server-reference/)

## Related Packages

- **[@1fe/shell](https://www.npmjs.com/package/@1fe/shell)** - Application shell and platform utilities
- **[@1fe/cli](https://www.npmjs.com/package/@1fe/cli)** - CLI tools for widget development

## Community

If you have questions or want to discuss this project, please visit the [Issues](https://github.com/docusign/1fe/issues) or [Discussions](https://github.com/docusign/1fe/discussions) pages in our monorepo.

## License

MIT © Docusign Inc.
