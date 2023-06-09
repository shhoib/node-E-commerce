const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title : {
       type :String,
    },
    description : {
       type :String,
       required : true,
    },
    price : {
        type : Number,
        required : true,
    }, 
    image : {
        type : String,
        required : true,
    },
    category : {
        type : String,
        
    }
})

module.exports = mongoose.model("product", productSchema)