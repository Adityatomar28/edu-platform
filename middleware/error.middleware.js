//makes easier to throw error
export class ApiError extends Error {
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail':'error'
        this.isOperational = true // optinal

        Error.captureStackTrace(this,this.constructor);
    }
}

//this is for so that i don't use try catch 
export const catchAsync = (fn) => {
    return (req,res,next)=>{
        fn(req,res,next).catch(next)
    }
}

//handle the jwt error

export const handleJWTError = () => {
    new ApiError('Invalid token.PLease log in again',401)
}