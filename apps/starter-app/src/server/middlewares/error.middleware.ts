import { NextFunction, Request, Response } from 'express';

import { HttpException } from '../exceptions/HttpException';
import { APIException } from '../exceptions/APIException';
import { APIErrorResponse } from '../types/APIErrorResponse';

const errorMiddleware = (
  error: HttpException | APIException,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';

    // Console logging
    console.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`,
    );

    // if an error has been thrown from an API route then serve a json response
    if (error instanceof APIException) {
      const apiError: APIErrorResponse = {
        errorCode: error.code,
        errorMessage: error.message,
      };
      res.status(error.status).json(apiError);
      return;
    }

    // return the standard error page
    // TODO: fix any
    const { cspNonceGuid } = req as any;

    const pageTitle = error.message || 'Error';

    const dataForRenderingTemplatePayload = {
      cspNonceGuid,
      type: 'error',
      pageTitle,
      favicon: '/favicon.ico',
    };

    return res.render(
      'error.html.ejs',
      dataForRenderingTemplatePayload,
    );
  } catch (err) {
    next(err);
  }
};

export default errorMiddleware;
