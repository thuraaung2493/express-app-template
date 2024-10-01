namespace Express {
  interface User {
    id: number;
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface ResponseBody {
    message?: string;
    status?: HttpStatus;
  }

  interface SuccessResponeBody<T = any> extends ResponseBody {
    data: T;
  }

  interface FailResponseBody<T = any> extends ResponseBody {
    errors: T;
  }

  interface Request {
    user?: User;
  }
  interface Response {
    message: (data: ResponseBody) => this;
    success: <T = any>(data: SuccessResponeBody<T>) => this;
    fail: <T = any>(data: FailResponseBody<T>) => this;
    serverError: (data: ResponseBody) => this;
    notFound: (data: ResponseBody) => this;
    unauthorized: (data: ResponseBody) => this;
  }
}
