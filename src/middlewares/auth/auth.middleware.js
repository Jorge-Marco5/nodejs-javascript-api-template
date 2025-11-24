import { verifyToken } from '#utils/jwt.js';
import { AppError } from '#utils/appError.js';
import { prisma } from '#config/database.js';
import { authService } from '#services/auth/auth.service.js';

export const authenticate = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token && !refreshToken) {
      throw new AppError('Token de acceso no proporcionado', 401);
    }

    try {
      if (token) {
        const decodedToken = verifyToken(token);
        req.user = {
          ...decodedToken,
          id: decodedToken.userId,
          role: decodedToken.role,
          isActive: decodedToken.isActive,
          refreshToken,
        };
        return next();
      }
    } catch (error) {
      if (!refreshToken) {
        throw error;
      }
    }
    const decodedRefreshToken = verifyToken(refreshToken);
    const userId = decodedRefreshToken.userId;

    const session = await prisma.session.findMany({
      where: { refreshToken, userId },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new AppError('Sesión inválida o expirada', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new AppError('Usuario no encontrado o inactivo', 401);
    }

    req.user = { ...user, refreshToken };
    next();
  } catch (error) {
    next(error);
  }
};

export const validateRegister = (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    throw new AppError('Faltan datos', 400);
  }

  if (password.length < 6) {
    throw new AppError('La contraseña debe tener al menos 6 caracteres', 400);
  }

  if (!email.includes('@')) {
    throw new AppError('El email debe ser válido', 400);
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Faltan datos', 400);
  }

  next();
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError('No tienes permisos para esta acción', 403);
    }
    next();
  };
};

export const refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError('Faltan datos', 400);
  }
  try {
    const decodedRefreshToken = verifyToken(refreshToken);
    const userId = decodedRefreshToken.userId;
    const session = await authService.refreshToken(refreshToken);
    if (!session || session.expiresAt < new Date()) {
      throw new AppError('Sesión inválida o expirada', 401);
    }
    const user = await authService.getProfile(userId);
    if (!user || !user.isActive) {
      throw new AppError('Usuario no encontrado o inactivo', 401);
    }
    req.user = { ...user, refreshToken };
    next();
  } catch (error) {
    next(error);
  }
};
