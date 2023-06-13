const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const product = require('../model/productSchema')
const cart = require("../model/cartSchema")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)


///////////registerUser//////////////

const registerUser = async (req, res) => {
  try {
    const { username } = req.body;


    const existingUser = await User.findOne({ username });

    if (existingUser) {
      res.json({ message: "User already registered" });
    } else {
      const user = new User(req.body);
      await user.save();

      res.json({ message: "User registered successfully", user, token });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering new user" });
  }
};
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFhYSIsImlhdCI6MTY4NjE5MDkyMH0.9dvNxi5y5WBnweGi9-G0_LJ4PG8tZbrOTHjY5sHdAuo

/////////////////loginUSer////////////////
const loginUser = async (req,res)=>{
    try{  
        const password = req.body.password;
        const username = req.body.username;
        const token = jwt.sign( username , "secretKey"); 

    //  console.log(password,username)
        const usernameMatch = await User.findOne({password : password});
        const passwordMatch = await User.findOne({username: username});

        if(passwordMatch&& usernameMatch){
          res.json({ message : "login successfull" ,token})
        }else{
          res.status(500).json({message:"please enter valid username and password"})
          console.log(error)
        }
    }catch(error){
      console.log(error)
    }
}

/////////getAllProducts///////////
const getAllProducts = async(req,res)=>{
  try{
    const allProduct = await product.find();
    res.status(200).json(allProduct)
  }catch(error){
    res.status(500).json(error)
  }
}

//////////////getProductById///////////////////
const getProductByID = async(req,res)=>{
  try{
    const ID = req.params.id;
    const Product = await product.findById(ID);

    if(Product){
      res.status(200).json(Product)
    }else{
      res.status(404).json({message:"invalid request"})
    }}
     catch(error){
    res.status(500).json(error)
  }
}
 
///////////////getProductByCategory/////////////
const getProductByCategory = async(req,res)=>{
  try{
    const Category = req.query.category;
    const categories = await product.find({category : Category})
    res.status(200).json(categories)
    console.log("first")
  }
  catch(error){
     res.status(500).json(error)
     console.log("Second")
  }
}



///////////addProductTOCart///////////
const addToCart = async(req,res)=>{
  try{
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedUserName = jwt.decode(token,"secretKey");
    
    const productID = req.params.id;

    const PRODUCT = await product.findOne({ _id : productID});
    // console.log(decodedUserName)
    
    const user = await User.findOne({username : decodedUserName});
    // console.log(user)


    if(user){
      const userCart = await cart.findOne({ username : user.username});
      
      if(userCart){
        const userIndex = await userCart.item.findIndex((item)=>
        item.product == productID)
        // console.log(userIndex)
  
        if(userIndex >=0){
          res.json({message : "product already in cart",userCart})
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
          // console.log(incrementCart)
        }
      }else{
          const createNew = await cart.create({
            username : user.username,
            userId : (user._id),
            item : [{
              product : productID,
              price : PRODUCT.price,
            }]
          });
        }
    }else{
      // res.json({message:"pplease login first"})
      console.log("please login first")
    }
}catch(error){ 
  console.log(error)
  res.status(500).json(error);
}
}


/////////getUserCart//////////////
const getUserCart = async(req,res)=>{
  try{
    const userId = req.params.id;
    const user = await cart.findOne({userId : userId})
    const userCart = await user.item;
    res.json(userCart)
  }catch(error){
    res.json(error)
  }
}


////////addToWishlist//////
const ToWishlist = async(req,res)=>{

  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedUserName = jwt.decode(token,"secretKey");
  const user = await User.findOne({username: decodedUserName});
  const productID = req.params.id;

  try{
   if(user){
    const PRODUCT = await product.findOne({_id : productID});

    if(PRODUCT){
      const alreadyInCart = await user.wishlist.findIndex((item)=>
        item.product==productID);

      if(alreadyInCart>=0){
        res.json({message : "product already in wishlist"})
      }else{
        const addToWishlist = await User.updateOne(
          {_id : user._id},
          {$push:{
            wishlist :{
              product : productID,
              price : PRODUCT.price
            }
          }} )
          // console.log(user);
          res.json(user)
        }
       }else{
        res.json({message : "no product found"})
      }
      }else{
        res.json({message :"please login first"}) 
       }
     
  }catch(error){
    console.log(error)
    res.json(error)
  }
}


/////////////deleteFromWishlist////////
const deleteFromWishlist = async(req,res)=>{
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decodedUserName = jwt.decode(token,"secretKey");
  const user = await User.findOne({username: decodedUserName});
  const productID = req.params.id; 

  try{
    const index =  user.wishlist.findIndex((item)=>
      item.product==productID);

      if(index>=0){
        const deleteItem =  user.wishlist.splice(index,1);
        await user.save();
        res.json({message : "product deleted succesfully"})
      }else{
        res.json({messsage:"product not found"})
      }

  }catch(error){
    console.log(error)
    res.json(error)
  }
}


//////////payment/////////

const payment = async (req,res) =>{
  const ID = req.params.id;
  const { amount, currency, payment_method_types } = req.body;

  try{
    const userCart = await cart.findOne({userId : ID})
   
    if(!userCart||userCart.item.length<0){
      res.send("your cart is empty")
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
    
    

  }catch(error){
    console.log(error)
    res.status(500).send(error)
  }
}


/////////////orderdetails/////////

// const orderdetails = async(req,res)=>{

//   const ID = req.params.id;

//   try{
  
//   }
// }
 


module.exports = { registerUser , getAllProducts, addToCart,
                   loginUser ,getProductByID ,getProductByCategory,
                   getUserCart,ToWishlist,deleteFromWishlist,payment
                   
                  };

                  
// async function createPayment(req, res) {
//   const { amount, currency, payment_method_types } = req.body;

//   try {
    
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }


// async function processPayment(req, res) {
//   const { amount, currency, source } = req.body;

//   try {
//     // Create a charge or payment intent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency,
//       payment_method: source,
//       confirm: true,
//     });

//     // Payment successful
//     res.status(200).json({ success: true, paymentIntent });
//   } catch (error) {
//     // Payment failed
//     res.status(500).json({ success: false, error: error.message });
//   }
// }