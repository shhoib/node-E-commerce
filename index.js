 const express = require("express")
 const app = express();
 require('dotenv').config();


 const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/nodeproject");
const db = mongoose.connection;

app.use(express.json()); 

const userRoute = require("./src/routes/userRoutes");
app.use("/",userRoute);

const adminRoute = require("./src/routes/adminRoutes");
app.use("/",adminRoute);


 

 


app.listen(5000,()=>console.log("server started"))
 