
import { Sequelize } from "sequelize";

const sequelize = new Sequelize("biblioteca-desarrollo-app-web-pa1c2", "root", "", {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    logging: false
});


export default sequelize;