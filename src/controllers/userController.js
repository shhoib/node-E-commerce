const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { username } = req.body;

    const token = jwt.sign({ username }, "secretKey"); 

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

const loginUser = async (req,res)=>{
    try{
        const password = req.body.password;
        const username = req.body.username;

        const passwordMatch = await User.findOne({username: username});
        const usernameMatch = await User.findOne({password : password})

        if(passwordMatch&& usernameMatch){
          res.json({ message : "loggin successfull"})
        }else{
          res.status(500).json({message:"please enter valid username and password"})
          console.log("error in logging in")
        }
    }catch(error){
      console.log(error)
    }
}

module.exports = { registerUser ,
                   loginUser 
                  };
