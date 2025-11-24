import { prisma } from '#config/database.js';
import logger from '#config/logger.js';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    await prisma.user.create({
      data: {
        email: 'user@example.com',
        password: await bcrypt.hash('password', 10),
        name: 'User Example',
        role: 'ADMIN',
        isActive: true,
      },
    });
    logger.info('User created successfully');
  } catch (error) {
    logger.error('Error creating user:', error);
  }
}

seed();
