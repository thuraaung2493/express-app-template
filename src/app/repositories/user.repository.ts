import { PrismaClient, type Prisma } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  type DefaultArgs,
} from '@prisma/client/runtime/library';

class UserRepository {
  private user: Prisma.UserDelegate<DefaultArgs>;

  constructor() {
    const prisma = new PrismaClient();
    this.user = prisma.user;
  }

  async create(data: Prisma.UserCreateInput) {
    try {
      return await this.user.create({ data });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('A new user cannot be created with this email');
        }
      } else {
        throw new Error('Something went wrong!');
      }
    }
  }

  async first(where: Prisma.UserWhereInput) {
    return this.user.findFirst({ where });
  }

  async all(args: Prisma.UserFindManyArgs) {
    return this.user.findMany(args);
  }
}

export default new UserRepository();
