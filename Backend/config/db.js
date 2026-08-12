import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const DBConnection =()=>{
    mongoose .connect(process.env.DB_URL)
    .then((data)=>{
        console.log("DB is connected",data.connection.host);  
    })
    .catch((error)=>{
      console.log("DB.Err :",error.message);
    })
}
export default DBConnection
