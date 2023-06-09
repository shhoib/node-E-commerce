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
         "product" :{
          type : mongoose.Schema.Types.ObjectId,
          ref : "product"
     },
         "price" :{
          type: Number
    }}],

    "orders" : Array
})

module.exports = mongoose.model('user',userSchema);