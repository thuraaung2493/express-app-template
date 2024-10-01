import Status from '@app/enums/status.enum.js';
import type { Request, Response } from 'express';
import { z } from 'zod';

export default class Validator {
  constructor(private req: Request) {}

  static of(req: Request): Validator {
    return new Validator(req);
  }

  make<T extends z.ZodTypeAny>(schema: T) {
    let isFails = false;
    const result = schema.safeParse(this.req.body);

    if (!result.success) {
      isFails = true;
    }

    const toResponse = (res: Response) => {
      return res.fail({
        status: Status.UNPROCESSABLE_CONTENT,
        message: 'The given data was invalid!',
        errors: result.error?.flatten().fieldErrors,
      });
    };

    return {
      toResponse,
      fails: () => isFails,
      validated: () => result.data as z.infer<T>,
      errors: result.error?.flatten().fieldErrors,
      data: result.data as z.infer<T>,
    };
  }
}

export const validate = <T extends z.ZodTypeAny>(input: unknown, schema: T) => {
  const { success, data, error } = schema.safeParse(input);

  if (!success) {
    return {
      isFail: true,
      errors: error.flatten().fieldErrors,
      data: null,
    };
  }

  return {
    isFail: false,
    errors: null,
    data: data as z.infer<T>,
  };
};
