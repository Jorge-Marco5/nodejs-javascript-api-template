import { AppError } from '#utils/appError.js';
import { userService } from '#services/user/users.service.js';

export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await userService.getAll({ page, limit });

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getById(id);

    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const newUser = await userService.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedUser = await userService.update(id, req.body);

    if (!updatedUser) {
      throw new AppError('Usuario no encontrado', 404);
    }

    res.json({
      success: true,
      message: 'Usuario actualizado completamente',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const patchUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patchedUser = await userService.patch(id, req.body);

    if (!patchedUser) {
      throw new AppError('Usuario no encontrado', 404);
    }

    res.json({
      success: true,
      message: 'Usuario actualizado parcialmente',
      data: patchedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await userService.delete(id);

    if (!deleted) {
      throw new AppError('Usuario no encontrado', 404);
    }

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
      deletedId: id,
    });
  } catch (error) {
    next(error);
  }
};
