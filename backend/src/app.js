import express from 'express';
import cookieParser from 'cookie-parser';
import {authRouter}  from './routes/auth.routes.js';
import { foodRouter } from './routes/food.routes.js';
import { foodPartnerRouter } from './routes/food-partner.routes.js';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();

dotenv.config();

app.use(cors({
  origin:["http://localhost:5173","http://localhost:5174"],
  credentials:true,
}));

app.use(cookieParser());
app.use(express.json());


app.get("/",(req,res)=>{
  res.send("hello get root");
});

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/food", foodRouter)
app.use("/api/v1/food-partner", foodPartnerRouter)



export default app;

