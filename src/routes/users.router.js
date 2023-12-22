import { usersModel } from '../dao/models/users.models.js';
import express from 'express';
const router = express.Router();

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await usersModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un usuario por ID
router.get('/:userId', async (req, res) => {
    try {
        const user = await usersModel.findById(req.params.userId);
        if (user) {
          res.json(user);
        } else {
          res.status(404).json({ message: 'Usuario no encontrado' });
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
    const newUser = new usersModel(req.body);

    try {
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

// Actualizar un usuario por ID
router.put('/:userId', async (req, res) => {
    try {
        const updatedUser = await usersModel.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        if (updatedUser) {
          res.json(updatedUser);
        } else {
          res.status(404).json({ message: 'Usuario no encontrado' });
        }
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
});

// Eliminar un usuario por ID
router.delete('/:userId', async (req, res) => {
    try {
        const deletedUser = await usersModel.findByIdAndRemove(req.params.userId);
        if (deletedUser) {
          res.json({ message: 'Usuario eliminado exitosamente' });
        } else {
          res.status(404).json({ message: 'Usuario no encontrado' });
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
});

export default router;
