import express from "express";
import sequelize from "./config/database.js";


//rutas
import rutasUsuario from "./routes/usuarioRoutes.js";
import rutasAuth from "./routes/authRoutes.js";
import rutasLibro from "./routes/libroRoutes.js";
import prestamoRoutes from "./routes/prestamoRoutes.js";


const aplicacion = express();


//middlewares
aplicacion.use(express.json());

//servir frontend
aplicacion.use(express.static("public"));

//rutas
aplicacion.use("/api/usuarios", rutasUsuario);
aplicacion.use("/api/auth", rutasAuth);
aplicacion.use("/api/libros", rutasLibro);
aplicacion.use("/api/prestamos", prestamoRoutes);

const PORT = process.env.PORT || 3000; //el puerto por defecto es 3000, pero se puede configurar con la variable de entorno PORT


try{
    await sequelize.authenticate(); // authenticate es un método de Sequelize que verifica la conexión a la base de datos
    console.log("Conexión con MySQL exitosa"); 
    await sequelize.sync(); //sync es un método de Sequelize que sincroniza los modelos con la base de datos, creando las tablas si no existen

    aplicacion.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });

} catch(fallagosu) {
    console.error("Error al iniciar el servidor:", fallagosu);
    process.exit(1); //salir con código de error
}
