const express = require("express");
const admin_routes = express();

const adminController = require("../controllers/adminController")
const auth = require("../middlewares/tokenauth")

admin_routes.post("/admin/login",auth.isAdmin,adminController.adminLogin)


module.exports = admin_routes;