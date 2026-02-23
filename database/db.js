import mongoose, { mongo } from "mongoose";

//How many it should try
const MAX_RETRIES = 3
const RETRY_INTERVAL = 5000;


class DatabaseConnection{
    
    //It prepares for basic stuff
    constructor(){
        this.retryCount = 0
        this.isConnected = false
         
        //configure mongoose setting 
        // strictQuery ensures that query filters only use fields defined in the schema. Unknown fields are ignored before the query is sent to MongoDB. It helps prevent accidental bugs and adds safety when filtering using user input.
        mongoose.set("strictQuery",true);

        mongoose.connection.on('connected',()=>{
            console.log("MongoDB CONNECTED successfully")
            this.isConnected = true;
        });
         mongoose.connection.on('error',()=>{
            console.log("MongoDB Connection error")
            this.isConnected = false;
        });
         mongoose.connection.on('disconnected',()=>{
            console.log("MongoDB Disconnected")
            this.isConnected = false;
            this.handleDisConnection()
        });
        //this is the constructor and you are calling method outside the constructor it has no idea which method is called that's why context should be passed 
        process.on('SIGTERM',this.handleAppTermination.bind(this))

    }
    //CONNECTION
    async connect() {
        try{
        if(!process.env.MONGO_URI){
            throw new Error("Mongo db URI is not defined in env variable");
        }
        const connectionOptions ={
            UserNewUrlParser:true,
            useUnifiedTopology:true,
            maxPoolSize:10,
            serverSelectionTimeoutMS:5000,
            // Prevent dead TCP connectio
            socketTimeoutMS:45000, 
            family:4 //use IPv4
        
        };
        if(process.env.NODE_ENV === "development"){
            mongoose.set('debug',true)
        }
        await mongoose.connect(process.env.MONGO_URI,connectionOptions);
        this.retryCount = 0 //reset retry count on success
        

    }catch (error){
        console.error(error.message)
        await this.handleConnectionError()
    }
}
    // connection ERROR 
    async handleConnectionError(){
        if(this.retryCount <MAX_RETRIES){
            this.retryCount++;
            console.log(`Retrying connection... Attemp ${this.retryCount} of ${MAX_RETRIES}`)
            await new Promise(resolve => setTimeout(() => {
                resolve
            },RETRY_INTERVAL))
            return this.connect()


        }else{
            console.error(`Failed to connect to MONGODB after ${MAX_RETRIES}`)
        }
    }

    async handleDisConnection(){
        if(!this.isConnected){
         console.log("Attempting to reconnect to mongodb...")
         this.connect()
        }
    }
    async handleAppTermination(){
        try {
            await mongoose.connection.close()
            console.log("MongoDb connection closed through app terminator")
            process.exit(0);
        } catch (error) {
            console.error('Error during database disconnection',error)
            process.exit(1)
        }
    }
    getConnectionStatus(){
        return{
            isConnected:this.isConnected,
            readyState:mongoose.connection.host,
            host:mongoose.connection.host,
            name:mongoose.connection.name,
        }
    }
}

//create a singleton instance

const dbConnection = new DatabaseConnection()

export default dbConnection.connect.bind(dbConnection)
export const getConnectionStatus = dbConnection.getConnectionStatus.bind(dbConnection)