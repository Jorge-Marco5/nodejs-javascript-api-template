import { body, validationResult } from 'express-validator';

export const validateUser = [
  body('name')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isString()
    .withMessage('El nombre debe ser texto'),
  body('email')
    .notEmpty()
    .withMessage('El email es requerido')
    .isString()
    .withMessage('El email debe ser texto'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isString()
    .withMessage('La contraseña debe ser texto'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];
