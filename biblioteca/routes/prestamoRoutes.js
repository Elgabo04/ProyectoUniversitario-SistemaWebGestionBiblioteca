import { Router } from "express";
import {
	listarPrestamos,
	crearPrestamo,
	devolverPrestamo,
	listarPrestamosPorUsuario
} from "../controllers/prestamoController.js";

const rutasPrestamo = Router();

// Obtener todos los préstamos
rutasPrestamo.get("/get-prestamos", async (req, res) => {
	await listarPrestamos(req, res);
});

// Crear préstamo
rutasPrestamo.post("/create", async (req, res) => {
	await crearPrestamo(req, res);
});

// Marcar devolución
rutasPrestamo.post("/devolver/:id", async (req, res) => {
	await devolverPrestamo(req, res);
});

// Listar por usuario (opcional)
rutasPrestamo.get("/user/:usuario_id", async (req, res) => {
	await listarPrestamosPorUsuario(req, res);
});

export default rutasPrestamo;
