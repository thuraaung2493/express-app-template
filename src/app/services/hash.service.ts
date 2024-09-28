import { SALT_ROUNDS } from '@config/auth.js';
import bcrypt from 'bcrypt';

class Hash {
  make(data: string) {
    return bcrypt.hash(data, SALT_ROUNDS);
  }

  check(plain: string, hash: string) {
    return bcrypt.compare(plain, hash);
  }
}

export default new Hash();