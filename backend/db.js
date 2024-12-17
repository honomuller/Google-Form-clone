const mysql = require('mysql2')

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"moyapp_db"
})

db.connect((err)=>{
    if(err) throw console.log(err)
        console.log("db connected!")
})

module.exports = db

