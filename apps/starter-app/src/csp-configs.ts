const commonCsp = {
    "scriptSrc": ["*", 'addCspNonceGuidHere'],
    "scriptSrcAttr": ["'unsafe-inline'"],
    "styleSrc": ["'unsafe-inline'"]
}

// TODO: strongly type
export const enforcedDefaultCsp: Record<string, any> = {
    development: commonCsp,
    integration: commonCsp,
    production: commonCsp
};

// TODO: strongly type
export const reportOnlyDefaultCsp: Record<string, any> = {
    development: {
        ...commonCsp,
        frameAncestor: ["test-domain.com"]
      }
}