import { response } from "express";
import jwt from "jsonwebtoken";

//i can pass to the login signup
export const generateToken = (res,user,message)=>{
    //create a token
    //this user is from mongoose
    const token = jwt.sign({userId:user._id},process.env.SECRET_KEY,{
        expiresIn:"1d"
    }); 
    return res
    .status(200)
    .cookie("token",token,{
        httpOnly:true,
        samSite:"strict",
        maxAge:24*60*60*1000 //1 day
    }).json({
        success:true,
        message,
        user,
        token,
    })
}