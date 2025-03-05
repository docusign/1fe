import { HttpException } from './HttpException';
import { ErrorCodes } from './errorCodes';

/**
 * Exception on an API endpoint where we want to return json
 */
export class APIException extends HttpException {
  public code: ErrorCodes;
  public internalMessage: string;

  /**
   * Construct a new api exception
   * @param httpStatus The http status to return on the response
   * @param code The internal error code
   * @param message Error message to help the end user
   * @param internalMessage Internal error message to help the developer.  Not sent to client.
   * @param cause Original error that caused this exception
   */
  constructor({
    status,
    code,
    message,
    internalMessage,
    cause,
  }: {
    status: number;
    code: ErrorCodes;
    message: string;
    internalMessage: string;
    cause?: Error;
  }) {
    super(status, message);
    this.code = code;
    this.cause = cause;
    this.internalMessage = internalMessage;
  }

  toString(): string {
    const result = `${super.toString()}: code [${this.code}] internalMessage [${
      this.internalMessage
    }]`;

    return result;
  }
}
