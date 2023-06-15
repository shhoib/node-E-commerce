const express = require("express");
const user_route = express();

const tryCatchMiddleware = require("../middlewares/tryCatch");

const auth = require("../middlewares/tokenauth")
   
const user = require("../controllers/userController");
 

user_route.post("/users/register",tryCatchMiddleware(user.registerUser));
user_route.post("/users/login",tryCatchMiddleware(user.loginUser));
user_route.get("/users/products",auth.tokenVerification,tryCatchMiddleware(user.getAllProducts));
user_route.get("/users/products/:id",auth.tokenVerification,tryCatchMiddleware(user.getProductByID))
user_route.get("/users/products/category",auth.tokenVerification,tryCatchMiddleware(user.getProductByCategory));
user_route.post("/users/cart/:id",auth.tokenVerification,tryCatchMiddleware(user.addToCart));
user_route.get("/users/cart/:id",auth.tokenVerification,tryCatchMiddleware(user.getUserCart)) ;
user_route.post("/users/wishlist/:id",auth.tokenVerification,tryCatchMiddleware(user.ToWishlist));
user_route.delete("/users/wishlist/:id",auth.tokenVerification,tryCatchMiddleware(user.deleteFromWishlist));
user_route.post("/users/payment/:id",auth.tokenVerification,tryCatchMiddleware(user.payment));

module.exports = user_route;