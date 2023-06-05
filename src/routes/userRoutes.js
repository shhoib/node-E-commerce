const express = require("express");
const user_route = express();

const auth = require("../middlewares/tokenauth")

const userController = require("../controllers/userController");


user_route.post("/users/register",userController.registerUser);

user_route.post("/users/login",auth.tokenVerification,userController.loginUser)

module.exports = user_route;