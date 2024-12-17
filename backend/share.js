const express = require('express')
const db = require('./db')

const route = express.Router()

var message = ''

route.post('/shareForm',(req,res)=>{
    const app = req.body.app
    const user = req.body.user
    const type = req.body.type
    db.query(`SELECT * FROM shared_app WHERE app_id=${app} AND user_id=${user}`,(err,data)=>{
        if(err) throw console.log(err)
            if(data.length>0){
                  message = 'User Already shared to this File!!'
            }else{
                const query = `INSERT INTO shared_app(app_id,user_id,type)VALUES(?,?,?)`
                 db.query(query,[app,user,type],(err,data)=>{
                    if(err) throw console.log(err)
                    message = 'Sharing File went well!!'
                 })
            }
         res.json(message)
    })
})

route.delete('/removeSharingForm',(req,res)=>{
    const user = req.body.user
    const app = req.body.app
    const query = `DELETE FROM shared_app WHERE user_id=${user} AND app_id=${app}`
    db.query(query,(err,data)=>{
        if(err) throw console.log(err)
            message= 'Removing sharing succesfully done !!'
        res.json({data,message})
    })
})

route.get('/getSharedForm/:id',(req,res)=>{
    const id = req.params.id
    const query = `SELECT application.*,shared_app.* FROM shared_app,application WHERE shared_app.app_id=application.app_id and application.app_name!='' and shared_app.user_id=${id}`
    db.query(query,(err,data)=>{
        if(err) throw console.log(err)
            res.json(data)
    })
})

route.get('/getSharedApp/:id/:id1',(req,res)=>{
    const id = req.params.id
    const id1 = req.params.id1
    const query = `SELECT application.*,shared_app.* FROM shared_app,application WHERE shared_app.app_id=application.app_id and shared_app.user_id=${id1} and application.app_name='${id}'`
    db.query(query,(err,data)=>{
        if(err) throw console.log(err)
            res.json(data)
    })
})

module.exports = route