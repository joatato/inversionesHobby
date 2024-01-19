import { projectsModel } from '../dao/models/projects.models.js';
import { usersModel } from '../dao/models/users.models.js';
import path from 'path';
import __dirname from '../utils/utils.js';
import fs from 'fs'
//-------------------------------------------------------------------------------------
// Obtener todos los proyectos

const getProjects = async (req, res) => {
    try {
        const projects = await projectsModel.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Obtener un proyecto por ID
const getProject = async (req, res) => {
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
}

// Ruta para manejar el formulario de proyectos
const createProject = async (req, res) => {
    console.log("Llego el posteo");
    // try {
    //     const newProject = new projectsModel({
    //         name: req.body.name,
    //         description: req.body.description,
    //         amountNecessary: req.body.amountNecessary,
    //         steps: req.body.steps,
    //         owner: req.user.id,
    //         location: {
    //             address: req.body['location.address'],
    //             city: req.body['location.city'],
    //             state: req.body['location.state'],
    //             country: req.body['location.country'],
    //             province: req.body['location.province'],
    //         },
    //         thumbnail: req.file ? req.file.filename : null, // Nombre del archivo de la imagen
    //     });
    try {
        const newProject = new projectsModel({
            ...req.body, // Copia todas las propiedades de req.body a newProject
            owner: req.user.id,
            thumbnail: req.file ? req.file.filename : null,
        })

        // Guardar el proyecto en la base de datos
        await newProject.save();

        // Obtener el ID del proyecto recién creado
        const projectId = newProject._id;

        // Buscar al usuario por su ID y actualizar su arreglo de proyectos
        await usersModel.findByIdAndUpdate(
            req.user.id,
            { $push: { projects: projectId } },
            { new: true }
        );

        res.status(201).json({ message: 'Proyecto creado exitosamente' });
    } catch (error) {
        if (req.file) {
            // Si hay un error y se subió una imagen, eliminar la imagen
            const filePath = path.join(__dirname, '../public/files/img', req.file.filename);
            fs.unlinkSync(filePath);
        }
        console.error('Error al guardar el proyecto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Updates
const updateProject = async (req, res) => {
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
};

// Deletes
const deleteProject = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        // Buscar el proyecto para obtener el ID del propietario
        const project = await projectsModel.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        const ownerId = project.owner;

        const imageName = project.thumbnail;
        // Eliminar el proyecto de la base de datos
        const deletedProject = await projectsModel.findByIdAndDelete(projectId);

        if (deletedProject) {
            if (imageName) {
                const imagePath = path.join(__dirname, '../public/files/img', imageName);
                fs.unlinkSync(imagePath);
            }
            // Eliminar el proyecto del arreglo de proyectos del propietario
            const user = await usersModel.findByIdAndUpdate(
                project.owner,
                { $pull: { projects: projectId } },
                { new: true }
            );

            if (!user || !user.projects.includes(projectId)) {
                // Manejar el caso en el que el proyecto no estaba en el arreglo de proyectos del usuario
                return res.status(404).json({ message: 'Proyecto no encontrado en el usuario' });
            }
            res.json({ message: 'Proyecto eliminado exitosamente' });
        } else {
            res.status(404).json({ message: 'Proyecto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const addReview = async (req, res) => {
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
}

export {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    addReview,
};