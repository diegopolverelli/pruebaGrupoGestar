import mongoose from "mongoose";

export const usersModel=mongoose.model(
    "users",
    new mongoose.Schema(
        {
            codigo: String, 
            nombre: String,
            email: {type:String, unique: true},
            password: String
        },
        {
            timestamps:true
        }
    )
)