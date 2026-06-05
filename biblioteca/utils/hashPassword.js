import bcrypt from "bcrypt";

export const hashPassword = async (password) =>{
    const hash = await bcrypt.hash(password,10);
    return hash;
};

export const comparePassword = async (password, hashedPassword)=>{
    const valid = await bcrypt.compare(password, hashPassword);
    return valid;
};