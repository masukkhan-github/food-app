import app from "./src/app.js";
import { connectDB } from "./src/db/db.js";
import dotenv from "dotenv";
dotenv.config();


 connectDB();



app.listen(process.env.PORT || 3000,()=>{
    console.log(`app is running on port ${process.env.PORT || 3000}` );
});

