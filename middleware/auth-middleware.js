const jwt = require('jsonwebtoken')
const secret = require ('../config/config')
const User = require('../models/user _models')


exports.protect = async (req,res,next)=> {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")["1"]
    }
    if(!token){
        return res.status(401).json({success:false,  err: "No access"})
    }
    const decode = jwt.verify(token,secret)
    req.user = await User.query().where('id',decode.id).first()
    next()
    if(!req.user){
        res.status(401).json({success:false, err: "User-not-found"})
    }
 
}

exports.role = (...role)=>{
return (req,res,next)=>{
    if(!role.includes(req.user.role)){
        return res.status(403).json({success: false, err:"forbidden"})
    }
    next()
}
}