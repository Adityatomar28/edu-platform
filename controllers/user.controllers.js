//i want to create a method that will create a user account
import {User} from "../models/user.model.js";
import { ApiError, catchAsync } from "../middleware/error.middleware";
import { generateToken } from "../utils/generateToken.js";

export const createUserAccount = catchAsync(async(req,res) => {
    const {name,email,password,role = 'student'} = req.body

    //we will do validations globally
    //
    const existingUser = await User.findOne({email:email.toLowerCase()})

    if(existingUser){
        throw new ApiError('User already exist',400);
    }
    const user = await User.create({
        name,
        email:email.toLowerCase(),
        password,
        role

    })
    await user.updateLastActive();
    generateToken(res,user,'Account created Successfully')
});

export const authenticateUser = catchAsync(async(req,res) => {
    const {email,password} = req.body

    const user = User.findOne({email:email.toLowerCase()}).select('+password')

    if(!user || (await user.comparePassword(password))){
        throw new ApiError("Invalid email or password",401);
    }
    await user.updateLastActive()
    generateToken(res,user,`Welcome back ${user.name}`);
});


export const signOutUser = catchAsync(async,(_,res) => {
    res.cookie('token','',{maxAge:0})
    res.status(200).json({
        success:true,
        message:"Singed out successfully",
    });
});
//want to create a middleware 
export const getCurrentUserProfile = catchAsync(async(async(req,res) => {
    const user = User.findById(req.id)
      .populate({
        path: " enrolledCourses.course",
        select: 'title thumbnail description'
      });
      if(!user){
        throw new ApiError("User not found",404);
      }
      res.status(200).json({
        success:true,
        data:{
            ...user.tojson(),
            totalEnrolledCourses : user.totalEnrolledCourses,

        },
      });
}));




export const test = catchAsync(async(async(req,res) => {}));

