import express from 'express'
import { Router } from 'express'

import controller from '../controllers/prueba.js';
const router = Router();

router.get('/', controller.index)

export default router

