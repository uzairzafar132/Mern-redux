const Pool =require("pg").Pool

const pool= new Pool({
    user:"postgres",
    // password:"faizan12",
    host:process.env.HOST,
    port: process.env.DBPORT,
    database:'todoapp'
})


pool.connect((err)=>{
    if(err){
        console.error(err.stack)
    }else{
        console.log("connected")
    }
})
module.exports =pool