const express = require('express')
const next = require('next')
const lottery= require("./lottery.js")
const paypal = require('paypal-rest-sdk');
const { check, validationResult } = require('express-validator');
const config=require("config");
const morgan = require('morgan')
const {User, Lottery}=require("./dbConnection/dbConnection.js")
const {getTheTime, getTheDate}=require("./dateAndTime.js")

const port = process.env.PORT|| 3000
const dev = process.env.NODE_ENV !== 'production'
const server = next({ dev })
const handle = server.getRequestHandler()

server.prepare().then(() => {
const app = express()
app.use(express.json());

User.connect();
Lottery.connect();

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': config.get("client_id"),
    'client_secret': config.get("client_secret")
  });

  
//Redirect to payPal
//************************************************************ */
  app.post("/register", (req,res)=>{

     const time=getTheTime();
         
     if(time > "21:59:00" || time < "10:00:00"){
            // return res.status(403).json({fail:"Lottery has closed ..Wait for the next one"}) 
            return server.render(req,res,"/")
     }
 
     const create_payment_json = {
         "intent": "sale",
         "payer": {
             "payment_method": "paypal"
         },
         "redirect_urls": {
             "return_url": "http://localhost:3000/registerToLottery",
             "cancel_url": "http://localhost:3000/cancelByUser"
         },
         "transactions": [{
             "item_list": {
                 "items": [{
                     "name": "lottery",
                     "sku": "001",
                     "price": "5.00",
                     "currency": "EUR",
                     "quantity": 1
                 }]
             },
             "amount": {
                 "currency": "EUR",
                 "total": "5.00"
             },
             "description": "YOU HAVE ENTERED THE LOTTERY GOOD LUCK"
         }]
     };
 
     paypal.payment.create(create_payment_json, function (error, payment) {
         if (error) {
            return server.render(req,res, "/error") 
         } else {
             
             console.log(payment);
             payment.links.forEach(link=>{
                 if(link.rel==="approval_url"){
                     res.redirect(link.href)
                 }
             });
         }
     });
   });

 //Is Lottery open ?
//******************************************************   
app.get("/register", (req,res)=>{
      
    const time=getTheTime();
    //console.log(time)
    if(time > "21:59:00" || time < "10:00:00"){
        
           return res.json({fail:"Lottery has closed ..Wait for the next one"}) 
    }
    return res.json({ok:"ok"});
  });

