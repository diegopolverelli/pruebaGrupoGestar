import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt"
export const generarID=()=>{
    return uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
}

export const generaHash=password=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))