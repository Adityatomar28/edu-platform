import mongoose from "mongoose";

// new mongoose.Schema is a method which takes obj as a paramter
const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Course title is required'],
        trim:true,
        maxLength:[100,'Course title cannot exceed 100 character']
    },
    subtitle:{
        type:String,
        trim:true,
        maxLength:[200,'Course title cannot exceed 200 character']
    },
    description:{
        type:string,
        trim:true
    },
    category:{
        type:String,
        required:[true,'Course category is required'],
        trim: true,


    },
    level:{
        type:String,
        enum:{
            values:['beginner','intermediate','advanced'],
            message:'please select a valid course level'
        },
        default:'beginner'
    },
    price:{
    type: Number,
    required:[true,'Course price is required'],
    min:[0,'Course price must be a non-negative number']
    },
    thumbnail:{
        type:String,
        required:[true,'Course thumbnail is required']
    },
    //each student take multiple courses and courses also have list of student
    enrolledStudent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        } 
    ],
    lecture: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'lecture'
        }
    ],
    Instructor: 
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            //without user course should not be there
            required:[true,'Course instructor is required']

        },
        isPublished:{
            type:Boolean,
            default:false
        },
        totalDuration:{
            type:Number,
            default:0
        }



},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
}
);
courseSchema.virtual('averageRating').get(function(){
    return 0; //placeholder assignment create a field
    //you can add rating from a user and create another field add array of documets which can have mutiple field who is the user 
    //select all the assignment
})

//hooks
courseSchema.pre('save',function (next){
    if(this.lecture){
        this.totalLectures = this.lecture.length
    }
    next()
})

export const Course  = mongoose.model("Course",courseSchema);
