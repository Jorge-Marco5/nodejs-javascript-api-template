import { Router } from 'express';
import userRoutes from '#routes/user/user.routes.js';
import authRoutes from '#routes/auth/auth.routes.js';

const router = Router();

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Bienvenido a la API
 *     tags: [Root]
 *     responses:
 *       200:
 *         description: Bienvenido a la API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 version:
 *                   type: string
 *                 docs:
 *                   type: string
 */
router.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API',
    version: '1.0.0',
    docs: '/api-docs',
  });
});

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación
 */
router.use('/auth', authRoutes);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints de usuarios
 */
router.use('/users', userRoutes);

export default router;
