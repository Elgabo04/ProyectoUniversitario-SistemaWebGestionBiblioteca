import Prestamo from "../models/Prestamo.js";
import Usuario from "../models/Usuario.js";
import { Op } from "sequelize";

// Lista todos los prestamos
export const listarPrestamos = async (req, res) => {
	try {
		const prestamos = await Prestamo.findAll({ order: [["id", "DESC"]] });
		res.json(prestamos);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error interno del servidor" });
	}
}

// Crea un nuevo prestamo
export const crearPrestamo = async (req, res) => {
	try {
		const { usuario_id, libro_id, fecha_devolucion } = req.body;

		if (!usuario_id || !libro_id) {
			return res.status(400).json({ error: "Faltan datos obligatorios" });
		}

		const usuario = await Usuario.findByPk(usuario_id);
		if (!usuario) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		// Verificación simple de disponibilidad
		const prestamosActivos = await Prestamo.count({
			where: {
				libro_id,
				estado: { [Op.in]: ["prestado", "pendiente"] }
			}
		});

		if (prestamosActivos > 0) {
			return res.status(400).json({ error: "El libro no está disponible actualmente" });
		}

		const nuevo = await Prestamo.create({
			usuario_id,
			libro_id,
			fecha_prestamo: new Date(),
			fecha_devolucion: fecha_devolucion || null,
			estado: "prestado"
		});

		res.status(201).json(nuevo);

	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error creando el préstamo" });
	}
}

// Marcar devolución de un préstamo
export const devolverPrestamo = async (req, res) => {
	try {
		const { id } = req.params;
		const prestamo = await Prestamo.findByPk(id);

		if (!prestamo) {
			return res.status(404).json({ error: "Préstamo no encontrado" });
		}

		if (prestamo.estado === "devuelto") {
			return res.status(400).json({ error: "El préstamo ya está devuelto" });
		}

		prestamo.estado = "devuelto";
		prestamo.fecha_devolucion = prestamo.fecha_devolucion || new Date();
		await prestamo.save();

		res.json({ mensaje: "Préstamo marcado como devuelto", prestamo });

	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error al procesar la devolución" });
	}
}

// Listar préstamos por usuario
export const listarPrestamosPorUsuario = async (req, res) => {
	try {
		const { usuario_id } = req.params;
		const prestamos = await Prestamo.findAll({ where: { usuario_id }, order: [["id", "DESC"]] });
		res.json(prestamos);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error al listar préstamos por usuario" });
	}
}


