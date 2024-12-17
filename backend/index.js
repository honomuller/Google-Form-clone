const express = require('express')
const cors = require('cors')
const bodyParser =require('body-parser')
const mysql = require('mysql2')
const fs = require('fs')
const path = require('path')
const excel = require('exceljs')
const multer = require('multer')

const user = require('./user')
const db = require('./db')
const answer = require('./answers')
const share = require('./share')
const email = require('./email')
const marks = require('./marks')
const drive = require('./drive')
const otp = require('./otp')



const app = express()

var filestorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'../public/documentAnswer/form/')
    },
    filename:(req,file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null,file.originalname+"-"+uniqueSuffix+path.extname(file.originalname))
    }
})

var upload = multer({
    storage:filestorageEngine,
    
    limits:{
        fileSize: '2mb'
    }
})


app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use('/user',user)
app.use('/answer',answer)
app.use('/share',share)
app.use('/email',email)
app.use('/marks',marks)
app.use('/drive',drive)
app.use('/otp',otp)


var message = ""
app.post('/createForm',upload.single('Image'),(req,res)=>{
    var data = []
    var datab = []
    var datac = false
    var section = JSON.parse(req.body.section)
    var FormName = req.body.FormName
    var Email = req.body.Email
    if(req.file){
        var Image = req.file.filename
    }else{
        var Image = req.body.Image
    }
    var AcceptAnswer = req.body.AcceptAnswer
    var FormDescription = req.body.FormDescription
    var id = req.body.id
    var column_table = []
    section.map(item=> data.push(item.questionName))
    const query = `SELECT * FROM information_schema.tables WHERE table_schema = 'moyapp_db' AND table_name ='${FormName.replace(/\s/g, '')}'`
     db.query(query,(err,resk)=>{
        if(err) throw console.log(err)
            if(resk.length > 0){
                db.query(`SELECT * FROM information_schema.columns WHERE table_name = '${FormName.replace(/\s/g, '')}'`,(err,response)=>{
                    if(err) throw console.log(err)
                        response.map(item=>{
                    column_table.push(item.COLUMN_NAME)
                    })
                    // column_table.slice(3).map(item =>
                    //      data.includes(item) ? "" :
                    //         db.query(`ALTER TABLE ${FormName.replace(/\s/g, '')} DROP COLUMN ${item.replace(/\s/g, '')}`,(err,datas)=>{
                    //             if(err) throw console.log(err)
                    //                 if(datas){
                    //                      datac = true  
                    //                  }
                    //         })
                    // )
                    data.map(item=>{
                        if(column_table.includes(item.replace(/\s/g, ''))){
                            datac = true

                        }else{
                            db.query(`ALTER TABLE ${FormName.replace(/\s/g, '')} ADD COLUMN ${item.replace(/\s/g, '')} TEXT`,(err,datas)=>{
                                if(err) throw console.log(err)
                                    if(datas){
                                        datac = true  
                                    }
                            })
                        }
                    })
                })
                db.query(`UPDATE application SET app_title='${FormName.replace(/\s/g, '')}',filename='${FormName.replace(/\s/g, '')+".xlsx"}' WHERE app_name='${id}'`,(err,ress)=>{
                    if(err) throw console.log(err)
                    datab.push({FormName,FormDescription,Image,Email,section,AcceptAnswer})
                    fs.writeFileSync(`files/${id}.json`,JSON.stringify(datab))
                })
             message = "Form Updated Successfully !!!"
            }else{
                var kok =  false
                const quer = `CREATE TABLE ${FormName.replace(/\s/g, '')} (form_id int NOT NULL AUTO_INCREMENT,status varchar(250),email varchar(250),PRIMARY KEY(form_id))`
                db.query(quer,(err,dats)=>{
                    if(err) throw console.log(err)
                        kok = true
                })
                if(kok==true){
                    db.query(`SELECT * FROM information_schema.columns WHERE table_name = ${FormName.replace(/\s/g, '')}`,(err,response)=>{
                        if(err) throw console.log(err)
                            response.map(item=>{
                        column_table.push(item.COLUMN_NAME)
                        })
                        data.map(item=>{
                            if(column_table.includes(item.replace(/\s/g, ''))){
                                datac = true
                            }else{
                                db.query(`ALTER TABLE ${FormName.replace(/\s/g, '')} ADD COLUMN ${item.replace(/\s/g, '')} TEXT`,(err,datas)=>{
                                    if(err) throw console.log(err)
                                        if(datas){
                                            datac = true  
                                        }
                                })
                            }
                        })
                    })
                }
                
                db.query(`UPDATE application SET app_title='${FormName.replace(/\s/g, '')}',filename='${FormName.replace(/\s/g, '')+".xlsx"}' WHERE app_name='${id}'`,(err,ress)=>{
                    if(err) throw console.log(err)
                        datab.push({FormName,FormDescription,Image,Email,section,AcceptAnswer})
                    fs.writeFileSync(`files/${id}.json`,JSON.stringify(datab))
                })
                 message = "Form Created Successfully !!!"
            }
            res.json({message})
     })

    
})

