const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libroController');

// Definimos las rutas del CRUD
router.get('/', libroController.getAllLibros);       // GET /libros
router.post('/', libroController.createLibro);       // POST /libros
router.put('/:id', libroController.updateLibro);     // PUT /libros/:id
router.delete('/:id', libroController.deleteLibro);  // DELETE /libros/:id

module.exports = router;