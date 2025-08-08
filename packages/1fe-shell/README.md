# @1fe/shell

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

## License

MIT © Docusign Inc.
