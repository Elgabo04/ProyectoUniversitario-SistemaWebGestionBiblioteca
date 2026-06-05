import { Router } from "express";
import {
	listarPrestamos,
	crearPrestamo,
	devolverPrestamo,
	listarPrestamosPorUsuario
} from "../controllers/prestamoController.js";

import { verificarToken } from "../middleware/auth.js";
import { esAdmin } from "../middleware/role.js";

const rutasPrestamo = Router();

// Obtener todos los préstamos (solo admin)
rutasPrestamo.get("/get-prestamos", verificarToken, esAdmin, async (req, res) => {
	await listarPrestamos(req, res);
});

// Crear préstamo (usuario autenticado)
rutasPrestamo.post("/create", verificarToken, async (req, res) => {
	await crearPrestamo(req, res);
});

// Marcar devolución (solo admin)
rutasPrestamo.post("/devolver/:id", verificarToken, esAdmin, async (req, res) => {
	await devolverPrestamo(req, res);
});

// Listar por usuario (usuario autenticado)
rutasPrestamo.get("/user/:usuario_id", verificarToken, async (req, res) => {
	await listarPrestamosPorUsuario(req, res);
});

export default rutasPrestamo;
