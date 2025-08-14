![1FE Logo](./assets/1fe-logo.svg)

# @1fe/shell

[![npm version](https://badge.fury.io/js/@1fe%2Fshell.svg)](https://www.npmjs.com/package/@1fe/shell) [![npm downloads](https://img.shields.io/npm/dm/@1fe/shell.svg)](https://www.npmjs.com/package/@1fe/shell) [![CI Status](https://github.com/docusign/1fe/workflows/%F0%9F%9A%80%20CI%2FCD/badge.svg)](https://github.com/docusign/1fe/actions) [![Coverage Status](https://img.shields.io/badge/coverage-70%25-brightgreen.svg)](https://github.com/docusign/1fe) [![Bundle Size](https://img.shields.io/bundlephobia/minzip/@1fe/shell)](https://bundlephobia.com/result?p=@1fe/shell) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/) [![Join the community](https://img.shields.io/badge/Join%20the%20community-1fe.com-blue)](https://1fe.com)

Application shell providing common UI components, layout, and platform utilities for 1fe widgets.

Follow our documentation [here](https://1fe.com/start-here/) to learn more about 1fe and how the shell works.

## Installation

```bash
npm install @1fe/shell
# or
yarn add @1fe/shell
```

## What is @1fe/shell?

The `@1fe/shell` package provides the application shell that serves as the foundation for 1fe widgets. It includes:

- **Platform utilities** accessible to widgets via the sandbox
- **Common UI components** for consistent user experiences
- **Layout management** and routing capabilities
- **Performance monitoring** and telemetry
- **Storage utilities** for persistent data

## Basic Usage

### Rendering the Shell

```typescript
import renderOneFEShell from '@1fe/shell';

// Render the 1fe shell
const shellContainer = document.getElementById('shell-root');
renderOneFEShell(shellContainer, {
  // Shell configuration options
});
```

### Accessing Platform Props

```typescript
import { platformProps } from '@1fe/shell';

// Access platform utilities in your widget
export default function MyWidget() {
  useEffect(() => {
    // Track app load time
    platformProps.utils.appLoadTime.end();

    // Use event bus for communication
    platformProps.eventBus.emit('widget-loaded', { widgetId: 'my-widget' });
  }, []);

  return <div>My Widget Content</div>;
}
```

## Related Packages

- **[@1fe/server](https://www.npmjs.com/package/@1fe/server)** - Express server for 1fe instances
- **[@1fe/cli](https://www.npmjs.com/package/@1fe/cli)** - CLI tools for widget development

## Community

If you have questions or want to discuss this project, please visit the [Issues](https://github.com/docusign/1fe/issues) or [Discussions](https://github.com/docusign/1fe/discussions) pages in our monorepo.

## License

MIT © Docusign Inc.
