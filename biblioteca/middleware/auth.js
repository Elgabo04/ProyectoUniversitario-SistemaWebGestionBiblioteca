import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Verificar que el token sea válido
export const verificarToken = (req, res, next) => {
    // Obtener token del header Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;  // Adjuntar usuario a la request
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
};