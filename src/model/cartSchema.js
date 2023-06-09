const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    username : {
        type : String,
    },
    userId : {
        type : mongoose.Types.ObjectId,
        ref : "user",
        required : true,
    },
     item : [{
        product : {
            type:  mongoose.Types.ObjectId,
            ref : "product",
            required : true
        },
        price :{
            type: Number,
            required : true
        }   
        }],

    totalPrice:{
        type : Number
    }
    
})

module.exports = mongoose.model("cart" , cartSchema );