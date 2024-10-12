import express from "express"
import swaggerJsondoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import { usersModel } from "./models/usersMolde.js"
import { generaHash, generarID } from "./utils.js"
import { conectarDB } from "./connDB.js"
const PORT=3000
const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const options={
    definition:{
        openapi: "3.0.0",
        info: {
            title: "Ejemplo documentación API",
            version:"1.0.0",
            description:"Ejemplo documentación API"
        }
    },
    apis: ["./src/docs/*.yaml"]
}

const specs=swaggerJsondoc(options)

app.use("/documentacion", swaggerUi.serve, swaggerUi.setup(specs))

app.get("/", (req, res)=>{
    res.send("Home Page")
})

// let usuarios=[
//     {id:1, nombre:"Luciana", email:"luciana@test.com", password:"123", rol:"user"},
//     {id:2, nombre:"Juan", email:"juan@test.com", password:"123", rol:"user"},
//     {id:3, nombre:"Romina", email:"romina@test.com", password:"123", rol:"admin"},
// ]

let contador=0
app.get("/mail", (req, res)=>{
    contador++
    let email=`juan${contador}@test.com`

    res.send({email})
})

app.get("/users", async(req, res)=>{
    try {
        let usuarios=await usersModel.find().lean()
        console.log(`Ejecutando ruta /users`)
        res.send(usuarios)
        
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`Error...`})
    }
})

app.get("/users/:id", async(req, res)=>{

    let {id}=req.params

    try {
        let usuarios=await usersModel.find().lean()
        let usuario=usuarios.find(u=>u.codigo===id)
        if(!usuario){
            res.setHeader('Content-Type','application/json');
            return res.status(404).json({error:`User not found - id: ${id}`})
        }
    
        res.send(usuario)
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`Error...`})
    }
})

app.post("/users", async(req, res)=>{
    let {nombre, email, password}=req.body
    if(!nombre || !email || !password){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Complete nombre | email | password`})
    }
    console.log(`Creando usuario ${email}`)

    // let id=1
    // if(usuarios.length>0){
    //     id=usuarios[usuarios.length-1].id +1
    // }
    let codigo=generarID()
    password=generaHash(password)

    let nuevoUsuario={codigo, nombre, email, password}
    // usuarios.push(nuevoUsuario)
    try {
        nuevoUsuario=await usersModel.create(nuevoUsuario)
        // nuevoUsuario={...nuevoUsuario, _id:"88888888"}
        res.status(201).send(nuevoUsuario)
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`Error...`})
    }
})


app.listen(PORT, ()=>{
    console.log(`Server up in port ${PORT}`)
})

conectarDB("mongodb+srv://fullstackgrupogestar:fullstackgrupogestar@cluster0.x5lje.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", "pruebaTesting")