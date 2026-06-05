import {Router} from "express";
import { 
    crearUsuario, 
    listarUsuarios, 
    actualizarUsuario, 
    parcharUsuario, 
    eliminarUsuario 
} from "../controllers/usuarioController.js";

import { verificarToken } from "../middleware/auth.js"; // 
import { esAdmin } from "../middleware/role.js";

const rutasUsuario = Router();


//CRUD USUARIOS




//Crear usuarios administradores
rutasUsuario.post("/auth/add-admin",verificarToken, esAdmin, async (req, res)=> {
    await crearUsuario(req, res);
})

//Obtener todos los usuarios usuarios
rutasUsuario.get("/get-users", verificarToken, esAdmin, async (req, res) =>{
    await listarUsuarios(req, res);
});

//Actualizar todo un usuario xd
rutasUsuario.put("/update-user/:id", verificarToken, esAdmin, async (req, res) => {
    await actualizarUsuario(req, res);
});

//Parchar un usuario
rutasUsuario.patch("/patch-user/:id", verificarToken, esAdmin, async (req, res) => {
    await parcharUsuario(req, res);
});

//Eliminar un usuario
rutasUsuario.delete("/delete-user/:id", verificarToken, esAdmin, async (req, res) => {
    await eliminarUsuario(req, res);
});

export default rutasUsuario;