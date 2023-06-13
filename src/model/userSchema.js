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


    "orders": [{
       "products": {
           type: Number,
           default: 0,
         },
       "totalAmount": {
         type: Number,
         default: 0,
       },  
     }],
 });


module.exports = mongoose.model('user',userSchema);