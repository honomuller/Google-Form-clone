const express = require('express')
const db = require('./db')

const route = express.Router()
var message = ''

route.post('/insertEmail',(req,res)=>{
    const content = req.body.content
    const type = req.body.type
    const id = req.body.id
    //console.log(id)
    
    const qur = `SELECT app_id FROM application WHERE app_name='${id}'`
    db.query(qur,(err,ress)=>{
        if(err) throw console.log(err)
            if(ress.length>0){
                //console.log(ress[0].app_id)
                const ji = `SELECT * FROM responsemail WHERE type='${type}' and app_id=${ress[0].app_id}`
                db.query(ji,(err,dat)=>{
                    if(err) throw console.log(err)
                        //console.log(dat.length<0)
                        if(dat.length>0){
                            const up = `UPDATE responsemail SET email='${content}' WHERE resp_id=${dat[0].resp_id}`
                            db.query(up,(err,dt)=>{
                                if(err) throw console.log(err)
                                    message = 'Email Response Updated Successfully!!'
                            })
                        }else{
                            const query = `INSERT INTO responsemail(email,type,app_id)VALUES('${content}','${type}',${ress[0].app_id})`
                             db.query(query,(err,data)=>{
                                  if(err) throw console.log(err)
                                    message = 'Email Response Created!!'
                            })
                        }
                        res.json(message)
                     })
                     
               }
          })
    
})


module.exports=route