app.get('/getUserForms/:id',(req,res)=>{
    const id = req.params.id
    db.query(`SELECT * FROM application WHERE user_id=? AND status=1 AND app_name!=''`,[id],(err,data)=>{
        if(err) throw console.log(err)
        res.json(data)
    })
})

app.get('/getUserFormsTrash/:id',(req,res)=>{
    const id = req.params.id
    db.query(`SELECT * FROM application WHERE user_id=? AND status=0`,[id],(err,data)=>{
        if(err) throw console.log(err)
        res.json(data)
    })
})

app.get('/getForm',(req,res)=>{
    const id = req.params.id
    db.query(`SELECT * FROM application`,(err,data)=>{
        if(err) throw console.log(err)
        res.json(data)
    })
})

app.post('/getForm/:id',(req,res)=>{
    const id = req.params.id 
    const question = req.body
    var section = req.body.question.section
    var FormName = req.body.question.FormName
    var fileName = req.body.question.FormName+".xlsx"
    var FormDescription = req.body.question.FormDescription
    var user = req.body.user
    let data = ""
    let data1 = []
    data1.push({question})
    var  message = ""
    //console.log(id)
    if(fs.existsSync(`files/${id}.json`)){
         data = fs.readFileSync(`files/${id}.json`,{ encoding: 'utf8'})
    }else{
        db.query(`INSERT INTO application(app_title,app_name,filename,user_id)VALUES(?,?,?,?)`,[FormName.replace(/\s/g, ''),id,fileName,user],(err,ress)=>{
         if(err) throw console.log(err)
         data = fs.writeFileSync(`files/${id}.json`,JSON.stringify([question.question]))
         message = "form created!!!"
        
    })
    }
    res.send(data)
})

app.post('/deleteForm/:id',(req,res)=>{
    const id = req.params.id
    const query = `UPDATE application SET status=0 WHERE app_id=?`
    db.query(query,[id],(err,data)=>{
        if(err) throw console.log(err)
            message = 'Form Deleted successfully!!!'
            res.json({data,message})
    })
})

app.post('/recoverForm/:id',(req,res)=>{
    const id = req.params.id
    const query = `UPDATE application SET status=1 WHERE app_id=?`
    db.query(query,[id],(err,data)=>{
        if(err) throw console.log(err)
            message = 'Form Restored successfully!!!'
            res.json({data,message})
    })
})

app.get('/getForm/:id',(req,res)=>{
    const id = req.params.id 
    const question = req.body
    let data = ""
    //console.log(id)
    if(fs.existsSync(`files/${id}.json`)){
         data = fs.readFileSync(`files/${id}.json`,{ encoding: 'utf8'})
    }else{
         data = fs.writeFileSync(`files/${id}.json`,JSON.stringify(data))
    }
    res.send(data)
})




app.listen(5000,(err)=>{
    if(err) throw console.log(err)
    console.log('connected')
})
