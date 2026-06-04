
import { Sequelize } from "sequelize";

const sequelize = new Sequelize("biblioteca-desarrollo-app-web-pa1c2", "root", "", {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    logging: false
});

try {
    await sequelize.authenticate();
    console.log("Conexión con MySQL exitosa");
} catch (error) {
    console.error("Error de conexión:", error);
}

export default sequelize;