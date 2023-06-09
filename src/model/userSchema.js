const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    "username" :{
         type:String
    } ,
    
    "email" :{
         type:String,
         required : true
    } ,

    "password" :{
         type:String,
         required : true
    } , 

    "wishlist" : [{
     type:mongoose.Schema.Types.ObjectId,
     ref : "product"
    }],

    "orders" : Array
})

module.exports = mongoose.model('user',userSchema);