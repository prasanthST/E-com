import express from 'express'
import errorHandleMiddleWare from "./middleWare/error.js"  // ErrorHandle middleWare
import productRouter from './routes/productRouter.js'
import userRouter from './routes/userRouter.js'
import orderRouter from './routes/orderRouter.js'
import cookieParser from 'cookie-parser';
import cors from "cors";
import fileUpload from "express-fileupload";


const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://e-com-shoppingtime.netlify.app/',
    'https://*.netlify.app'
];

// app.use(cors({
//     origin: function (origin, callback) {
//         // Allow requests with no origin
//         if (!origin) return callback(null, true);
        
//         // Check if origin is allowed
//         if (allowedOrigins.some(allowed => 
//             origin === allowed || 
//             origin.endsWith('.netlify.app') ||
//             origin.startsWith('http://localhost')
//         )) {
//             callback(null, true);
//         } else {
//             console.log('Blocked by CORS:', origin);
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
// }));
// ⚠️ Only for testing - allows ALL origins
app.use(cors({
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

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