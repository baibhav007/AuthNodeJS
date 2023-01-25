import jwt from 'jsonwebtoken';
import UserModel from '../models/user.js';

var checkUserAuth = async(req,res,next)=>{
    let token
    const {authorization}=req.headers
    if(authorization && authorization.startsWith('Bearer')){
        try{
            token = authorization.split(' ')[1]
           //console.log("Token", token)
           // console.log("Authorization", authorization)
            const {userID} = jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.user = await UserModel.findById(userID).select(-'password')
        next()
        }catch(error){
            console.log(error);
            res.status(401).send({"status": "failed", "message":"Unauthorized user"})
        
        } 
    }if(!token){
        res.status(401).send({"status": "failed", "message":"Unauthorized user, No token"})
    }
}

export default checkUserAuth