import crypto from "crypto";
import Prestamo from "../models/Prestamo.js";
import Usuario from "../models/Usuario.js";
import Libro from "../models/Libro.js";
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

// Crea un nuevo prestamo (estado: pendiente de aprobación)
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

		const libro = await Libro.findByPk(libro_id);
		if (!libro) {
			return res.status(404).json({ error: "Libro no encontrado" });
		}

		// Verificación de stock disponible
		if (libro.cantidad <= 0) {
			return res.status(400).json({ error: "El libro no tiene copias disponibles" });
		}

		// Verificación de préstamos activos del usuario para este libro
		const prestamosActivos = await Prestamo.count({
			where: {
				usuario_id,
				libro_id,
				estado: { [Op.in]: ["prestado"] }
			}
		});

		if (prestamosActivos > 0) {
			return res.status(400).json({ error: "Ya tienes un préstamo activo de este libro" });
		}

		const codigo = crypto.randomBytes(4).toString("hex").toUpperCase();

		const nuevo = await Prestamo.create({
			usuario_id,
			libro_id,
			codigo,
			fecha_prestamo: new Date(),
			fecha_devolucion: fecha_devolucion || null,
			estado: "pendiente"
		});

		res.status(201).json(nuevo);

	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error creando el préstamo" });
	}
}

// Aprueba un préstamo (cambia de pendiente a prestado y decrementa stock)
export const aprobarPrestamo = async (req, res) => {
	try {
		const { id } = req.params;
		const prestamo = await Prestamo.findByPk(id);

		if (!prestamo) {
			return res.status(404).json({ error: "Préstamo no encontrado" });
		}

		if (prestamo.estado !== "pendiente") {
			return res.status(400).json({ error: "Solo se pueden aprobar préstamos pendientes" });
		}

		const libro = await Libro.findByPk(prestamo.libro_id);
		if (!libro) {
			return res.status(404).json({ error: "Libro no encontrado" });
		}

		// Verificar que aún hay stock disponible
		if (libro.cantidad <= 0) {
			return res.status(400).json({ error: "El libro no tiene copias disponibles" });
		}

		// Cambiar estado a prestado y decrementar stock
		prestamo.estado = "prestado";
		await prestamo.save();

		libro.cantidad -= 1;
		await libro.save();

		res.json({ 
			mensaje: "Préstamo aprobado exitosamente", 
			prestamo,
			stockRestante: libro.cantidad
		});

	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error al aprobar el préstamo" });
	}
}

// Marcar devolución de un préstamo (incrementa stock)
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

		if (prestamo.estado !== "prestado") {
			return res.status(400).json({ error: "Solo se pueden devolver préstamos activos" });
		}

		const libro = await Libro.findByPk(prestamo.libro_id);
		if (!libro) {
			return res.status(404).json({ error: "Libro no encontrado" });
		}

		// Cambiar estado a devuelto e incrementar stock
		prestamo.estado = "devuelto";
		prestamo.fecha_devolucion = prestamo.fecha_devolucion || new Date();
		await prestamo.save();

		libro.cantidad += 1;
		await libro.save();

		res.json({ 
			mensaje: "Devolución registrada exitosamente", 
			prestamo,
			stockActual: libro.cantidad
		});

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


