const express = require("express")
const multer = require('multer')
const excel = require('exceljs')
const fs = require('fs')
const path = require('path')
const { table } = require("console")
const db = require('./db')
//const importg = require('../public/answers')
// path.join(DIR, 'foo', undefined)

const route = express.Router()


var filestorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'../public/documentAnswer/')
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

var message = ''

route.post("/Formanswers/:id",upload.array('file',12),(req,res)=>{
    const answer = req.body
    const file = req.files
    var answerData = JSON.parse(answer.answerData)
    var answr = [answerData]
    var column = []
    Object.keys(answerData).map((item,index)=>{
       column.push( {"header":item, "key": item},)
    })
    var workbook = new excel.Workbook()

    if(fs.existsSync(`../public/fileAnswer/${answer.formName}.xlsx`)){
    workbook.xlsx.readFile(`../public/fileAnswer/${answer.formName}.xlsx`)
    .then(function() {
        var worksheet = workbook.getWorksheet(`${answer.formName}`);
        var lastRow = worksheet.lastRow;
        var getRowInsert = worksheet.getRow(++(lastRow.number));
        var i = 0
        Object.values(answerData).map((item,index)=>{
            var id = index++
            if(JSON.stringify(item)==='{}'){
               item = 'http://localhost:5000/documentAnswer/'+ file[i++].filename
            } 
            var a = String.fromCharCode('A'.charCodeAt() + id) 
            getRowInsert.getCell(a).value = item;
        })
        getRowInsert.commit();
        return workbook.xlsx.writeFile(`../public/fileAnswer/${answer.formName}.xlsx`);
    });
    }else{
    const worksheett = workbook.addWorksheet(`${answer.formName}`)
    worksheett.columns = [ ...column]
    worksheett.columns.forEach(column=>{
        column.width = column.header.length < 12 ? 12 : column.header.length
    })
    worksheett.getRow(1).font = {bold:true}
     var i = 0
    answr.forEach((e,index)=>{
         Object.keys(e).map(item=>{
            if(JSON.stringify(e[item])==='{}'){
                e[item]='http://localhost:5000/documentAnswer/'+ file[i++].filename 
            }
        })
        worksheett.addRow({...e})
     })
     workbook.xlsx.writeFile(`../public/fileAnswer/${answer.formName}.xlsx`)
    }
})


