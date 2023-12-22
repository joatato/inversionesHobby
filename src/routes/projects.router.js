import { projectsModel } from '../dao/models/projects.models.js';
import express from 'express';
const router = express.Router();

// Obtener todos los proyectos
router.get('/', async (req, res) => {
  try {
    const projects = await projectsModel.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un proyecto por ID
router.get('/:projectId', async (req, res) => {
  try {
    const project = await projectsModel.findById(req.params.projectId);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Proyecto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear un nuevo proyecto
router.post('/', async (req, res) => {
  const newProject = new projectsModel(req.body);

  console.log("Ha llegado un posteo")

  try {
    const savedProject = await newProject.save();
    // Obtén el ID del propietario del proyecto desde req.body
    const ownerId = req.body.owner;
    // Actualiza el array de proyectos del usuario propietario
    await usersModel.findByIdAndUpdate(ownerId, { $push: { proyects: savedProject._id } });
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  
});

// Actualizar un proyecto por ID
router.put('/:projectId', async (req, res) => {
  try {
    const updatedProject = await projectsModel.findByIdAndUpdate(req.params.projectId, req.body, { new: true });
    if (updatedProject) {
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Proyecto no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un proyecto por ID
router.delete('/:projectId', async (req, res) => {
  try {
    const deletedProject = await projectsModel.findByIdAndRemove(req.params.projectId);
    if (deletedProject) {
      res.json({ message: 'Proyecto eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Proyecto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Añadir reseñas
router.post('/:projectId/reviews', async (req, res) => {
  const { userId, comment, rating } = req.body;

  try {
    const project = await projectsModel.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Agrega la nueva reseña al array de reseñas del proyecto
    project.reviews.push({ user: userId, comment, rating });
    await project.save();

    res.status(201).json({ message: 'Reseña agregada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
