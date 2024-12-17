const express = require('express')
const db = require('./db')
const { daDK } = require('@mui/material/locale')

const route = express.Router()

var message = ''

route.post('/insertCategory',(req,res)=>{
    const id = req.body.id
    const category = req.body.category
    const mark = req.body.mark
    db.query('INSERT INTO markscateg(categ_name,mark,app_id)VALUES(?,?,?)',[category,mark,id],(err,data)=>{
        if(err) throw console.log(err)
            message = 'Category Created !!'
            res.json(message)
    })
})

route.get('/getCategory/:id',(req,res)=>{
    const id = req.params.id
    db.query('SELECT * FROM markscateg WHERE app_id=?',[id],(err,data)=>{
        if(err) throw console.log(err)
            res.json(data)
    })
})

route.get('/getCategoryId/:id',(req,res)=>{
    const id = req.params.id
    db.query('SELECT * FROM markscateg WHERE categ_id=?',[id],(err,data)=>{
        if(err) throw console.log(err)
            res.json(data)
    })
})

route.get('/getCategoryForm/:id',(req,res)=>{
    const id = req.params.id
    db.query('SELECT * FROM markscateg WHERE app_id=?',[id],(err,data)=>{
        if(err) throw console.log(err)
            res.json(data)
    })
})

route.put('/updateCategory',(req,res)=>{
    const id = req.body.id
    const category = req.body.category
    const mark = req.body.mark
    db.query('UPDATE markscateg SET categ_name=?, mark=? WHERE categ_id=?',[category,mark,id],(err,data)=>{
        if(err) throw console.log(err)
            message="Category Updated Successfully!!!"
            res.json(message)
    })
})

route.delete('/deleteCategory/:id',(req,res)=>{
    const id = req.params.id
    db.query('DELETE FROM markscateg WHERE categ_id=?',[id],(err,data)=>{
        if(err) throw console.log(err)
            message='Category Delete Successfully!!!'
            res.json(message)
    })
})


route.post('/insertMarks',(req,res)=>{
    const id = req.body.id
    const user = req.body.user
    const marks = req.body.data
    const data = req.body
    var h = ''
    var sum = 0
    var ji = false
    Object.keys(marks).map(ite =>{
        db.query(`SELECT * FROM markuser WHERE user_id=${user} AND app_id='${id}' AND category_id=${ite}`,(err,yt)=>{
            if(err) throw console.log(err)
                if(yt.length>0){
                    db.query(`UPDATE markuser SET marks=${marks[ite]} WHERE user_id=${user} AND app_id='${id}' AND category_id=${ite}`,(err,fg)=>{
                        if(err) throw console.log(err)
                            h = 1
                    })
                }else{
                    db.query(`INSERT INTO markuser(user_id,app_id,category_id,marks)VALUES(${user},'${id}',${ite},${marks[ite]})`,(err,ress)=>{
                        if(err) throw console.log(err)
                            h = 0
                    })
                }
        })
        sum = sum+parseInt(marks[ite])
    })

    db.query(`SELECT * FROM application WHERE app_name='${id}'`,(err,dt)=>{
        if(err) throw console.log(err)
            if(dt.length>0){
                db.query(`SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='${dt[0].app_title}'`,(err,dy)=>{
                    if(err) throw console.log(err)
                        dy.map(ite=>{
                             if(ite.COLUMN_NAME === 'mark'){
                                ji = false
                            }else{
                                ji = true
                            }
                    })
                })
                if(ji==true){
                    db.query(`ALTER TABLE ${dt[0].app_title} ADD COLUMN mark varchar(2500)`,(err,rd)=>{
                        if(err) throw console.log(err)
                            db.query(`UPDATE ${dt[0].app_title} SET mark=${sum} WHERE form_id=${user}`,(err,ress)=>{
                                if(err) throw console.log(err)
                                    h=0
                            })
                        })
                }else{
                    db.query(`UPDATE ${dt[0].app_title} SET mark=${sum} WHERE form_id=${user}`,(err,ress)=>{
                        if(err) throw console.log(err)
                            h=0
                    })
                }
        }
    })
    
    if(h == 1){
        message="Marks Updated Successfully!!"
    }else{
        message="Marks inserted Successfully!!!"
    }
    res.json(message)
})

module.exports = route