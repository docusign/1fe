declare namespace Express {
  export interface Request {
    cspNonceGuid?: string;
    plugin?: import('./index').PluginConfig;
    session_id?: string;
  }
}
