import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto, { createDecipheriv } from "crypto";



const UserSchema = new mongoose.Schema({
    //here u see objects 
    name:{
    type:String,
    required:[true,'Name is required'],
    trim:true,
    MaxLength:[50,'Name cannot exceed 50 character']
    },
    email:{
    type:String,
    required:[true,'Email is required'],
    trim:true,
    unique:true,
    lower:true,
    //Regexr
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please provide a valid email"],
    },
    Password:{
    type:String,
    required:[true,'password is required'],
    MinLength:[8,'Password must be at least 8 character'],
    select:false
    },
    role:{
        type:String,
        //it is like option that we are booking seat in bus we have options of selecting side,upper,middle
        enum:{
            values:['student','instructor','admin'],
            message:'Please select a valid role'
        },
        default:'student'

    },
    avatar:{
        type:String,
        default:'default-avatar.png'
    },
    bio:{
        type:String,
        maxLength:[200,'Bio cannot exceed 200 character']
    },
    enrolledCourses:[{
        //what course you are enrolled in refer one of the course
        course:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Course'
        },
        enrolledCourses:{
            type:Date,
            default:Date.now
        }
    }],
    createdCourses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Courses'
    }],
    resetPasswordToken:String,
    resetPasswordExpiry:Date,
    lastActive:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}

});
//hashing the Password
//use async because when you hash your password it goes to multiple round of cryptography takes little time 
//use function not arrow function beacuse they need to know the context
UserSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }
    //next is a hook which is a middleware
    this.password = await bcrypt.hash(this.Password,12)
    next();
});
//compare password when user log in it check from hashed password 
UserSchema.methods.comparePassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword,this.password)
}
UserSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex')
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')
        this.resetPasswordExpiry = Date.now() + 10*60*1000 //10min
        return resetToken

        // one token is sent to te database and one token is sent to user 
}
//Virtuals ->calacualative filed suppose i want to find how mnay course you are enrolled in ?
// UserSchema.methods.updateLastActive = function(){
    this.lastActive = Date.now()
    return this.lastActive({validateBeforeSave:false});

UserSchema.virtual('totalEnrolledCourses').get(function(){
    this.enrolledCourses.length
})


//in this User is a standard way to call user and in database all got converted in lowercase
export const User = mongoose.model('User',UserSchema)
