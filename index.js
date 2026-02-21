import express from 'express'
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from "dotenv"
import mongoose from 'mongoose';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from "cors";
import cookieParser from 'cookie-parser';
dotenv.config();
console.log(process.env.PORT);


//step 1 create app from the express so that the all the functionality can be transfer to this app
const app = express();
const PORT = process.env.PORT

//Global rate limiting Security
const limiter = rateLimit({
    windowMs:15*60*1000, //15minutes
    limit:100, //limit each IP to 100 request per window
    message:"Too many request from this IP,please try later",
});
//security middleware
app.use(helmet());
app.use("/api",limiter);
app.use(hpp());





// logging middleware
if(process.env.NODE_ENV === "development"){
   app.use(morgan('dev'))
}

//Body Parser middleware
app.use(express.json({limit:'10kb'}))
app.use(express.urlencoded({extended:true,limit:"10kb"}))
app.use(cookieParser())



//Global Error Handler
// is there is error due to env variable,express,mongoose in that case u can work with this 
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

//CORS Configuration
app.use(cors({
    origin:process.env.CLIENT_URL || "http://localhost:5173",
    credentials:true,
    methods:["GET","POST","PUT","DELETE","PATCH","HEAD","OPTIONS"],
    allowedHeaders:[
        "content-Type",
        "Authorization",
        "X-Requested-With",
        "device-remember-token",
        "Access-Control-Allow-Origin",
        "Origin",
        "Accept",

    ],
}))


//Api Routes





//It should be always at bottom
//404 handler
app.use((req,res) => {
    res.status(404).json({
        status:"error",
        message:"Route not found !!",
    });
});


//next step use this express app to listen on some port
app.listen(PORT,() =>{
    console.log(`Server is running at ${PORT} in ${process.env.NODE_ENV} mode`)
})

