const User = require("../models/user _models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secret = require("../config/config");
require('dotenv').config()
const nodemailer = require('nodemailer')




// Ma'lumot olish
exports.getUser = async (req, res) => {
  const user = await User.query().select("*");
  return res.status(200).json({ success: true, user: user });
};

// foydalanuvchi qo'shish
exports.postUser = async (req, res) => {
  const user = await User.query().where("phone", req.body.phone).first();
  if (user) {
    return res.status(404).json({ success: false, err: "foydalanuvchi mavjud" });
  }
  const salt = await bcrypt.genSaltSync(12)
  const password = await bcrypt.hashSync(req.body.password,salt)
  await User.query().insert({
    name: req.body.name,
    role: req.body.role,
    email: req.body.email,
    password: password,
    phone: req.body.phone,
    login: req.body.login,
  });
  return res.status(200).json({ success: true, msg: "foydalanufchi yaratildi" });
};



// fodalanuvchini yangilash paramsda
exports.updetUser = async (req, res) => {
  const d = new Date();

  await User.query().where("id", req.params.id).update({
    name: req.body.name,
    role: req.body.role,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    login: req.body.login,
    created: d,
  });
  return res
    .status(200)
    .json({ success: true, msg: "foydalanuvchi o/'zgartirldi" });
};

// foydalanuvchini o'chirish
exports.delteUser = async (req, res) => {
  await User.query().where("id", req.params.id).delete();
  return res
    .status(200)
    .json({ success: true, msg: "foydalanuvchi o'chirildi" });
};

// foydalanuvchi atarizatsiyasi
exports.auth = async (req, res) => {
  const user = await User.query().where("login", req.body.login).first();
  if (!user) {
    return res.status(404).json({ success: false, err: "user-not-found" });
  }
  const checkPassword = await bcrypt.compareSync(
    req.body.password,
    user.password
  ) 
  if (!checkPassword) {
    return res.status(400).json({ success: false, err: "login-or-password-fail" });
  }
  const payload = { id: user.id };

  const token = await jwt.sign(payload, secret, { expiresIn: "1d" });
  return res.status(200).json({ success: true, token: token });
};


exports.repassword = async (req, res) => {
  if (req.body.step == 1) {
    const user = await User.query().where('phone',req.body.phone).first()
    if(!user){
        return res.status(404).json({success:false, err:'user-not-found'})
    }
    const code = Math.floor((Math.random()+1)*1000)
    const d = new Date()
    const time = d.setMinutes(d.getMinutes()+2)
    await User.query().where('phone',req.body.phone).update({
        code: code,
        exp_code_time: time,
    })
   
// emailga cod yuborish
     const transporter = nodemailer.createTransport({
      service:'gmail',
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use `true` for port 465, `false` for all other ports
      auth: {
        user:"turakulovmuzaffar1995@gmail.com" ,
        pass: "oxzlsiljnptlfotv",
      },
    });
    if (!req.body.email) {
      return res.status(400).json({success:false, err:'Email is required'});
    }
    const mailOptions ={
      from:{
        name: 'Web Wizard',
        address: "turakulovmuzaffar1995@gmail.com"
      },
      to: req.body.email,
      subject: "Msg code", // Subject line
      text: `bu ${code} codni xech kimga aytmang`, // plain text body

    }
    transporter.sendMail(mailOptions, function(error, val){
          if (error) {
            console.log('Error sending email: ', error);
            return res.status(500).json({ success: false, err: 'email-send-failed ' });
          } else {
            console.log(val.response,"sent Mail...");
            return res.status(200).json({ success: true, msg: `Code sent to ${req.body.email}` });
          }
        })
    }
  if(req.body.step == 2){
    const user =  User.query().where('phone',req.body.phone).first()
    if(!User){
      return res.status(404).json({success:false, err: "user-notfound"})
    }
    if(user.code!= req.body.code){
      return res.status(400).json({success:false, err: "code-worng"})
    }
    if(user.exp_code_time < new Date().getMinutes()){
      return res.status(400).json({success:false, err:"time-error"})
    }
return res.status(200).json({success:true, msg: "success"})
  }
  if(req.body.step == 3){
    if(!User){
      return res.status(404).json({success:false, err: "user-notfound"})
    }
    if(user.code!= req.body.code){
      return res.status(400).json({success:false, err: "code-worng"})
    }
    if(user.exp_code_time < new Date().getMinutes()){
      return res.status(400).json({success:false, err:"time-error"})
    }
    await User.query().update({
      password: req.body.password,
      code: null,
      exp_code_time: null,
    })
      
// emailga cod yuborish
const transporter = nodemailer.createTransport({
  service:'gmail',
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user:"turakulovmuzaffar1995@gmail.com" ,
    pass: "oxzlsiljnptlfotv",
  },
});
if (!req.body.email) {
  return res.status(400).json({success:false, err:'Email is required'});
}
const mailOptions ={
  from:{
    name: 'Web Wizard',
    address: "turakulovmuzaffar1995@gmail.com"
  },
  to: req.body.email,
  subject: "Your code", // Subject line
  text: "codinggiz yangilandi", // plain text body

}
transporter.sendMail(mailOptions, function(error, val){
      if (error) {
        console.log('Error sending email: ', error);
        return res.status(500).json({ success: false, err: 'email-send-failed ' });
      } else {
        console.log(val.response,"sent Mail...");
        return res.status(200).json({ success: true, msg: `Code sent to ${req.body.email}` });
      }
    })
    return res.status(200).json({success:true, msg:"code update"})
}
  }