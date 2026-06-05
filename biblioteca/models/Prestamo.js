import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Prestamo = sequelize.define("Prestamo", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	usuario_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},

	
	
	codigo: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},



	libro_id: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	fecha_prestamo: {
		type: DataTypes.DATE,
		allowNull: false
	},
	fecha_devolucion: {
		type: DataTypes.DATE,
		allowNull: true
	},
	estado: {
		type: DataTypes.ENUM("pendiente", "prestado", "devuelto"),
		allowNull: false,
		defaultValue: "pendiente"
	}
}, {
	timestamps: false
});

export default Prestamo;

