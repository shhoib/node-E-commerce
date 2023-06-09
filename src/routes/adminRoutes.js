const express = require("express");
const admin_routes = express();

const adminController = require("../controllers/adminController")
const auth = require("../middlewares/tokenauth")
const product = require("../controllers/productController");


admin_routes.post("/admin/login",adminController.adminLogin);
admin_routes.get("/admin/users",auth.isAdmin,adminController.getAllUsers)
admin_routes.get("/admin/users/:id",auth.isAdmin,adminController.getUserById)
admin_routes.post("/admin/products",auth.isAdmin,product.addProduct);
admin_routes.get("/admin/products/:id",auth.isAdmin,product.getProductByID)
admin_routes.get("/admin/products/category/:category",auth.isAdmin,product.getProductByCategory)
admin_routes.put("/admin/products/:id",auth.isAdmin,product.upadateProduct)
admin_routes.delete("/admin/products/:id",auth.isAdmin,product.deleteProduct)


module.exports = admin_routes;