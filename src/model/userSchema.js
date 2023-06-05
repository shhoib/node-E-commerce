const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    "username" :{
         type:String
    } ,
    "email" :{
         type:String
    } ,
    "password" :{
         type:String
    } ,
    "cart": [],
    "wishlist" : [],
    "orders" : Array
})

module.exports = mongoose.model('user',userSchema);