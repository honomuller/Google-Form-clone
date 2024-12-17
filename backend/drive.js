const express = require('express')
const fs = require('fs')
const path = require('path')
const db = require('./db')
const multer = require('multer')


const route = express.Router()

var filestorageEngine = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'../public/fileAnswer/')
    },
    filename:(req,file,cb)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null,file.originalname+"-"+uniqueSuffix+ path.extname(file.originalname))
    }
})

var message = ''

var upload = multer({
    storage:filestorageEngine,
    fileFilter: function (req, file, callback) {
        if(file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/msword' ||
            file.mimetype === 'application/vnd.ms-excel' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'||
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg') {
                callback(null,true)
        }else{
            callback(null, false)
        }
        
    },
    limits:{
        fileSize: '2mb'
    }
})

var message = ''

route.get('/getFiles/:id',(req,res)=>{
    const id = req.params.id
    db.query('SELECT * FROM application WHERE user_id=? AND status=1',[id],(err,response)=>{
        if(err) throw console.log(err)
            if(response.length>0){
                if(!fs.existsSync(`../public/fileAnswer/${response[0].filename}`)){
                    message = 'No file in the Your Drive'
                }
            }
            res.json(response)
    })
})

route.post('/createFolder',(req,res)=>{
    const name = req.body.name
    const user = req.body.user
    db.query('INSERT INTO folders(folder_name,user_id)VALUES(?,?)',[name,user],(err,response)=>{
        if(err) throw console.log(err)
            message = "Folder Created Successfully!!!"
        res.json(message)
    })
})

route.get('/getFolder/:id',(req,res)=>{
    const id = req.params.id
    db.query('SELECT * FROM folders WHERE user_id=? and status=1',[id],(err,response)=>{
        if(err) throw console.log(err)
            res.json(response)
    })
})

route.get('/getFolder',(req,res)=>{
    const id = req.params.id
    db.query('SELECT * FROM folders',[id],(err,response)=>{
        if(err) throw console.log(err)
            res.json(response)
    })
})

route.put('/deleteFolder/:id',(req,res)=>{
    const id = req.params.id
    db.query('UPDATE folders SET status=0 WHERE folder_id=?',[id],(err,response)=>{
        if(err) throw console.log(err)
            message=" Folder deleted Successfully!!"
        res.json(message)
    })
})

route.put('/restoreFolder/:id',(req,res)=>{
    const id = req.params.id
    db.query('UPDATE folders SET status=1 WHERE folder_id=?',[id],(err,response)=>{
        if(err) throw console.log(err)
            message=" Folder restored Successfully!!"
        res.json(message)
    })
})

route.put('/moveFileFolder/:id',(req,res)=>{
    const id = req.params.id
    const folder = req.body.folder
    db.query('UPDATE application SET folder_id=? WHERE app_id=?',[folder,id],(err,response)=>{
        if(err) throw console.log(err)
            message="File moved to Folder Successfully!!"
        res.json(message)
    })
})

route.get('/deletedFolder/:id',(req,res)=>{
    const id = req.params.id
    db.query('SELECT * FROM folders WHERE user_id=? and status=0',[id],(err,response)=>{
        if(err) throw console.log(err)
            res.json(response)
    })
})


