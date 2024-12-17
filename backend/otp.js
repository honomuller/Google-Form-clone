const express = require('express')
const route = express.Router()

const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

const accountSid = 'ACd10fae6aca0ee42762a1d0688368ccaf';
const authToken = '9786147ff650f451168d30280a9ad630';
const client = twilio(accountSid, authToken);

const otpStore = {}

route.post('/sendOtp',(req,res)=>{
  const phone = req.body.phone
  const otp = Math.floor(100000 + Math.random() * 900000)

  client.messages.create({
    body:`Your OTP is ${otp}`,
    from: '+14845145237',
    to: phone
  }).then(()=>{
    otpStore[phone] = otp;
    res.status(200).send({success: true, otp})
  }).catch(err=>{
    res.status(500).send({success: false,message: err.message})
  })

})

route.post('/verifyOtp',(req,res)=>{
  const { phone , otp } = req.body
  if(!phone|| !otp){
    return res.status(400).json({message: "Phone number and OTP are required"})
  }
  const storedOtp = otpStore[phone]

  if(parseInt(otp) === storedOtp){
    delete otpStore[phone]
    return res.json({verified: true})
  }else{
    return res.json({verified:false})
  }

})

module.exports = route
