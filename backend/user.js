const express = require('express')
const bcrpty = require('bcrypt')
const jwt = require('jsonwebtoken')
const twilio = require("twilio"); 
const db = require('./db')

const route = express.Router()
var salt = bcrpty.genSaltSync(10)
var jwtSecret = "hjgshbvsnvaeywuyghsgahf324235"
var message = ""
var token = ""

// Or, for ESM: import twilio from "twilio";


const otpStore = {}

route.post("/login",(req,res)=>{
    const email = req.body.email
    const password = req.body.password
    const hashpassword = bcrpty.hashSync(password,salt)
    const query = `SELECT * FROM user WHERE email=?`
    db.query(query,[email],(err,data)=>{
        if(err) throw console.log(err)
            if(data.length > 0){
                const com = bcrpty.compareSync(password,data[0].password)
                if(com === true){

                    token = jwt.sign(data[0],jwtSecret,{expiresIn:60*60})
                    message = "Login Successfully!!"
                }else{
                    token = ""
                    message = "Wrong Email or Password!!!!"
                }
            }else{
                message = "User doesn't exists!!"
            }
           res.json({token,message})
    })
})

route.post("/register",(req,res)=>{
    const email=req.body.email
    const password = req.body.password
    const institution = req.body.institution
    const role = req.body.role
    const firstname = req.body.firstName
    const lastname = req.body.lastName
    const phone = req.body.phone
    const hashpassword = bcrpty.hashSync(password,salt)
    const i = ''

    const quer = `SELECT * FROM user WHERE email=?`
    db.query(quer,[email],(err,data)=>{
        if(data.length > 0){
            i = "no"
            message = "User Already Exists!!"
        }else{
            const query = `INSERT INTO user(email,password,institution,role,firstname,lastname,phone)VALUES(?,?,?,?,?,?,?)`
        db.query(query,[email,hashpassword,institution,role,firstname,lastname,phone],(err,data)=>{
            if(err) throw console.log(err)
             i = "ok"
            message = "User Created Successfully!!"
        })
        }
        if(i == "ok"){
            res.json(message)
        }else{
            res.json(message)
        }
        
    })
})

route.get('/getUsers',(req,res)=>{
    db.query(`SELECT user_id,email,firstname,lastname,phone,role,institution FROM user`,(err,data)=>{
        if(err) throw console.log(err)
            res.json(data)
    })
})

route.get('/usersId/:id',(req,res)=>{
    db.query(`SELECT * FROM user WHERE user_id=?`,[req.params.id],(err,data)=>{
        if(err) throw console.log(err)
            res.json(data)
    })
})


route.get('/usersNotId/:id',(req,res)=>{
    db.query(`SELECT * FROM user WHERE user_id!=?`,[req.params.id],(err,data)=>{
        if(err) throw console.log(err)
            res.json(data)
    })
})

route.delete('/userDelete/:id',(req,res)=>{
    db.query(`DELETE FROM user WHERE user_id=?`,[req.params.id],(err,data)=>{
        if(err) throw console.log(err)
            message = 'User Deleted Successfully!!'
            res.json(message)
    })
})

route.put('/userUpdate/:id',(req,res)=>{
    const email=req.body.email
    const institution = req.body.institution
    const role = req.body.role
    const id = req.params.id
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const phone = req.body.phone
    const query = `UPDATE user SET email=?, institution=?, role=?, firstname=?, lastname=?, phone=? WHERE user_id=?`
    db.query(query,[email,institution,role,firstname,lastname,phone,id],(err,data)=>{
        if(err) throw console.log(err)
            message = 'User well updated !!!'
        res.json(message)
    })
})

route.post('/AdminUserUpdate',(req,res)=>{
    const email=req.body.email
    const institution = req.body.institution
    const role = req.body.role
    const id = req.body.id
    const query = `UPDATE user SET email='?', institution='?', role='?' WHERE user_id=?`
    db.query(query,[email,institution,role,id],(err,data)=>{
        if(err) throw console.log(err)
            message = 'User well updated !!!'
            res.json({data,message})
    })
})

route.post('/passwordChange',(req,res)=>{
    const password = req.body.password
    const id = req.body.id
    const hashpassword = bcrpty.hashSync(password,salt)
    const query = `UPDATE user SET password=? WHERE user_id=?`
    db.query(query,[hashpassword,id],(err,data)=>{
        if(err) throw console.log(err)
            message = 'Password well changed!!'
            res.json({data,message})
    })
})

route.put('/passwordUpdate/:id',(req,res)=>{
    const password = req.body.password
    const id = req.params.id
    const hashpassword = bcrpty.hashSync(password,salt)
    const query = `UPDATE user SET password=? WHERE user_id=?`
    db.query(query,[hashpassword,id],(err,data)=>{
        if(err) throw console.log(err)
            message = 'Password well changed!!'
            res.json(message)
    })
})


module.exports = route