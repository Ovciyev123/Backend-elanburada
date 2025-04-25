import { config } from "dotenv";
import { connect } from "mongoose";


config()


connect(process.env.MongoDbUrl).
then(()=>{

    console.log("Connected");
    
})