import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";
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
                    const save_user = await UserModel.findOne({email:email})
                    const token = jwt.sign({userID:save_user._id},process.env.JWT_SECRET_KEY,{expiresIn:'7d'})
                    res.status(201).send({"status":"success", "message":"Registeration completed", "token": token})
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
                        const token = jwt.sign({userID:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'7d'})
                        res.send({"status":"success", "message":"Successfully login", "token": token}) 
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

    static changeUserPassword = async(req,res)=>{
        const {password, password_conformation} = req.body
        if(password && password_conformation){
            if(password !== password_conformation){
                res.send({"status":"failed", "message" : "New password and confirm New password doesn't match"})
            }else{
                 const salt =await bcrypt.genSalt(10)
                    const hashpass = await bcrypt.hash(password,salt)
                    await UserModel.findByIdAndUpdate(req.user_id,{$set:{password:hashpass}})
                    res.send({"status":"success", "message" : "Password changed successfully"})
            }
        }else{
            res.send({"status":"failed", "message":"All fields are required"})
        }
    }

    static loggeduser = async(req,res) => {
        res.send({"user":req.user})

    }
    static sendUserPasswordResetEmail = async (req,res)=>{
        const { email } = req.body
        if(email){
            const user =  await UserModel.findOne({email:email})
            if(user){
                const secret = user._id + process.env.JWT_SECRET_KEY
                const token = jwt.sign({userID:user._id}, secret,{
                    expiresIn:'30m'
                })
                const link =   `http://127.0.0.1.3000/api/user/reset/${user._id}/${token}`
               // console.log(link)
                res.send({"status":"success", "message" : "Password Reset Email Sent ... CHeck your Email"})
            }else{
                res.send({"status":"failed", "message" : "Email is required"})

            }
        }else{
            res.send({"status":"failed", "message" : "Email is required"})
        }
    }
}

export default userController