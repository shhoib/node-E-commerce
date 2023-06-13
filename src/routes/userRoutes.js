const express = require("express");
const user_route = express();

const auth = require("../middlewares/tokenauth")
   
const user = require("../controllers/userController");


user_route.post("/users/register",user.registerUser);
user_route.post("/users/login",user.loginUser);
user_route.get("/users/products",user.getAllProducts);
user_route.get("/users/products/:id",user.getProductByID)
user_route.get("/users/products/category",user.getProductByCategory);
user_route.post("/users/cart/:id",user.addToCart);
user_route.get("/users/cart/:id",user.getUserCart); 
user_route.post("/users/wishlist/:id",user.ToWishlist);
user_route.delete("/users/wishlist/:id",user.deleteFromWishlist);
user_route.post("/users/payment/:id",user.payment);

module.exports = user_route;