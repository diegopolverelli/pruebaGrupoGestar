import supertest from "supertest"
import {expect} from "chai"
import {afterEach, describe, it} from "mocha"
import mongoose from "mongoose"

try {
    await mongoose.connect(
        "mongodb+srv://fullstackgrupogestar:fullstackgrupogestar@cluster0.x5lje.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", 
        {
            dbName:"pruebaTesting"
        }
    )
    console.log(`DB Online`)
} catch (error) {
    console.log(`Error al conectar a DB`)
}

const requester=supertest("http://localhost:3000")

describe("Pruebas al router /users", ()=>{

    afterEach(async()=>{
        await mongoose.connection.collection("users").deleteMany({email:"marta@testing.com"})
    })

    it("Si hago una peticion GET a /users, retorna un array con usuarios", async()=>{
        let {body, status, headers}=await requester.get("/users")
        // let resultado=await requester.get("/users")
        // console.log(resultado)

        expect(Array.isArray(body)).to.be.true
        if(body.length>0){
            expect(body[0]).to.have.property("_id")
            expect(body[0]).to.have.property("nombre")
        }
    })

    it("Si genero un post con un usuario valido en el body, lo da de alta en DB", async()=>{
        let user={
            nombre:"Marta", email:"marta@testing.com", password:"123"
        }
        let {body, status}=await requester.post("/users").send(user)

        let resultado=await mongoose.connection.collection("users").findOne({email:"marta@testing.com"})
        

        expect(status).to.be.eq(201)
        expect(body._id).to.exist
        expect(body).to.has.property("_id")
        expect(body).to.has.property("codigo")
        expect(body).to.has.property("nombre")
        expect(body.nombre).to.be.eq(user.nombre)
        expect(body.email).to.be.eq(user.email)
        expect(body.password).not.to.be.eq(user.password)
        // console.log(resultado)
        expect(resultado._id).exist
        expect(resultado).to.has.property("_id")
    })

    it("Al realizar un post, hashea la password con bcrypt",async()=>{
        let user={
            nombre:"Marta", email:"marta@testing.com", password:"123"
        }
        let {body, status}=await requester.post("/users").send(user)

        expect(body.password).not.to.be.eq(user.password)
        expect(body.password.slice(0,4)).to.be.eq("$2b$")
    })
})