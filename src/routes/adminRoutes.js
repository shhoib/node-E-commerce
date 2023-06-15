const express = require("express");
const admin_routes = express();

const adminController = require("../controllers/adminController")
const auth = require("../middlewares/tokenauth")
const product = require("../controllers/productController");
const tryCatchMiddleware = require("../middlewares/tryCatch");



admin_routes.post("/admin/login",tryCatchMiddleware(adminController.adminLogin));
admin_routes.get("/admin/users",auth.isAdmin,tryCatchMiddleware(adminController.getAllUsers))
admin_routes.get("/admin/users/:id",auth.isAdmin,tryCatchMiddleware(adminController.getUserById))
admin_routes.post("/admin/products",auth.isAdmin,tryCatchMiddleware(product.addProduct));
admin_routes.get("/admin/products/:id",auth.isAdmin,tryCatchMiddleware(product.getProductByID))
admin_routes.get("/admin/products/category/:category",auth.isAdmin,tryCatchMiddleware(product.getProductByCategory))
admin_routes.put("/admin/products/:id",auth.isAdmin,tryCatchMiddleware(product.upadateProduct))
admin_routes.delete("/admin/products/:id",auth.isAdmin,tryCatchMiddleware(product.deleteProduct))
admin_routes.get("/admin/revenue/stats",auth.isAdmin,tryCatchMiddleware(adminController.totalRevenue))
admin_routes.get("/admin/total/orders",auth.isAdmin,tryCatchMiddleware(adminController.orderDetails))


module.exports = admin_routes;