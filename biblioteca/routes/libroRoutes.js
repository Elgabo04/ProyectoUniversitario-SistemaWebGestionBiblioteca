import express from 'express';
import * as libroController from '../controllers/libroController.js';

const router = express.Router();

// Definimos las rutas del CRUD
router.get('/', libroController.getAllLibros);
router.post('/', libroController.createLibro);
router.put('/:id', libroController.updateLibro);
router.delete('/:id', libroController.deleteLibro);

export default router;