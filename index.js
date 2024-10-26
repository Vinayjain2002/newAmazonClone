import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from'dotenv';
import connectDB from "./database/connection.js";
import bodyparser from 'body-parser';
import express from 'express';


dotenv.config();
const app= express();

const corsConfig = {
    origin: process.env.BASE_URL,
    credentials: true,
  };    
const port= process.env.PORT || 5000;

// definning the middleWares
app.use(cors(corsConfig));
app.use(express.json());
app.use(bodyparser.json());

// definning the routes to be used
app.get('/', (req, res)=>{
    res.status(200).json('Amazon Clone by @Vinay jain');
})

// connecting to Database
connectDB();

app.listen(port, ()=>{
    console.log(`Server is listening on portNo: ${port}`);
});