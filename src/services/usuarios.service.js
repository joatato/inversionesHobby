import { MemoryDAO } from "../DAO/memoryDao.js";


const dao=new MemoryDAO();

class UsuariosService{
    constructor(dao){
        this.dao=dao;
        this.coleccion='usuarios'
    }

    async getUsuarios(){
        return await this.dao.get(this.coleccion)
    }

    async grabaUsuario(usuario){
        return await this.dao.post(this.coleccion, usuario)
    }

}

export const usuariosService=new UsuariosService(dao)
