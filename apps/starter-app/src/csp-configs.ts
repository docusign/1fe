const commonCsp = {
    "scriptSrc": ["*", 'addCspNonceGuidHere'],
    "styleSrc": ["'unsafe-inline'"]
}

// TODO[1fe]: strongly type
export const enforcedDefaultCsp: Record<string, any> = {
    development: commonCsp,
    integration: commonCsp,
    production: commonCsp
};

// TODO[1fe]: strongly type
export const reportOnlyDefaultCsp: Record<string, any> = {
    development: {
        ...commonCsp,
        frameAncestor: ["test-domain.com"]
      }
}