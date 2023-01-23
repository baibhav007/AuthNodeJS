import UserModel from "../models/user.js";
//import { Jwt } from "jsonwebtoken";
import bcrypt from 'bcrypt';

class userController {
    static userRegistration = async(req,res)=>{
        const {name,email,password, password_conformation}=req.body
        const user = await UserModel.findOne({email:email})
        if(user){
            res.send({"status":"failed", "message":"Email already exists"})
        }else{
            if(name && email && password && password_conformation){
                if(password === password_conformation){
                   try{
                    const salt =await bcrypt.genSalt(10)
                    const hashpass = await bcrypt.hash(password,salt)
                    const  new_user = new UserModel({
                        name:name,
                        email:email,
                        password:hashpass
                    })
                    await new_user.save() 
                    res.status(201).send({"status":"success", "message":"Registeration completed"})
                   } catch(error){
                    console.log(error)
                    res.send({"status":"failed", "message":"Unable to Register"})
                   }
                    
                }else{
                    res.send({"status": "failed", "message":"Password and confirm passowrd doesn't match"})
                }
            }else{
                res.send({"status":"failed", "message":"All fields are required"})
            }
        }
    }

    static userLogin = async (req,res)=>{
        try{
            const {email,password}= req.body
            if(email && password){
                const user = await UserModel.findOne({email:email})
                if(user != null){
                    const isMatch = await bcrypt.compare(password, user.password)
                    if((user.email === email)&& isMatch){
                        res.send({"status":"success", "message":"Successfully login"}) 
                    }else{
                        res.send({"status":"failed", "message":"Email or Password doesn't mathces"}) 
                    }
                }else{
                    res.send({"status":"failed", "message":"Not a valid user"})
                }
            }else{
                res.send({"status":"failed", "message":"All fields are required"})
            }

        }
        catch (error) {
            console.log(error)
            res.send({"status":"failed", "message":"Unable to login"})
        }
    }
}

export default userController