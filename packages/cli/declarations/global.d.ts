/// <reference types="webpack-dev-server" />

declare module '*.ejs' {
  const content: string;
  export default content;
}

declare module 'systemjs-webpack-interop/SystemJSPublicPathWebpackPlugin' {
  import { Compiler, WebpackPluginInstance } from 'webpack';

  class SystemJSPublicPathWebpackPlugin implements WebpackPluginInstance {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(opts?: Record<string, any>);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [index: string]: any;
    apply: (compiler: Compiler) => void;
  }

  export default SystemJSPublicPathWebpackPlugin;
}

declare module '@pmmmwh/react-refresh-webpack-plugin' {
  import { Compiler, WebpackPluginInstance } from 'webpack';

  class SystemJSPublicPathWebpackPlugin implements WebpackPluginInstance {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(opts?: Record<string, any>);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [index: string]: any;
    apply: (compiler: Compiler) => void;
  }

  export default SystemJSPublicPathWebpackPlugin;
}

declare module 'cfonts' {
  export function say(
    arg0: string,
    arg1: {
      font?: string; // define the font face
      align?: string; // define text alignment
      colors?: string[]; // define all colors
      background?: string; // define the background color, you can also use `backgroundColor` here as key
      letterSpacing?: number; // define letter spacing
      lineHeight?: number; // define the line height
      space?: boolean; // define if the output text should have empty lines on top and on the bottom
      maxLength?: string; // define how many character can be on one line
      gradient?: boolean | string[]; // define your two gradient colors
      independentGradient?: boolean; // define if you want to recalculate the gradient for each new line
      transitionGradient?: boolean; // define if this is a transition between colors directly
      env?: string;
    },
  );
}

declare module 'webpack-dev-server/lib/getPort' {
  import { getPorts } from 'webpack-dev-server/types/lib/getPort';
  export default getPorts;
}

declare module '*.txt' {
  const content: string;
  export default content;
}