//Redirect back to site and register to the actual Lottery
//**************************************************** */
app.get("/registerToLottery", async(req, res)=>{

    try{

    const payerId=req.query.PayerID
    const token=req.query.token
    const paymentId=req.query.paymentId

        if(!payerId || !token || !paymentId){
            return server.render(req,res,"/");
        }
      //check if user makes new get request ../avoiding torecharge server if there is already this paymentId  
    const userText='SELECT* FROM lotteries.userentries WHERE paymentid=$1'
    const userValues=[paymentId]
    const data= await Lottery.query(userText, userValues)

    if(data.rows[0]){
        return server.render(req,res,"/enterLottery")
     }
    
     const execute_payment_json = {
        "payer_id":payerId,
        "transactions": [{
            "amount": {
                "currency":"EUR",
                "total": "5.00"
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
        if(error){
            return server.render(req,res, "/error") 
        }else{
            const newEntry=JSON.stringify(payment);
            const newEntryObj=JSON.parse(newEntry);
            
            //Return money to player if the lottery has closed and he has already made the payment request
            const time=getTheTime();

            if(time > "21:50:00" || time < "10:00:00"){
              
                const userText1 = 'SELECT * FROM users.moneyback WHERE paymentid=$1 AND email=$2'
                const userValues1=[newEntryObj.id, newEntryObj.payer.payer_info.email];
                const preventReFee=await User.query(userText1, userValues1);

                if(preventReFee.rows[0]){
                    return server.render(req,res,"/")
                }
                       const userText2 = 'INSERT INTO users.moneyback(paymentid, email) VALUES($1, $2) RETURNING *'
                        const userValues2=[newEntryObj.id, newEntryObj.payer.payer_info.email];
                            
                         await User.query(userText2, userValues2);
                    
                const sender_batch_id = Math.random().toString(36).substring(9);
                const create_payout_json = {
                    "sender_batch_header": {
                        "sender_batch_id": sender_batch_id,
                        "email_subject": "You have a payment"
                    },
                    "items": [
                        {
                            "recipient_type": "EMAIL",
                            "amount": {
                                "value": "4.38",
                                "currency": "EUR"
                            },
                            "receiver": newEntryObj.payer.payer_info.email,
                            "note": "Thank you.",
                            "sender_item_id": "item_3"
                        }
                    ]
                };
                const sync_mode = 'false';

                paypal.payout.create(create_payout_json, sync_mode, function (error, payout) {
                    if (error) {
                        console.log(error.response);
                        throw error;
                    } else {
                        console.log("Create Single Payout Response");
                        console.log(payout);   
                    }
                    
                });
                return server.render(req,res,"/")
                 //return res.status(403).json({fail:`There is no lottery open at the momment. We have returned your money back to your Pay Pal account`})     
            }

             //CREATE RANDOM STRING USERNAME
             const createRandomUsername=(length)=> {
                if(length<=3){
                    while(length<=3){
                  length+=(Math.floor(Math.random() * 12))
                  //console.log(length)
                    }
                }
                 let username = "";
                 let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                 let charactersLength = characters.length;
                 for (let i=0; i<length; i++) {
                    username += characters.charAt(Math.floor(Math.random() * charactersLength));
                 }
              
                 return username;
              }
              let length=(Math.floor(Math.random() * 15))
              const username=createRandomUsername(length);
              const email=newEntryObj.payer.payer_info.email;
              const pass="*******" //Password is not being used
  
                  const userText3 = 'INSERT INTO users.users(username, email, pass) VALUES($1, $2, $3) RETURNING *'
                  const userValues3=[username, email, pass];
                      
                      const userData=await User.query(userText3,userValues3);
                           //console.log(userData)           
                      const paymentId=newEntryObj.id;
                      //const time=getTheTime();
                      const fullDate=getTheDate();
                    
                                          await Lottery.query("UPDATE lotteries.singlelottery SET totalamountofmoney=totalamountofmoney+4.48 WHERE lotteryid=(SELECT MAX(lotteryid) FROM lotteries.singlelottery)")
                          const pendingLot=await Lottery.query("SELECT lotteryid,dateandtimeoflottery FROM  lotteries.singlelottery WHERE lotteryid = (SELECT MAX(lotteryid) FROM lotteries.singlelottery)");
              
                     const userLotteryEntryText="INSERT INTO lotteries.userentries(slotteryid, userid, username, email, paymentId, dateandtimeofuserentry, dateandtimeoflottery) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *"
                     const userLotteryEntryValues=[pendingLot.rows[0].lotteryid, userData.rows[0].userid, username, email, paymentId, `${fullDate}`+` `+`${time}`, pendingLot.rows[0].dateandtimeoflottery] ;
              
                          const userLotteryEntry= await Lottery.query(userLotteryEntryText, userLotteryEntryValues) ; 
                      //res.status(201).json({"user":userData.rows[0], "lotteryEntry":userLotteryEntry.rows[0]});
                      //res.status(201).render("pay.ejs", {username:username, id:userData.rows[0].userid, fail:undefined, updatedUsername:undefined});
                      return server.render(req,res,"/enterLottery")
        }
    })
    }catch(error){
        console.log(error);
        res.status(500).send("Server Error")
    }
})

//GET ALL USERS 
//********************************************** */
app.get("/getUsers",async (req,res)=>{
    try{
         const { rows }=  await Lottery.query("SELECT totalamountofmoney FROM lotteries.singleLottery WHERE lotteryid = (SELECT MAX(lotteryid) FROM lotteries.singlelottery)")
         //console.log(rows)
           if(rows[0].totalamountofmoney==="0.00"){
                return res.json({msg:"There are 0 users entered to this lottery"});
             }
        const usersLottery = await Lottery.query("SELECT username FROM lotteries.userentries WHERE slotteryid = (SELECT MAX(slotteryid) FROM lotteries.userentries) ORDER BY userid desc")
        //console.log(usersLottery.rows)
        //res.json(usersLottery.rows[0])
            res.json({users:usersLottery.rows, money:rows[0].totalamountofmoney})
    }catch(error){
        console.log(error);
            res.status(500).send("Server Error")
    }
})


//CHECK IF USER GOT MONEY BACK
//***************************************** */
app.get("/getUser/:paymentId", async (req,res)=>{
    try{
        const {paymentId}=req.params
        //console.log(paymentId)
        const userText= "SELECT username,userid,paymentid,updatedbyusers FROM lotteries.userentries WHERE paymentId=$1";
        const userValues=[paymentId]
        const user=await Lottery.query(userText, userValues)
        //console.log(user.rows[0])
        if(user.rows[0]){
            res.json(user.rows[0])
        }else{
            res.json({noUser:"send money back"})
        }
            
    }catch(error){
        console.log(error)
        res.status(500).send("Server Error")
    }
});

//UPDATE USER
//********************************** */
app.put("/updateUsername/:id",[check("newUsername", "username must be more than 2 and less than 16 characters").isLength({min:3, max:15}),
                                check("email", "This is not a valid Email").isEmail()], async (req,res)=>{

    try{
        //console.log(req.body)
        const {newUsername, email}=req.body;
        const id=req.params.id
        //console.log(id)
            const userText="SELECT username,email FROM users.users WHERE userid=$1"
            const userValues=[id]
            const usersdb= await User.query(userText, userValues)
           

                let oldUsername=usersdb.rows[0].username
                    console.log(oldUsername)
                    const errors=validationResult(req);
                    if(!errors.isEmpty()){
                        return res.status(400).json({fail: errors.errors[0].msg})
                    }
           if(usersdb.rows[0].email===email){

            const userText1= "SELECT* FROM lotteries.userentries WHERE username=$1 AND slotteryid=(SELECT MAX(slotteryid) FROM lotteries.userentries )"
            const userValues1=[newUsername]
            const data= await Lottery.query(userText1, userValues1)
         
                 //CHECK IF THE USERNAME EXISTS FOR THE CURRENT LOTTERY
                 if(data.rows[0]){
                    return res.status(403).json({fail:`The username ${newUsername} is taken from another user`})
                 }
    
               const upd='updated';
               const udpateUsernameText= "UPDATE users.users SET username=$1, updatedbyusers=$2 WHERE userid=$3 RETURNING *"
               const updateUsername=[newUsername,upd,id];
               const updateUserData=await User.query(udpateUsernameText,updateUsername);
                    //console.log(updateUserData);
                        const newUsername1=updateUserData.rows[0].username
                        //console.log(newUsername1)
                        const udpateUsernameText1= "UPDATE lotteries.userentries SET username=$1, updatedbyusers=$2 WHERE username=$3 RETURNING *"
                        const updateUsername1=[newUsername1,upd, oldUsername];
                     await Lottery.query(udpateUsernameText1, updateUsername1)

                    //res.status(201).render("pay.ejs", {updatedUsername:updateUserData.rows[0].username, id:id, fail:undefined});
                    //return server.render(req,res,"/")
                    res.status(201).json({updatedUsername:updateUserData.rows[0].username, updatedByUsers:updateUserData.rows[0].updatedbyusers})
           }else{
               //const generatedUsername=await Lottery.query(`SELECT username FROM users.users WHERE userid=${id}`)
            res.status(400).json({fail:"The email that you submitted doesnt match with the paypal acount email"})
           } 
   
    }catch(error){
        console.log(error)
        res.status(500).send("Server Error")
    }
});

//GET WINNER
//***************************** */
app.get("/winner",async (req,res)=>{
    //console.log("winner")
     try{
         let fullDate
         const date= new Date()
         
         const time=getTheTime()
 
         let day=date.getDate()
         let month=date.getMonth()+1
         let year=date.getFullYear()
        
         if (day < 10) {
           day ="0"+ day;
         } 
         if (month < 10) {
           month ="0"+ month;
         }
         //console.log(month)
                 if(time > "22:01:00"){
                    fullDate=day+"/"+month+"/"+year;
                    
                 }else{
                     let previousDay
                     if((day-1)===0 && (month==="01" || month==="02" || month==="04" || month==="06" || month==="08" || month==="09" || month==="11")){
                         previousDay="31"
                         month=month-"01"
                        // console.log(month)
                         //if(month<10) month="0"+ month
                     }
                     else if((day-1)===0 && (month==="05" || month==="07" || month==="04" || month==="10" || month==="12")){
                         previousDay="30"
                         month=month-"01"
                     }
                     else if((day-1)===0 && (month==="03")){
                         const leapYear= ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
                             if(leapYear){
                                 previousDay="29"
                             }else{
                                 previousDay="28"    
                             }
                             month=month-"01"
                     }
                    else{
                         if(day<10) {
                             previousDay="0"+(day-1)
                         }else{
                             previousDay=day-1
                         }    
                    }
                     fullDate= previousDay +"/"+month+"/"+year;
                 }
               
         //console.log(fullDate)
         const winnerText="SELECT winner,totalamountofmoney,lotteryid FROM lotteries.singlelottery WHERE dateandtimeofopening LIKE upper('%' || $1 || '%')"
         const winnerValues=[fullDate]
         const win= await Lottery.query(winnerText, winnerValues)
         //console.log(win)
         if(win.rows.length===0) return ;
             const {winner, totalamountofmoney, lotteryid}=win.rows[0]
                 res.json({winner , totalamountofmoney, lotteryid})
     }catch(error){
         console.log(error)
     }  
 });

 //GET LOTTERIES
//********************************* */
 app.get("/lotteries", async (req, res)=>{
    
    try{
        const lotteries= await Lottery.query("SELECT lotteryid AS Lottery_No , dateandtimeoflottery AS Date, winner, totalamountofmoney AS Has_Won FROM lotteries.singlelottery ORDER BY lotteryid DESC")
        res.json(lotteries.rows)
    }catch(error){
        console.log(error)
    }
})

app.all('*', (req, res) => {
    return handle(req, res)
});


setInterval(lottery,1000)

app.listen(port, () => {
    console.log(`Ready on http://localhost:${port}`)
  })
})