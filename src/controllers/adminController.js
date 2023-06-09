const jwt = require("jsonwebtoken")

const user = require("../model/userSchema")

const adminLogin = async (req,res)=>{
    try{
      const adminUserName = process.env.ADMIN_USERNAME;
      const adminPassword = process.env.ADMIN_PASSWORD;

      const ADMINUSERNAME = req.body.adminusername;
      const ADMINPASSWORD = req.body.adminpassword;

      
      if(adminUserName===ADMINUSERNAME && adminPassword===ADMINPASSWORD){
        const token = jwt.sign(adminUserName , "secretKey");
        res.json({message : "logged in as admin", token})
      }else{
        res.status(500).json({ message : "username or password mismatch"})
      }
    }
    catch(error){
      console.log(error)
    }
}

  const getAllUsers = async(req,res)=>{
    try{
      const allUsers = await user.find();
      res.json( allUsers)
    }
    catch(error){
       res.status(500).json(error)
    }
  }

  ///////////// get usersById///////////

  const getUserById = async(req,res)=>{
    try{
      const id = req.params.id;
      const ID = await user.findById(id)
      res.json(ID)
    }
    catch(error){
      res.json(error)
    }
  }

  

module.exports = { adminLogin , getAllUsers, getUserById
                       }