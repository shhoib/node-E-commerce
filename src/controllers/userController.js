const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const product = require('../model/productSchema')
const cart = require("../model/cartSchema")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const bcrypt = require("bcrypt")


///////////registerUser//////////////

const registerUser = async (req, res) => {

    const  username = req.body.username;
      const password  = req.body.password;
      const email = req.body.email;


    const existingUser = await User.findOne({ username });

    if (existingUser) {
      res.json({ status :"failure",message : "user already registered",error_message:"user already registered" });
    } 

      const hashedPassword = await bcrypt.hash(password,10);

      const user = new User({username:username,password:hashedPassword,email:email});
      await user.save();

      res.json({ message: "User registered successfully", user });
    }
  



/////////////////loginUSer////////////////
const loginUser = async (req,res)=>{
     
        const password = req.body.password;
        const username = req.body.username;
        const token = jwt.sign( username , "secretKey"); 

        const user = await User.findOne({username});
        console.log(user)
        
        const passwordMatch = await bcrypt.compare(password,user.password)
        console.log(passwordMatch)

        if(user){
         if(username==user.username && passwordMatch){
          return res.status(200).json({message : "logged in succesfully",token})
         }
         return res.status(400).json({ status :"failure",message : "username or password mismatch",error_message:"username or password mismatch"})        
        }
          
        res.status(404).json("please register first")
 
}

/////////getAllProducts///////////
const getAllProducts = async(req,res)=>{
  
    const allProduct = await product.find();
    res.status(200).json(allProduct)
}

//////////////getProductById///////////////////
const getProductByID = async(req,res)=>{
    const ID = req.params.id;
    const Product = await product.findById(ID);

    if(Product){
      res.status(200).json(Product)
    }else{
      res.status(404).json({status :"failure",message : "invalid request",error_message:"invalid request"})
    }  
}
 
///////////////getProductByCategory/////////////
const getProductByCategory = async(req,res)=>{
    const Category = req.query.category;
    const categories = await product.find({category : Category})
    res.status(200).json(categories)
 
}



///////////addProductTOCart///////////
const addToCart = async(req,res)=>{
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedUserName = jwt.decode(token,"secretKey");
    
    const productID = req.params.id;

    const PRODUCT = await product.findOne({ _id : productID});
    
    const user = await User.findOne({username : decodedUserName});


    if(user){
      const userCart = await cart.findOne({ username : user.username});
      
      if(userCart){
        const userIndex = await userCart.item.findIndex((item)=>
        item.product == productID)
  
        if(userIndex >=0){
          res.json({status :"failure",message : "product already in cart",error_message:"product already in cart"})
        }else{
          const incrementCart = await cart.updateOne(
            {userId : user._id},
            {$push:{
              item:{
                product:productID,
                price : PRODUCT.price
              } 
            }}
          )
          res.json({message : "product added succesfully"})
        }
      }
          const createNew = await cart.create({
            username : user.username,
            userId : (user._id),
            item : [{
              product : productID,
              price : PRODUCT.price,
            }]
          });
    }
      res.status(400).json({status :"failure",message : "please login first",error_message:"please login first"})
}



/////////getUserCart//////////////
const getUserCart = async(req,res)=>{
    const userId = req.params.id;
    const user = await cart.findOne({userId : userId})
    const userCart = await user.item;
    res.status(200).json(userCart)
}


////////addToWishlist//////
const ToWishlist = async(req,res)=>{

  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedUserName = jwt.decode(token,"secretKey");
  const user = await User.findOne({username: decodedUserName});
  const productID = req.params.id;

   if(user){
    const PRODUCT = await product.findOne({_id : productID});

    if(PRODUCT){
      const alreadyInCart = await user.wishlist.findIndex((item)=>
        item.product==productID);

      if(alreadyInCart>=0){
        res.status(400).json({status :"failure",message : "product already in wishlist",error_message:"product already in wishlist"})
      }else{
        const addToWishlist = await User.updateOne(
          {_id : user._id},
          {$push:{
            wishlist :{
              product : productID,
              price : PRODUCT.price
            }
          }} )
          res.json(user)
        }
       }else{
        res.json({status :"failure",message : "no product found",error_message:"no product found"})
      }
      }else{
        res.json({status :"failure",message : "please login first",error_message:"please login first"}) 
       }
}


/////////////deleteFromWishlist////////
const deleteFromWishlist = async(req,res)=>{
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedUserName = jwt.decode(token,"secretKey");
  const user = await User.findOne({username: decodedUserName});
  const productID = req.params.id; 

    const index =  user.wishlist.findIndex((item)=>
      item.product==productID);

      if(index>=0){
        const deleteItem =  user.wishlist.splice(index,1);
        await user.save();
        res.json({message : "product deleted succesfully"})
      }else{
        res.json({status :"failure",message : "no product found",error_message:"no product found"})
      }
}


//////////payment/////////

const payment = async (req,res) =>{
  const ID = req.params.id;
  const { amount, currency, payment_method_types } = req.body;


    const userCart = await cart.findOne({userId : ID})
   
    if(!userCart||userCart.item.length<0){
      res.status(400).jso({status :"failure",message : "your cart is empty",error_message:"your cart is empty"})
    }else{
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method_types
      });  
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } 


    const totalAmount =  userCart.item.reduce((accumulator,currentValue)=>{
      return accumulator+ currentValue.price
    },0); 

    const noOfProducts = userCart.item.length;
   
    const orderDetails = await User.updateOne(
      { _id : ID}, 
      {$push:{
        orders:{
          products : noOfProducts,
          totalAmount : totalAmount
        }
      }}
    ) 
}
 


module.exports = { registerUser , getAllProducts, addToCart,
                   loginUser ,getProductByID ,getProductByCategory,
                   getUserCart,ToWishlist,deleteFromWishlist,payment
                   
                   
                  };

                  
