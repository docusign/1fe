export function isCI(): boolean {
  return !!process.env.CI; // TODO support --ci flag here.
}
