import userRepository from '@repositories/user.repository.js';
import hash from '@utils/auth/hash.js';

interface RegisterInfo {
  name: string;
  email: string;
  password: string;
}

class AuthService {
  async register({ name, email, password }: RegisterInfo) {
    return await userRepository.create({
      name,
      email,
      password: await hash.make(password),
    });
  }

  async login({ email, password }: Omit<RegisterInfo, 'name'>) {
    const user = await userRepository.first({ email });

    if (!user) {
      return false;
    }

    const isCheck = await hash.check(password, user.password!);

    return isCheck ? user : false;
  }
}

export default new AuthService();
