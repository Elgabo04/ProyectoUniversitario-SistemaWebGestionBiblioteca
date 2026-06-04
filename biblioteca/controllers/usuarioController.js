import Usuario from "../models/Usuario.js";


export const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios)
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}



export const crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password, //se debe hashear con la funcion que sandra haga
            rol: "admin"
        });
        const usuarioSinPassword = nuevoUsuario.toJSON();
        delete usuarioSinPassword.password;
        res.status(201).json(usuarioSinPassword);
    } catch (error) {
        console.error("ERROR REAL DE SEQUELIZE:", error); 
        res.status(500).json({ error: "Error al crear usuario" });
    }
}

export const actualizarUsuario = async (req,res) => {
    try{
        const { id } = req.params;
        const { nombre, email, rol } = req.body;
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        await usuario.update({
            nombre,
            email,
            rol
        });

        res.json({ mensaje: "Usuario actualizado exitosamente" });

    }catch (error_gosu){
        res.status(500).json({ error: "Error al actualizar usuario" });
    }
}

export const parcharUsuario = async (req,res) => {
    try{
        const { id } = req.params;
        const datos_gosus = req.body;
        delete datos_gosus.password; //evitar que se parchee el password


        const usuario = await Usuario.findByPk(id); 

        if(!usuario){
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        await usuario.update(datos_gosus);
        res.json({ mensaje: "Usuario parchado correctamente" });

    }catch(error_gosu){
        res.status(500).json({ error: "Error al parchar usuario" });
    }
}


export const eliminarUsuario = async (req,res) => {
    try{
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        if(!usuario){
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        await usuario.destroy();
        res.json({ mensaje: "Usuario destruido correctamente" });
    }catch(error_gosu){
        res.status(500).json({ error: "Error al destruir usuario" });
    }
}