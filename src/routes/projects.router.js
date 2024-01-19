import express from 'express';
import { validarJWT } from '../utils/jwt.utils.js';
import multer from 'multer';
import path from 'path';
import __dirname from '../utils/utils.js';
import fs from 'fs'
import { addReview, createProject, deleteProject, getProject, getProjects, updateProject } from '../controllers/projects.controller.js';
//-------------------------------------------------------------------------------------

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define la carpeta donde se guardarán las imágenes
    const uploadDir = path.join(__dirname, '../public/files/img');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Genera un nombre de archivo único con el id del usuario
    const userId = req.user.id; // Asegúrate de enviar el id del usuario desde el cliente
    const fileName = `${userId}_${file.originalname}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

router.get('/', getProjects);
router.get('/:projectId', getProject);
router.post('/', validarJWT, upload.single('thumbnail'), createProject);
router.put('/:projectId', updateProject);
router.post('/:projectId/reviews', addReview);
router.delete('/:projectId', deleteProject);

export default router;