/**
 * Standard response for errors returned from API endpoints
 */
export type APIErrorResponse = {
  /**
   * Error codes that are informative to the client but do not expose internal details
   * of the API, specifically with auth.
   */
  errorCode: number;
  /**
   * Error message to help the client resolve the issue.
   */
  errorMessage: string;
};
