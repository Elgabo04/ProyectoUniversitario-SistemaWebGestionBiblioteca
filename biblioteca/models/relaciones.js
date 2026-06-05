import Usuario from "./Usuario.js";
import Libro from "./Libro.js";
import Prestamo from "./Prestamo.js";

// Relación Usuario <-> Prestamo (Con borrado en cascada)
Usuario.hasMany(Prestamo, { 
    foreignKey: "usuario_id", 
    onDelete: "CASCADE" 
});
Prestamo.belongsTo(Usuario, { 
    foreignKey: "usuario_id" 
});

// Relación Libro <-> Prestamo
Libro.hasMany(Prestamo, { 
    foreignKey: "libro_id" 
});
Prestamo.belongsTo(Libro, { 
    foreignKey: "libro_id" 
});

export { Usuario, Libro, Prestamo };