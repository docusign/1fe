# @1fe/server

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

<<<<<<< HEAD
To learn more, follow the reference guide [here](https://1fe.com/reference/1fe-server-reference/)
=======
To learn more, follow the reference guide [here](https://1fe.com/api-reference/1fe-server-reference/)
>>>>>>> afc05324d81379ca198ed78cb025e3fa9557229e

## Related Packages

- **[@1fe/shell](https://www.npmjs.com/package/@1fe/shell)** - Application shell and platform utilities
- **[@1fe/cli](https://www.npmjs.com/package/@1fe/cli)** - CLI tools for widget development

<<<<<<< HEAD
## Community

If you have questions or want to discuss this project, please visit the [Issues](https://github.com/docusign/1fe/issues) or [Discussions](https://github.com/docusign/1fe/discussions) pages in our monorepo.

=======
>>>>>>> afc05324d81379ca198ed78cb025e3fa9557229e
## License

MIT © Docusign Inc.
