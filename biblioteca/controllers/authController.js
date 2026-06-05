import jwt from 'jsonwebtoken'; // Importamos jsonwebtoken para manejar la generación de tokens JWT
import Usuario from '../models/Usuario.js';
// Importamos las funciones de hashing de contraseñas
import { hashPassword, comparePassword } from '../utils/hashPassword.js';
import dotenv from 'dotenv';

dotenv.config();

// ==================== REGISTRO ====================
export const register = async (req, res) => {// Función para registrar un nuevo usuario
    try {
        const { nombre, email, password, rol } = req.body;

        // Verificar si el usuario ya existe
        const existeUsuario = await Usuario.findOne({ where: { email } });
        if (existeUsuario) {
            return res.status(400).json({ mensaje: 'El email ya está registrado' });
        }

        // Hashear contraseña con bcrypt
        const hashedPassword = await hashPassword(password);

        // Crear usuario
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password: hashedPassword,
            rol: rol || 'usuario'
        });

        // Responder sin enviar la contraseña
        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};

// ==================== LOGIN ====================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario por email
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // Verificar contraseña con bcrypt
        const passwordValido = await comparePassword(password, usuario.password);
        if (!passwordValido) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }
        //crear el payload para el token JWT
        // El payload es la información que queremos incluir en el token JWT
        // En este caso, estamos incluyendo el ID del usuario, su email, rol y nombre
        // Esta información puede ser útil para identificar al usuario y controlar el 
        // acceso a ciertas rutas o funcionalidades en el frontend.
                const payload = {
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol,
            nombre: usuario.nombre
        };

        // Firmar el token
        //una vez vencido el token, el usuario tendrá que iniciar sesión 
        // nuevamente para obtener un nuevo token válido.
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Responder con token y datos del usuario
        res.json({
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};