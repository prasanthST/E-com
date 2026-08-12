import app from "./app.js";
import dotenv from "dotenv";
import DBConnect from "./config/db.js";

dotenv.config({ path: "Backend/config/config.env" });
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).json({ message: "server is working fine" });
});

DBConnect();
//uncaughException
//eg:console.log(name);

  // Cloudinary Configuration
  import {v2 as cloudinary} from "cloudinary";
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
       });

process.on("uncaughtException" ,(err)=>{
  console.log(`Error: ${err.message}`);
  console.log("server is shutting down, due to uncaughException")
  process.exit(1);
})

const server = app.listen(PORT, () => {
  console.log(`app is listening on http://localhost:${PORT}`);
});

//unhandleRejection
process.on("unhandleRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("Server is shutting down , due to unhandled rejection");
  server.close(() => {
    process.exit(1);
  });
});
