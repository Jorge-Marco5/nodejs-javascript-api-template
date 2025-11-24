import bcrypt from 'bcryptjs';
import { prisma } from '#config/database.js';
import { AppError } from '#utils/appError.js';

class UserService {
  async getAll({ page = 1, limit = 10 }) {
    const start = (page - 1) * limit;
    const end = start + parseInt(limit);
    const user = await prisma.user.findMany({
      skip: start,
      take: limit,
    });

    const count = await prisma.user.count();
    const totalPages = Math.ceil(count / limit);

    return { user, count, totalPages };
  }

  async getById(id) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  }

  async create(data) {
    const { email, password, name } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('El email ya está registrado', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    return { user };
  }

  async update(id, data) {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data,
    });
    return { user };
  }

  async patch(id, data) {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data,
    });
    return { user };
  }

  async delete(id) {
    const user = await prisma.user.delete({
      where: {
        id,
      },
    });
    return { user };
  }
}

export const userService = new UserService();
