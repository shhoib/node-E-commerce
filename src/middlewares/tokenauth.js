const jwt = require("jsonwebtoken");

const tokenVerification = async (req,res,next)=>{
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if(token==null){
        res.send(401)
    }
        jwt.verify(token, "secretKey",(err,user)=>{
            if(err){
                res.status(404);
                return;
            }
            req.user=user;
            next();
        })}

const isAdmin = async ( req,res,next)=>{
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if(token == null){
        res.sendStatus(401).json({message : "admin token error"})
    }
    jwt.verify( token, "secretKey", (err, user)=>{
        if(err){
            res.status(404);
            return;
        }
        req.user=user;
        next();
    })
}

module.exports= {tokenVerification, isAdmin};