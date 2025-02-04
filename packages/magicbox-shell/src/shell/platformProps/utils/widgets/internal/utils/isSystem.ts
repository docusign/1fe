export const isSystemEnv = () =>
  typeof window !== 'undefined' && typeof System !== 'undefined';
