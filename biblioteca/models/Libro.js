import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Asegúrate de incluir el .js

const Libro = sequelize.define('Libro', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING, allowNull: false },
  autor: { type: DataTypes.STRING, allowNull: false },
  categoria: { type: DataTypes.STRING, allowNull: true },
  cantidad: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'libros', timestamps: false });

export default Libro;