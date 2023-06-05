const jwt = require("jsonwebtoken")

const adminLogin = async (req,res)=>{
    try{
      const adminUserName = process.env.ADMIN_USERNAME;
      const adminPassword = process.env.ADMIN_PASSWORD;

      const ADMINUSERNAME = req.body.adminusername;
      const ADMINPASSWORD = req.body.adminpassword;
      console.log("first")

      
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

module.exports = { adminLogin }