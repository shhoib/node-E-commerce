const jwt = require("jsonwebtoken")

const user = require("../model/userSchema")

const adminLogin = async (req,res)=>{
      const adminUserName = process.env.ADMIN_USERNAME;
      const adminPassword = process.env.ADMIN_PASSWORD;

      const ADMINUSERNAME = req.body.adminusername;
      const ADMINPASSWORD = req.body.adminpassword;

      
      if(adminUserName===ADMINUSERNAME && adminPassword===ADMINPASSWORD){
        const token = jwt.sign(adminUserName , "secretKey");
        res.json({message : "logged in as admin", token})
      }
        res.status(500).json({ message : "username or password mismatch"})
}

  const getAllUsers = async(req,res)=>{
      const allUsers = await user.find();
      res.json( allUsers)
  }

  ///////////// get usersById///////////

  const getUserById = async(req,res)=>{
      const id = req.params.id;
      const ID = await user.findById(id)
      res.json(ID)
  }

  const totalRevenue = async (req, res) => {
  
      const aggregate = await user.aggregate([
        { $unwind : '$orders' },
        {$group : {
          _id : null,
          toTalRevenue : {$sum: '$orders.totalAmount'},
          totalItemsSold : {$sum : {$sum : '$orders.products'}}
        }}
      ]);
  
      const toTalRevenue = aggregate[0].toTalRevenue;
      const totalItemsSold = aggregate[0].totalItemsSold;
  
      console.log(toTalRevenue,totalItemsSold)
      res.status(200).json({toTalRevenue,totalItemsSold});
  
  };
  

  ////////orderDetails/////
  const orderDetails = async(req,res)=>{
   
      const orderDetail = await user.find({}, "orders");

      const validOrderDetail = orderDetail.filter((item) => {
        return item.orders && item.orders.length > 0;
      });

      if(validOrderDetail.length>0){
        res.status(200).json(validOrderDetail)
      }
        res.staus(404).json("no orders")
  }

module.exports = { adminLogin , getAllUsers, getUserById,totalRevenue,
                    orderDetails
                       }