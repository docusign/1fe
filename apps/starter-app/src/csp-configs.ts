// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CSPPerEnvironment } from '@devhub/1fe-server';

const commonCsp = {
  scriptSrc: ['*', 'addCspNonceGuidHere'],
  styleSrc: ["'unsafe-inline'"],
};

export const enforcedDefaultCsp: Record<string, CSPPerEnvironment> = {
  development: commonCsp,
  integration: commonCsp,
  production: commonCsp,
};

export const reportOnlyDefaultCsp: Record<string, CSPPerEnvironment> = {
  development: {
    ...commonCsp,
    frameAncestors: ['test-domain.com'],
  },
};
