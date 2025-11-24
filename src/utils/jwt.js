import jwt from 'jsonwebtoken';
import { AppError } from '#utils/appError.js';
import { HTTP_STATUS } from '#config/constants.js';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

export const generateToken = payload => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return token;
};

export const generateRefreshToken = payload => {
  const refreshToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
  return refreshToken;
};

export const verifyToken = token => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new AppError('Token inválido o expirado', HTTP_STATUS.UNAUTHORIZED);
  }
};

export const verifyRefreshToken = token => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new AppError('Token inválido o expirado', HTTP_STATUS.UNAUTHORIZED);
  }
};
