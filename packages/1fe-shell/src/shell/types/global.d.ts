import 'systemjs';

export {};

declare global {
  const BROWSERS_LIST_CONFIG: string[];
  System;

  interface Window {
    importMapOverrides: {
      addOverride: (id: string, url: string) => void;
      getOverrideMap: () => System.ImportMap;
      getCurrentPageMap: () => Promise<{ imports: Record<string, string> }>;
    };
  }
}
