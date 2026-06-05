import Libro from '../models/Libro.js'; // Nota el .js al final
import { Op } from 'sequelize';

export const getAllLibros = async (req, res) => {
    try {
        const { titulo } = req.query;
        let condition = titulo ? { titulo: { [Op.like]: `%${titulo}%` } } : null;
        const libros = await Libro.findAll({ where: condition });
        res.json(libros);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener libros' });
    }
};

export const createLibro = async (req, res) => {
    try {
        const nuevoLibro = await Libro.create(req.body);
        res.status(201).json(nuevoLibro);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear libro' });
    }
};

export const updateLibro = async (req, res) => {
    try {
        const [updated] = await Libro.update(req.body, { where: { id: req.params.id } });
        if (updated) res.json({ message: 'Libro actualizado' });
        else res.status(404).json({ error: 'Libro no encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar libro' });
    }
};

export const deleteLibro = async (req, res) => {
    try {
        const deleted = await Libro.destroy({ where: { id: req.params.id } });
        if (deleted) res.json({ message: 'Libro eliminado' });
        else res.status(404).json({ error: 'Libro no encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar libro' });
    }
};