route.delete('/deleteFile/:id',(req,res)=>{
    const id = req.params.id
    db.query('SELECT * FROM application WHERE app_id=?',[id],(err,response)=>{
        if(err) throw console.log(err)
            if(response.length>0){
                if(fs.existsSync(`../public/fileAnswer/${response[0].filename}`)){
                    fs.unlink(`../public/fileAnswer/${response[0].filename}`,(err => {
                        if(err) throw console.log(err)
                            db.query('SELECT * FROM application WHERE app_id=?',[id],(err,response)=>{
                                if(err) throw console.log(err)
                            if(response[0].app_title !=''){
                                db.query(`DROP TABLE IF EXISTS ${response[0].app_title}`,(err,dtt)=>{
                                    if(err) throw console.log(err)
                                        message = 'Form Deleted Successfully!!'
                                })
                            }
                            db.query('DELETE FROM application WHERE app_id=?',[id],(err,dt)=>{
                                if(err) throw console.log(err)
                                  message = 'File Deleted Successfully!!'
                           })
                            
                        })
    
                    }))
                   
                }else{
                    db.query('SELECT * FROM application WHERE app_id=?',[id],(err,response)=>{
                        if(err) throw console.log(err)
                            if(response[0].app_title != ''){
                                db.query(`DROP TABLE IF EXISTS ${response[0].app_title}`,(err,dtt)=>{
                                    if(err) throw console.log(err)
                                        message = 'Form Deleted Successfully!!'
                                })
                            }
                            db.query('DELETE FROM application WHERE app_id=?',[id],(err,dt)=>{
                                if(err) throw console.log(err)
                                    message = 'Form Table Deleted Successfully!!'
                            })
                            
                    })
                    
                }
                
                if(fs.existsSync(`files/${response[0].filename}`)){
                    fs.unlink(`files/${response[0].filename}`,(err => {
                        if(err) throw console.log(err)
                            db.query('SELECT * FROM application WHERE app_id=?',[id],(err,response)=>{
                                if(err) throw console.log(err)
                                    if(response[0].app_title != ''){
                                        db.query(`DROP TABLE IF EXISTS ${response[0].app_title}`,(err,dtt)=>{
                                            if(err) throw console.log(err)

                                                message = 'Form Deleted Successfully!!'
                                        })
                                    }
                                    db.query('DELETE FROM application WHERE app_id=?',[id],(err,dt)=>{
                                        if(err) throw console.log(err)
                                            message = 'File Deleted Successfully!!'
                                    })
                               
                             })
                            
                        
                    }))
                    
                }else{
                    db.query('SELECT * FROM application WHERE app_id=?',[id],(err,response)=>{
                        if(err) throw console.log(err)
                            if(response[0].app_title != ''){
                                db.query(`DROP TABLE IF EXISTS ${response[0].app_title}`,(err,dtt)=>{
                                    if(err) throw console.log(err)
                                        ji = true
                                        message = 'Form Deleted Successfully!!'
                                })
                            }
                            db.query('DELETE FROM application WHERE app_id=?',[id],(err,dt)=>{
                                if(err) throw console.log(err)
                                     ki = true
                                    message = 'Form Table Deleted Successfully!!'
                            })
                            
                    })
                  
                }
               
                res.json(message)
            }
        })
})



route.put('/deleteFile/:id',(req,res)=>{
    const id = req.params.id
    db.query('SELECT * FROM application WHERE app_id=?',[id],(err,response)=>{
        if(err) throw console.log(err)
            //console.log(response[0].filename)
            //fs.unlink(`../public/fileAnswer/${response[0].filename}`,(err => {
                if (err) console.log(err);
                db.query('UPDATE application SET status=0 WHERE app_id=?',[id],(err,resp)=>{
                    if(err) throw console.log(err)
                        message="File Deleted Successfully!!"
                        res.json(message)
                })
            //}))       
       })
   
})

route.put('/restoreFile/:id',(req,res)=>{
    const id = req.params.id
    db.query('UPDATE application SET status=1 WHERE app_id=?',[id],(err,resp)=>{
        if(err) throw console.log(err)
            message="File Restored Successfully!!"
            res.json(message)
    })
})

route.get('/sharedFile/:id',(req,res)=>{
    const user = req.params.id
    // db.query('SELECT * FROM shared_app WHERE user_id=?',[user],(err,response)=>{
    //     if(err) throw console.log(err)
    //         if(response.length>0){
                db.query('SELECT application.*,shared_app.* FROM application,shared_app WHERE application.app_id=shared_app.app_id AND application.status=1 AND shared_app.user_id=?',[user],(err,respons)=>{
                    if(err) throw console.log(err)
                        if(respons.length>0){
                            if(fs.readFileSync(`../public/fileAnswer/${respons[0].filename}`)){
                                res.json(respons)
                            }
                        } 
                })
    //         }
    // })
})

route.post('/uploadFile',upload.single('file'),(req,res)=>{
    const user = req.body.user
    const name = req.file.filename
    if(req.file.filename === ''){
        message = 'File not Uploaded!!'
    }
    db.query('INSERT INTO application(filename,user_id)VALUES(?,?)',[name,user],(err,response)=>{
        if(err) throw console.log(err)
            if(response.length>=0){
                message = 'File uploaded Successfully!!!'
            }
        res.json(message)
    })
})

route.get('/getFile/:id',(req,res)=>{
    const id = req.params.id
    db.query('SELECT * FROM application WHERE status=1 AND user_id=?',[id],(err,response)=>{
        if(err) throw console.log(err)
            // response.map(item=>{
            //  if(fs.existsSync(`../public/fileAnswer/${item.filename}`)){
            //         message = 'No file'
            //     } 
            // }) 
            res.json({response,message})  
    })
})

route.get('/deletedFile/:id',(req,res)=>{
    const id = req.params.id
    db.query('SELECT * FROM application WHERE status=0 AND user_id=?',[id],(err,response)=>{
        if(err) throw console.log(err)
            res.json(response)  
    })
})

module.exports = route