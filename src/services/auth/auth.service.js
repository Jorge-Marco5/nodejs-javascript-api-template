import bcrypt from 'bcryptjs';
import { prisma } from '#config/database.js';
import { generateToken } from '#utils/jwt.js';
import { AppError } from '#utils/appError.js';

class AuthService {
  async register(data) {
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

    const token = generateToken({ userId: user.id, email: user.email });

    return { user, token };
  }

  async login(data) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Credenciales inválidas', 401);
    }

    if (!user.isActive) {
      throw new AppError('Usuario inactivo', 401);
    }

    const token = generateToken({ userId: user.id, email: user.email });

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async createSession(userId, refreshToken, ipAddress) {
    try {
      const expirationDate = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);
      const session = await prisma.session.create({
        data: {
          userId,
          refreshToken,
          ipAddress,
          expiresAt: expirationDate,
        },
      });
      const { refreshToken: _, ...sessionWithoutRefreshToken } = session;
      return sessionWithoutRefreshToken;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async refreshToken(refreshToken) {
    const session = await prisma.session.findUnique({
      where: { refreshToken },
    });
    if (!session) {
      throw new AppError('Token inválido', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    const token = generateToken({ userId: user.id, email: user.email });

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    return user;
  }

  async logout(userId) {
    await prisma.session.deleteMany({ where: { userId } });
  }
}

export const authService = new AuthService();
