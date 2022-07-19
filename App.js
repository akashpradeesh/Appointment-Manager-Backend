const express = require("express");
// const { userTable, userDetailTable } = require("./UserTable");
const app = express();
app.use(express.json());
const Cryptr = require('cryptr'),
cryptr = new Cryptr('akash');
const {Client} = require("pg");
const client =new Client({
host: "localhost",
port: "5432",
user:"postgres",
database:"appointmentManager",
password: "Akash123@"
})

client.connect();

app.get(`/userDatabase`,(req,res)=>{
    client.query("select * from \"user detail table\"",(err,result)=>{
        if(!err){
            // console.log('success')
            res.send(result.rows)
        }
    })
})
app.post(`/DateChange`,(req,res)=>{
    const  detail = req.body.dateChange
    const user = req.body.userName
    console.log(user)
    console.log(detail)
    // const date = detail.date
    // const event = detail.events
    client.query(`UPDATE "user detail table" SET date =$1 WHERE username =$2 and event =$3`,[detail.date,user,detail.events],(err,result)=>{
        if(!err){
            console.log("success")
        }
    })
})
app.delete(`/handleDeleteAdmin`,(req,res)=>{
    const temp = req.query
    console.log(temp.event)
    client.query(`delete from \"user detail table\" where username=$1 and date=$2`,[temp.key2,temp.key3],(err,result)=>{
        if(!err){
            console.log("success")
        }else{
            console.log("error")
        }
    })
    client.end;
})
app.get('/singleUserDetail',(req,res)=>{
    const user = req.query.name
    // console.log(user)
    client.query("select * from \"user detail table\" where username =$1",[user],(err,result)=>{
        if(!err){
            // console.log(result.rows)
            res.send(result.rows)
        }else{
            console.log("error")
        }
        client.end;
    })
    
})
app.delete(`/handleDelete`,(req,res)=>{
    const actions = req.query;

    console.log(actions)
    client.query(`delete from \"user detail table\" where username = $1 and event= $2 `,[actions.key4,actions.key3],(err,result)=>{
        if(!err){
            console.log(result)
        }else{
            console.log(err)
        }
        
    })
    client.end;   
    
})
// const loginCondition = (result)=>{

//     let status = false
//     if(result.length<1 ){
//         console.log(result.length)
//     status= true
//     return status
//     }else{
//         return status  
//     }
// }

app.post('/loginUser',((req,res)=>{
    const newUser = req.body
    let status = true
    console.log(newUser.password)
    
    // client.query(`select * from \"userTable\" where username =$1 and password=$2`,[newUser.email,newUser.password],(err,result)=>{
        client.query(`select * from \"userTable\" where username =$1`,[newUser.email],(err,result)=>{
        if(!err){
           const temp = result.rows;
           console.log(temp)
           console.log(temp[0].password);
           const pswd = cryptr.decrypt(temp[0].password)
           console.log(pswd);
           if(pswd === newUser.password){
            status = false
            res.send(status)
           }else{
            res.send(status)
           }


        //    const status= loginCondition(result.rows);
        //     res.send(status);
        }else{
            console.log(err)
        }
        client.end
    })
}));
app.post('/newAppointment',((req,res)=>{
    console.log(req.body.userdetail)
    const data = req.body.userdetail
    const date = data.Date
    const event = data.Event
    const name = data.Name
    // console.log(name)
    // const userName = req.body.name
    client.query("insert into \"user detail table\" values($1,$2,$3)",[name,date,event],((err,result)=>{
        if(!err){
            console.log("sucess")
            

        }else{
            console.log('failed')
        }
        client.end;
    }))
}))
// app.post('/newAppointment',((req,res)=>{
//     const data = req.body.userdetail
//     // console.log(data)
//     const user = req.body.name
//     userDetailTable.key(user).push(data)
//     res.send(userDetailTable[index])
//     console.log(userDetailTable[index])
// }))
// app.get('/userTableDetails',((req,res)=>{
//     const newData = req.query.name
//     // console.log(newData)
//     const result = userDetailTable.filter((data)=>{
//         return data.key === newData  
//     })
//     // console.log(index)
//    res.send(result[0].value)
// //    console.log(result[0].value)
// //    console.log(userDetailTable[index])
  
// }))
// app.get('/userDataBase',(req,res)=>{
//     res.send(userDetailTable)
// })


app.post('/newUser',((req,res)=>{
    const newUsers =req.body
    const mail = newUsers.email
    const pswd = newUsers.password
    const encryptedpswd = cryptr.encrypt(pswd);
    console.log(encryptedpswd);
    // console.log(pswd)
    let status = false
    client.query(`insert into "userTable" values($1,$2)` ,[mail,encryptedpswd],((err,result)=>{
        if(!err){
            res.send(status)
            // console.log(result.rows)
        }else{
            status= true;
            res.send(status);
           
            // console.log(result)
        }
        client.end();
    }))}))

    
    

//     for(let i in userTable){
//         if (userTable[i].email===newUser.email){

//             status=true;
            
//             break;
//         }
//     }
//     if(status===false){
//         userTable.push(newUser)
//     }
//     res.send(status)

// }))
const PORT = process.env.PORT || 8085;

app.listen(PORT, console.log(`Server started on port ${PORT}`));