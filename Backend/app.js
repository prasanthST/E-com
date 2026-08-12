import express from 'express'
import errorHandleMiddleWare from "./middleWare/error.js"  // ErrorHandle middleWare
import productRouter from './routes/productRouter.js'
import userRouter from './routes/userRouter.js'
import orderRouter from './routes/orderRouter.js'
import cookieParser from 'cookie-parser';
import cors from "cors";
import fileUpload from "express-fileupload";


const app = express();
app.use(express.json());
app.use(cookieParser()); // it's use for read the data from browser cookie  
app.use(fileUpload());

//Router
app.use('/api/v1' ,productRouter)
app.use('/api/v1' , userRouter)
app.use('/api/v1' , orderRouter)
// In your backend server file (app.js or server.js)

//MiddleWare
app.use(errorHandleMiddleWare)
export default app;

// Notes
/*
* ella api's um create panito middle ware create pananum 
*/ 