import UserDto from '@app/dtos/user.dto.js';
import AutoBind from '@decorators/autoBind.js';
import authService from '@services/auth.service.js';
import jsonWebToken from '@utils/auth/jsonWebToken.js';
import Logger from '@utils/logger.js';
import Validator from '@utils/validator/index.js';
import { loginSchema, registerSchema } from '@validateSchema/auth.schema.js';
import { type Request, type Response } from 'express';

@AutoBind
class AuthController {
  async register(req: Request, res: Response) {
    const validator = Validator.of(req).make(registerSchema);

    if (validator.fails()) {
      return validator.toResponse(res);
    }

    try {
      const user = await authService.register(validator.validated());

      return res.success({
        message: 'Register success.',
        data: { user: UserDto.fromModel(user!) },
      });
    } catch (e) {
      Logger.error('User create failed!', e);
      if (e instanceof Error) {
        return res.serverError({
          message: e.message,
        });
      }
    }
  }

  async login(req: Request, res: Response) {
    const validator = Validator.of(req).make(loginSchema);

    if (validator.fails()) {
      return validator.toResponse(res);
    }

    const login = await authService.login(validator.validated());

    if (!login) {
      return res.unauthorized({
        message: 'Login failed.',
      });
    }

    return res.success({
      message: 'Login was successful.',
      data: {
        user: UserDto.fromModel(login),
        token: await jsonWebToken.create(login),
      },
    });
  }

  async verify(req: Request, res: Response) {
    return res.success({
      message: 'Token was verified',
      data: {
        user: UserDto.fromModel(req.user!),
      },
    });
  }
}

export default new AuthController();
