import { CSPPerEnvironment } from '@devhub/1fe-shell';

const commonCsp = {
    "scriptSrc": ["*", 'addCspNonceGuidHere'],
    "styleSrc": ["'unsafe-inline'"]
}

export const enforcedDefaultCsp: Record<string, CSPPerEnvironment> = {
    development: commonCsp,
    integration: commonCsp,
    production: commonCsp
};

export const reportOnlyDefaultCsp: Record<string, CSPPerEnvironment> = {
    development: {
        ...commonCsp,
        frameAncestors: ["test-domain.com"]
      }
}