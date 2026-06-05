import express from 'express';
import * as libroController from '../controllers/libroController.js';
import { verificarToken } from '../middleware/auth.js';
import { esAdmin } from '../middleware/role.js';

const router = express.Router();

// Definimos las rutas del CRUD
router.get('/', libroController.getAllLibros);           // Público - catálogo
router.post('/', verificarToken, esAdmin, libroController.createLibro);       // Solo admin
router.put('/:id', verificarToken, esAdmin, libroController.updateLibro);     // Solo admin
router.delete('/:id', verificarToken, esAdmin, libroController.deleteLibro);  // Solo admin

export default router;