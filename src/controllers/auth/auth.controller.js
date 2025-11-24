import { authService } from '#services/auth/auth.service.js';
import { generateToken, generateRefreshToken } from '#utils/jwt.js';
import { HTTP_STATUS } from '#config/constants.js';
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    const { password: _, ...userWithoutPassword } = result.user;
    result.user = userWithoutPassword;

    const payload = {
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
    };

    const token = generateToken(payload);
    result.token = token;

    const refreshToken = generateRefreshToken(payload);
    result.refreshToken = refreshToken;

    const ipAddress =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    await authService.createSession(result.user.id, refreshToken, ipAddress);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Login exitoso',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id);
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.json({
      success: true,
      message: 'Logout exitoso',
    });
  } catch (error) {
    next(error);
  }
};
