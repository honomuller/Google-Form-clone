const express = require('express')
const route = express.Router()

const otpStore = {}

route.post('/sendOtp',(req,res)=>{
  const phone = req.body.phone
  const otp = Math.floor(100000 + Math.random() * 900000)


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
