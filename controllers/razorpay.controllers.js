import Razorpay from "razorpay";

import crypto from "crypto"
import {Course} from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { courseProgress } from "../models/courseProgress.js";
import { ApiError } from "../middleware/error.middleware";


const razorpay = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async(req,res) =>{
    try {
        //user logged in hai ki nhi ise pta pd jayega 
        const userId = req.id
        // somebody is buying should have ample amount of information
        const {courseId} = req.body

        const course = await Course.findById(courseId)
        if(!course) return res.status(404).json({message:"Course not found"})

            const newPurchase = new CoursePurchase({
                course: courseId,
                userId: userId,
                amount:course.price,
                status:"pending"
            });
            const options = {
                amount:course.price*100, //amount in paise
                currency:"INR",
                receipt: `course_${courseId}`,
                notes:{
                    courseId:courseId,
                    userId:userId
                }
            };
            const order = await razorpay.orders.create(options)

            newPurchase.paymentId = order.id
            await newPurchase.save()

            res.status(200).json({
                success:true,
                order,
                course:{
                    name:course.title,
                    description:course.description,
                }
            })
        
    } catch (error) {
        throw new ApiError("payment failed")
    }

}

export const VerifyPayments = async(req,res) =>{
    try {
        const{razorpay_order_id,razorpay_payment_id,razorpay_signature}
         = req.body;
         const body = razorpay_order_id + " " + razorpay_payment_id;
         const expectedSingature = crypto
         .createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
         .update(body.toString())
         .digest('hex')

         const isAuthentic = expectedSingature === razorpay_signature;

    } catch (error) {
        throw new ApiError("not verified")
    }
}