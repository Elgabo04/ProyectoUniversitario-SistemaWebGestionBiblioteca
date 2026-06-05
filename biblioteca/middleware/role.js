
export const esAdmin = (req, res, next) => {
    // Si el middleware JWT no encontró un token válido
    if (!req.usuario) {
        return res.status(401).json({ error: "Acceso denegado. No autenticado." });
    }

    // Validar el rol guardado en el token de la sesión
    if (req.usuario.rol !== "admin") {
        return res.status(403).json({ error: "Acceso denegado. Se requiere rol de Administrador." });
    }

    next(); // Si es admin, permite continuar al controlador
};