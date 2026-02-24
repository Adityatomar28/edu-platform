import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema({
    lectures:{
    type:mongoose.Schema.Types.ObjectId,
    //this needds to be corrected canot pass self ref
    ref:'Lecture',
    required:[true,'Lecture reference is required']
    },
    isCompleted:{
    type:Boolean,
    default:false
    },
    watchTime:{
    type:Number,
    default:0,
    },
    lastWatched:{
    type:Date,
    default:Date.now
    }
})

const courseProgressSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"User refrence is required"],
    },
    isCompleted:{
        type:Boolean,
        default:false
    },
    completionPercentage:{
        type:Number,
        default:0,
        min:0,
        max:100
    },
    //when you see this kind of array ->lot of docs going to be injected
    lectureProgress:[lectureProgressSchema],
    lastAccessed:{
        type:Date,
        default:Date.now

    }
},
{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
}
);
//calcaualte course completion
courseProgressSchema.pre('save',function(next){
    if(this.lectureProgress.length > 0){
        const completedLectures = this.lectureProgress.filter(lp => lp.isCompleted).length
        this.completionPercentage = Math.round((completedLectures/this.lectureProgress.length)*100)
        this.isCompleted = this.completionPercentage === 100
    }
    next()
})

//update last accessed
courseProgressSchema.methods.updateAccessed = function(){
    this.lastAccessed = Date.now()
    return this.save({ValidateBeforeSave:false})
}

export const courseProgress = mongoose

