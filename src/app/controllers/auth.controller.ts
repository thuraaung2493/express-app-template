import UserDto from '@app/dtos/user.dto.js';
import HttpStatus from '@app/enums/status.enum.js';
import AutoBind from '@decorators/autoBind.js';
import userRepository from '@repositories/user.repository.js';
import hashService from '@services/hash.service.js';
import jsonWebTokenService from '@services/jsonWebToken.service.js';
import { type Request, type Response } from 'express';

@AutoBind
class AuthController {
  async register(req: Request, res: Response) {
    const { name, email, password } = req.body;

    try {
      const user = await userRepository.create({
        name,
        email,
        password: await hashService.make(password),
      });

      return res.json({
        status: HttpStatus.OK,
        message: 'Register success.',
        data: { user: UserDto.fromModel(user!) },
      });
    } catch (e) {
      console.log('User create failed!', e);
      if (e instanceof Error)
        return res.json({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: e.message,
        });
    }
  }

  async login(req: Request, res: Response) {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await userRepository.first({ email });

    if (!user) {
      return res.json({
        status: HttpStatus.UNPROCESSABLE_CONTENT,
        message: 'Email is invalid',
      });
    }

    const isCheck = await hashService.check(password, user.password!);

    if (isCheck) {
      return res.json({
        message: 'Login was successful.',
        status: HttpStatus.OK,
        data: {
          user: UserDto.fromModel(user),
          token: await jsonWebTokenService.create(user),
        },
      });
    }

    return res.json({
      message: 'Login failed.',
      status: HttpStatus.UNAUTHORIZED,
    });
  }

  async verify(req: Request, res: Response) {
    return res.json({
      status: HttpStatus.OK,
      message: 'Token was verified',
      user: UserDto.fromModel(req.user!),
    });
  }
}

export default new AuthController();
