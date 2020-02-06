const paypal =require('paypal-rest-sdk');
const { Lottery }=require("./dbConnection/dbConnection.js")
const config=require("config");
const doLottery=require("./algorithm.js")
const sendEmailToWinner=require("./emails.js")
const {getTheTime, getTheDate}=require("./dateAndTime.js")

//Lottery.connect();

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': config.get("client_id"),
    'client_secret': config.get("client_secret")
  });

const lottery=async ()=>{

    try{
        const time=getTheTime();
        //console.log(time)
    if(time==="10:00:00"){       
      
        const fullDate=getTheDate();
   
    const text = 'INSERT INTO lotteries.singlelottery(dateandtimeofopening, dateandtimeofclosing, dateandtimeoflottery, totalamountofmoney) VALUES($1, $2, $3, $4) RETURNING *'
    const values=[`${fullDate}`+` `+`${time}`, `${fullDate} 21:59:00`,`${fullDate} 22:00:00`, 0]
        const createdLottery=await Lottery.query(text, values)

        console.log(createdLottery.rows[0])
    }
    if(time==="22:00:00"){

        const lotteryid= await Lottery.query("SELECT lotteryid,totalamountofmoney FROM  lotteries.singlelottery WHERE lotteryid = (SELECT MAX(lotteryid) FROM lotteries.singlelottery)")

        if(lotteryid.rows[0].totalamountofmoney==0.00){
            await Lottery.query(`UPDATE lotteries.singlelottery SET winner='NoEntries' WHERE lotteryid=${lotteryid.rows[0].lotteryid}`)
            return ;
        }else{
           const users=await Lottery.query(`SELECT username FROM  lotteries.userentries WHERE slotteryid =(SELECT MAX(slotteryid) FROM lotteries.userentries )`) 
                const winner=doLottery(users.rows).join("");

           const emailAndPaymentId= await Lottery.query(`SELECT paymentid, email FROM  lotteries.userentries WHERE username='${winner}'`)
                const emailWinner=emailAndPaymentId.rows[0].email;

           await Lottery.query(`UPDATE lotteries.singlelottery SET winner='${winner}', winnerpaymentid='${emailAndPaymentId.rows[0].paymentid}' WHERE lotteryid=(SELECT MAX(lotteryid) FROM lotteries.singlelottery)`)

           const totalMoney=await Lottery.query("SELECT totalamountofmoney FROM lotteries.singlelottery WHERE lotteryid=(SELECT MAX(lotteryid) FROM lotteries.singlelottery)")
                const appFee=totalMoney.rows[0].totalamountofmoney * 5/100
                const winnerFinalPrize=(totalMoney.rows[0].totalamountofmoney - appFee)-0.35 *3.4/100
                const wfp=winnerFinalPrize.toFixed(2)

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
                                "value": wfp,
                                "currency": "EUR"
                            },
                            "receiver": emailWinner,
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

                sendEmailToWinner(wfp, emailWinner, winner)
        }
    }
    }catch(error){
        console.log(error)
    }      
}

module.exports=lottery