route.post('/createFormTable/:id',upload.array('file',12),(req,res)=>{
    var answer = req.body
    var file = req.files
    var answerData = JSON.parse(answer.answerData)
    var formName = answer.formName
    var answr = [answerData]
    var datab = []
    var datav = []
    var column_table = []
    var data1 = Object.keys(JSON.parse(answer.answerData))
    var datac = false
    var values = {}

    db.query(`SELECT * FROM ${formName.replace(/\s/g, '')} WHERE email='${answerData.email}'`,(err,gk)=>{
        if(err) throw console.log(err)
            if(gk.length>0){
                message= 'Email already Exists!!!'
            }else{
        const query = `SELECT * FROM information_schema.tables WHERE table_schema = 'moyapp_db' AND table_name =?`
         db.query(query,[`${formName.replace(/\s/g, '')}`],(err,res)=>{
        if(err) throw console.log(err)
            if(res.length >=0){
                const quer = `select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME=?`
                db.query(quer,[`${formName.replace(/\s/g, '')}`],(err,response)=>{
                if(err) throw console.log(err)
                    response.map(ite=>{
                       column_table.push(ite.COLUMN_NAME)
                    })
                    data1.map(item=>{
                        if(column_table.includes(item.replace(/\s/g, ''))){ 
                            datac = true
                        }else{
                        db.query(`ALTER TABLE ? ADD COLUMN ? varchar(2500)`,[`${formName.replace(/\s/g, '')},${item.replace(/\s/g, '')}`],(err,rd)=>{
                            if(err) throw console.log(err)
                            console.log(rd)
                           if(rd){
                            datac = true
                           }
                        })
                        }
                    })
                })
             
                const column = JSON.stringify(data1).replace(/\s/g, '').replace(/\[/g," ").replace(/\]/g," ").replace(/"/g,"").replace(/'/g,"")
                for(let i = 0 ;i<Object.values(data1).length;i++){
                    datab.push('?')
                }
                const value = JSON.stringify(datab).replace(/\s/g, '').replace(/\[/g," ").replace(/\]/g," ").replace(/"/g,"").replace(/'/g,"")
                var i = 0
                answr.forEach((e,index)=>{
                    Object.keys(e).map(item=>{
                       if(JSON.stringify(e[item])==='{}'){
                           e[item]=file[i++].filename 
                       }
                       if(Array.isArray(e[item])){
                        e[item]=JSON.stringify(e[item]).replace(/]|[[]|"/g, '',)
                       }
                   })
                   datav.push({...e})
                })
                datav.map(item=> values = Object.values(item))
                // console.log(data1)
                db.query(`INSERT INTO ${formName.replace(/\s/g, '')}(${column})VALUE(${value})`,values,(err,data)=>{
                    if(err) throw console.log(err)
                    message = "Data well inserted!!!"
                })
                
            }else{
                const g = `CREATE TABLE ? (form_id int NOT NULL AUTO_INCREMENT,status varchar(250) DEFAULT 'Submitted',email varchar(250),PRIMARY KEY(form_id))`
                db.query(g,[`${formName.replace(/\s/g, '')}`],(err,ress)=>{
                    if(err) throw console.log(err)
                    if(ress){
                        const quer = `select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME=?`
                        db.query(quer,[`${formName.replace(/\s/g, '')}`],(err,response)=>{
                        if(err) throw console.log(err)
                            response.map(ite=>{
                               column_table.push(ite.COLUMN_NAME)
                            })
                            data1.map(item=>{
                                if(column_table.includes(item.replace(/\s/g, ''))){ 
                                    datac = true
                                }else{
                                db.query(`ALTER TABLE ? ADD COLUMN ? varchar(2500)`,[`${formName.replace(/\s/g, '')},${item.replace(/\s/g, '')}`],(err,rd)=>{
                                    if(err) throw console.log(err)
                                    console.log(rd)
                                   if(rd){
                                    datac = true
                                   }
                                })
                                }
                            })
                        })
                    }
                })
                
                const column = JSON.stringify(data1).replace(/\s/g, '').replace(/\[/g," ").replace(/\]/g," ").replace(/"/g,"").replace(/'/g,"")
                for(let i = 0 ;i<Object.values(data1).length;i++){
                    datab.push('?')
                }
                const value = JSON.stringify(datab).replace(/\s/g, '').replace(/\[/g," ").replace(/\]/g," ").replace(/"/g,"").replace(/'/g,"")
                var i = 0
                answr.forEach((e,index)=>{
                    Object.keys(e).map(item=>{
                       if(JSON.stringify(e[item])==='{}'){
                           e[item]=file[i++].filename 
                       }
                       if(Array.isArray(e[item])){
                        e[item]=JSON.stringify(e[item]).replace(/]|[[]|"/g, '',)
                       }
                   })
                   datav.push({...e})
                })
                datav.map(item=> values = Object.values(item))
                db.query(`INSERT INTO ${formName.replace(/\s/g, '')}(${column})VALUE(${value})`,values,(err,data)=>{
                    if(err) throw console.log(err)
                    message = "Data well inserted!!!"
                })
                
            }
           
         })
        }
            res.json(message)
    })
   
})

route.get('/getExcelSheet/:id',(req,res)=>{
    const id = req.params.id
    var column = []
    var jpg = '.jpg'
    var jpeg = '.jpeg'
    var png = '.png'
    db.query(`SELECT * FROM application WHERE app_name='${id}'`,(err,ress)=>{
        if(err) throw console.log(err)
        if(ress[0].app_title){
                    const qury = `select * from ${ress[0].app_title}`
                    db.query(qury,(err,dt)=>{
                         if(err) throw console.log(err)
                            Object.values(dt).slice(0,1).map((item,inde)=>{
                                Object.keys(item).map((ite,index)=>{
                                   column.push({"header":ite,"key":ite})
                                })
                            })
                    var workbook = new excel.Workbook()
                    var worksheet = workbook.addWorksheet(`${ress[0].app_title}`)
                    worksheet.columns = [ ...column]
                    worksheet.columns.forEach(columnk=>{
                    columnk.width = columnk.header.length < 12 ? 12 : columnk.header.length
                    })
                    worksheet.getRow(1).font = {bold:true}
                    var lastRow = worksheet.lastRow;
                    var id = 1 
                            Object.values(dt).map((item,inde)=>{
                                var ok = id++
                                var getRowInsert = worksheet.getRow((lastRow.number)+ok);
                                Object.values(item).map((item,index)=>{
                                     var id = index++
                                     var a = String.fromCharCode('A'.charCodeAt() + id) 
                                     if(`${item}`.includes(jpg) ||  `${item}`.includes(png) ||  `${item}`.includes(jpeg) ){
                                        item='http://localhost:3000/documentAnswer/'+ item
                                      }
                                     getRowInsert.getCell(a).value = item;
                                }) 
                                getRowInsert.commit();
                                workbook.xlsx.writeFile(`../public/fileAnswer/${ress[0].app_title}.xlsx`)
                                message='ExcelSheet Generated Successfully!!'
                            })
                           
                      })
            }
            res.json(message)
        })
})

route.get('/getFormData/:id',(req,res)=>{
    const id = req.params.id
    //const name = req.body.formName
    const quer = `SELECT * FROM application WHERE app_name='${id}'`
    db.query(quer,(err,ress)=>{
        if(err) throw console.log(err)
            if(ress[0].app_title){
                const query = `SELECT * FROM ${ress[0].app_title.replace(/\s/g, '')}`
                db.query(query,(err,data)=>{
                    if(err) throw console.log(err)
                        res.json(data)
                })
        }
    })
    
})

route.get('/getFormData/:id/:idi',(req,res)=>{
    const id = req.params.id
    const idi = req.params.idi
    //const name = req.body.formName
    const quer = `SELECT * FROM application WHERE app_name='${id}'`
    db.query(quer,(err,ress)=>{
        if(err) throw console.log(err)
            if(ress[0].app_title){
                const query = `SELECT * FROM ${ress[0].app_title.replace(/\s/g, '')} WHERE form_id=${idi}`
                db.query(query,(err,data)=>{
                    if(err) throw console.log(err)
                        res.json(data)
                })
        }
    })
    
})

route.post('/changeStatus',(req,res)=>{
    const id=req.body.id
    const action=req.body.action
    const formName=req.body.formName
    var message = ''
    const qur = `SELECT * FROM application WHERE app_title='${formName}'`
    db.query(qur,(err,dat)=>{
        if(err) throw console.log(err)
            if(dat.length>0){
                const pp = `SELECT * FROM responsemail WHERE app_id=${dat[0].app_id} and type='${action}'`
                db.query(pp,(err,dta)=>{
                    if(err) throw console.log(err)
                        //console.log(dta[0].email)
                })
            }else{
                 message =' Email not Sent !!!'
            }
    })
    const query=`UPDATE ${formName} SET status='${action}' WHERE form_id=${id}`
    db.query(query,(err,data)=>{
        if(err) throw console.log(err)
            message ='Status Update Successfully!!'
        res.json(message)
    })
})

route.get('/getDownloadExcel/:id',(req,res)=>{
    const id = req.params.id 
    var column = []
    db.query(`SELECT * FROM application WHERE app_name='${id}'`,(err,ress)=>{
        if(err) throw console.log(err)
        if(ress[0].app_title){
                    const qury = `select * from ${ress[0].app_title}`
                    db.query(qury,(err,dt)=>{
                         if(err) throw console.log(err)
                            Object.values(dt).slice(0,1).map((item,inde)=>{
                                Object.keys(item).map((ite,index)=>{
                                   column.push({"header":ite,"key":ite})
                                })
                            })
                    var workbook = new excel.Workbook()
                    var worksheet = workbook.addWorksheet(`${ress[0].app_title}`)
                    worksheet.columns = [ ...column]
                    worksheet.columns.forEach(columnk=>{
                    columnk.width = columnk.header.length < 12 ? 12 : columnk.header.length
                    })
                    worksheet.getRow(1).font = {bold:true}
                    var lastRow = worksheet.lastRow;
                    var id = 1 
                            Object.values(dt).map((item,inde)=>{
                                var ok = id++
                                var getRowInsert = worksheet.getRow((lastRow.number)+ok);
                                Object.values(item).map((item,index)=>{
                                     var id = index++
                                     var a = String.fromCharCode('A'.charCodeAt() + id) 
                                     getRowInsert.getCell(a).value = item;
                                }) 
                                getRowInsert.commit();
                                workbook.xlsx.writeFile(`../public/fileAnswer/${ress[0].app_title}.xlsx`)
                                message='ExcelSheet Generated Successfully!!'
                            })
                            if(fs.existsSync(`../public/fileAnswer/${ress[0].app_title}.xlsx`)){
                                res.send(`${ress[0].app_title}.xlsx`)
                            } 
                    })
                }
            })
})

module.exports = route