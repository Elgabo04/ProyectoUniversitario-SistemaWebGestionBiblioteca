import bcrypt from "bcrypt";// Importamos bcrypt para el hashing de contraseñas

export const hashPassword = async (password) =>{// Función para hashear la contraseña
    const hash = await bcrypt.hash(password,10);// El número 10 es el costo del hashing
    // el 10 significa que se realizarán 10 rondas de hashing, lo que hace que el proceso sea más seguro pero también más lento
    // Puedes ajustar este valor según tus necesidades de seguridad y rendimiento.
    //puedes ajustarlo según tus necesidades
    return hash;// Retorna la contraseña hasheada
};

export const comparePassword = async (password, hashedPassword)=>{
    // Función para comparar la contraseña ingresada con la contraseña hasheada almacenada
    const valid = await bcrypt.compare(password, hashedPassword); 
    // Retorna true si las contraseñas coinciden, false en caso contrario

    return valid;
};