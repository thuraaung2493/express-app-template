import Status from '@app/enums/status.enum.js';
import type { NextFunction, Request, Response } from 'express';

const apiResponse = (_req: Request, res: Response, next: NextFunction) => {
  res.message = messageResponse(res);
  res.success = successResponse(res);
  res.fail = failResponse(res);
  res.serverError = serverErrorResponse(res);
  res.notFound = notFoundResponse(res);
  res.unauthorized = unauthorizedResponse(res);

  next();
};

const messageResponse =
  (res: Response) =>
  ({ message = 'Success.', status = Status.OK }: Express.ResponseBody) => {
    return res.status(status).json({ message, status });
  };

const successResponse =
  (res: Response) =>
  <T>(body: Express.SuccessResponeBody<T>) => {
    const { data, message = 'Success.', status = Status.OK } = body;

    return res.status(status).json({ data, message, status });
  };

const failResponse =
  (res: Response) =>
  <T>(body: Express.FailResponseBody<T>) => {
    const {
      errors,
      message = 'Something went wrong.',
      status = Status.INTERNAL_SERVER_ERROR,
    } = body;

    return res.status(status).json({ errors, message, status });
  };

const serverErrorResponse =
  (res: Response) =>
  ({
    message = 'Internal Server Error!',
    status = Status.INTERNAL_SERVER_ERROR,
  }: Express.ResponseBody) => {
    return res.status(status).json({ message, status });
  };

const notFoundResponse =
  (res: Response) =>
  ({
    message = 'Resource Not Found!',
    status = Status.NOT_FOUND,
  }: Express.ResponseBody) => {
    return res.status(status).json({ message, status });
  };

const unauthorizedResponse =
  (res: Response) =>
  ({
    message = 'Unauthenticated!',
    status = Status.UNAUTHORIZED,
  }: Express.ResponseBody) => {
    return res.status(status).json({ message, status });
  };

export default apiResponse;
