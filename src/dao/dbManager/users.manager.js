import { userModel } from "../models/users.js"

export default class Users {
    constructor() {
        console.log(`Working users with Database persistence in mongodb`)
    }
    getAll = async () => {
        let users = await userModel.find();
        return users.map(user=>user.toObject())
    }
    save = async (user) => {
        let result = await userModel.create(user);
        return result;
    }
    getBy = async(params) =>{
        let result = await userModel.findOne(params);
        return result;
    }
    update = async(id,user) =>{
        delete user._id;
        let result = await userModel.updateOne({_id:id},{$set:user})
        return result;
    }
    delete=async(id)=>{
        
    }
}