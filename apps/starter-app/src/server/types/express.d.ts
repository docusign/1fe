declare namespace Express {
    export interface Request {
      cspNonceGuid?: string;
      session_id?: string;
    }
  }
  