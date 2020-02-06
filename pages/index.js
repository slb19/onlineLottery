import React,{useState, useEffect,Fragment} from 'react'
import { withRouter } from 'next/router'
import Head from 'next/head';
//import "materialize-css/dist/css/materialize.min.css";
import EnterLotteryButton from "../components/EnterLotteryButton.js"
import Navbar from "../components/layout/Navbar.js"
import Spinner from "../components/layout/Spinner.js" 
import Description from '../components/Description.js';
import PreviousLotteries from '../components/PreviousLotteries.js';
import Contact from '../components/Contact.js';
import Spinner2 from "../components/layout/Spinner2.js" 
import PreviousLotteriesState from "../context/previousLotteries/previousLotteriesState.js"

const Index=(props)=>{

    const { router } = props
    // console.log(router.query.paymentId)
     const paymentId=router.query.paymentId
    //console.log(paymentId)

    const [errorRegister, setErrorRegister]=useState(false)
    const [moneyBack, setMoneyBack]=useState(false)   
    const [users, setUsers]=useState([])
    const [money, setMoney]=useState(0)
    const [loading, setLoading]=useState(false)
    const [loading2, setLoading2]=useState(false)
    const [winner, setWinner]=useState({
        username:"",
        moneyWon:"",
        lotteryid:"" 
    })
    const [countdown, setCountdown]=useState({
        hours:"",
        minutes:"",
        seconds:""
    });

    const [sideShow , setSideShow]=useState({
        description:true,
        previousLotteries:false,
        contact:false
    })

    //console.log(countdown)
   //console.log(winner)
    useEffect(()=>{
        if(paymentId) getMoneyBack(paymentId)
           if(!loading) getWinner();
        //
       // console.log("useeffect")        
    },[paymentId, loading]);

    useEffect(()=>{
       
        getAllUsers()

        setInterval(()=>{
            const hours=("0"+getCountdown().hours).slice(-2)
            const minutes=("0"+ getCountdown().minutes).slice(-2)
            const seconds=("0"+ getCountdown().seconds).slice(-2)
                //console.log(hours , minutes, seconds) 
            setCountdown({hours , minutes, seconds})
         },1000)

    },[])

    useEffect(()=>{
        if(sideShow.description) setLoading2(false)
        if(sideShow.previousLotteries) setLoading2(false)
        if(sideShow.contact) setLoading2(false)
    },[sideShow])

    const registerHandler=()=>{
  
        fetch("http://localhost:3000/register", {
            method:"GET"
         }).then(res=>{
             return res.json()
         }).then(data=>{
             //console.log(data)
             if(data.fail){
                setErrorRegister(true);   
             }else{
                //setUser({...user, init:true})
                setErrorRegister(false)
             }   
         }).catch(error=>{
             console.log(error)    
         });
     }

     const getMoneyBack=(paymentId)=>{
        fetch(`http://localhost:3000/getUser/${paymentId}`, {
           method:"GET" 
        }).then(res=>{
            return res.json()
        }).then(data=>{
            //console.log(data)
            if(data.noUser==="send money back"){
              setMoneyBack(true)
            }else{
                return ; 
            }       
        }).catch(error=>{
            console.log(error)
        });
    }

    const getAllUsers=()=>{
        //console.log("frm get All Users")
        fetch("http://localhost:3000/getUsers", {
            method:"GET"
        }).then(res=>{
            return res.json()
        }).then(data=>{
            if(data.msg){
                return ;
            }else{
                setUsers([...data.users.map(user=>{
                    return user.username
                })]);
                setMoney(data.money)
            }   
        }).catch(error=>{
            console.log(error)
        });
    }

    const startLoading=()=>{
        setTimeout(()=>{
            setLoading(true)
        },500)
    }

    const getCountdown=()=>{
        const months=["January","February","March","April","May","June","July",
                        "August","September","October","November","December"];

                        let date=new Date()
                        const monthString=months[date.getMonth()];

        const endtime=`${monthString} ${date.getDate()} ${date.getFullYear()} 21:59:00 GMT+0200`
        
        const t = Date.parse(endtime) - Date.parse(new Date());
        
          const seconds = Math.floor( (t/1000) % 60 );
          const minutes = Math.floor( (t/1000/60) % 60 );
          const hours = Math.floor( (t/(1000*60*60)) % 24 );
          //const days = Math.floor( t/(1000*60*60*24) );
          return {
            //'total': t,
            //'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
          }    
     }

    const nextDayLot=()=>{
        let date=new Date()
            
            let month=date.getMonth()+1
            let year=date.getFullYear()
            
            if (month<10) {
                month="0"+ month;
              }

            if(month==="01" || month==="03" || month==="05" || month==="07" || month==="08" || month==="10" || month==="12"){
                if(date.getDate()+1>31){
                    let fullDate="01"+"/"+month+"/"+date.getFullYear();
                    return fullDate
                }else{
                    let day=date.getDate()+1
                    if (day < 10) {
                        day ="0"+ day;
                      } 
                    let fullDate=(day+"/"+month+"/"+date.getFullYear());
                    return fullDate
                }
              }
              else if(month==="04" || month==="06" || month==="09" || month==="11"){
                if(date.getDate()+1>30){
                    let fullDate="01"+"/"+month+"/"+date.getFullYear();
                    return fullDate
                }else{
                    let day=date.getDate()+1
                    if (day < 10) {
                        day ="0"+ day;
                      } 
                    let fullDate=(day+"/"+month+"/"+date.getFullYear());
                    return fullDate
                }
              }
              else if(month==="02"){
                const leapYear= ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
                    if(leapYear){
                        if(date.getDate()+1>29){
                            let fullDate="01"+"/"+month+"/"+date.getFullYear();
                            return fullDate
                        }else{
                            let day=date.getDate()+1
                            if (day < 10) {
                                day ="0"+ day;
                              } 
                            let fullDate=(day+"/"+month+"/"+date.getFullYear());
                            return fullDate
                        }
                    }
                    else{
                        if(date.getDate()+1>28){
                            let fullDate="01"+"/"+month+"/"+date.getFullYear();
                            return fullDate
                        }else{
                            let day=date.getDate()+1
                            if (day < 10) {
                                day ="0"+ day;
                            } 
                            let fullDate=(day+"/"+month+"/"+date.getFullYear());
                            return fullDate
                        } 
                    }

              }
            } 
    
    const getWinner=()=>{
            //console.log(fullDate)
            fetch("http://localhost:3000/winner", {
                method:"GET"
             }).then(res=>{
                 //console.log(res)
                 return res.json()
             }).then(data=>{
                 //console.log(data)
                setWinner({
                    username:data.winner,
                    moneyWon: data.totalamountofmoney,
                    lotteryid:data.lotteryid
                }) 
             }).catch(error=>{
                 console.log(error)    
             });
    }
    
    if(loading) return <Spinner />
    //console.log(nextDayLot())
   
    return(
        <div>
            <Head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossOrigin="anonymous"/>
                <link href="styles.css" rel="stylesheet" />
            </Head>
                <Navbar setSideShow={setSideShow} setLoading2={setLoading2} sideShow={sideShow} />
                <div className="container enter-lottery">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <EnterLotteryButton registerHandler={registerHandler} errorRegister={errorRegister} startLoading={startLoading} countdown={countdown}/>
                           
                                {moneyBack && <p>There is no lottery open at the momment. We have returned your money back to your Pay Pal account</p>}
                                    {!errorRegister && <p>There are {users.length} users now in this Lottery! money played : {money}</p> }
                                    
                                       {(winner.username!=="NoEntries" && winner.username!==null && winner.username!=="") && <div>Winner of lottery {winner.lotteryid} is {winner.username} and won {winner.moneyWon} euros</div>} 
                                          {winner.username==="NoEntries" && <div>There were no entries for lottery {winner.lotteryid} .Moneys played were 0 euros</div>}             
                                            {winner.username===null && <div>Lottery {winner.lotteryid} was cancelled </div>}
                                                 
                    <div>
                        <p>Entries for the next Lottery will start on {nextDayLot()} at 10:00 and will be open until {nextDayLot()} at 21:59
                            <br />
                             1 minute before the draw
                             </p>
                    </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                        <div className="container cent">
                            {loading2 && <Spinner2 />} 
                            {(sideShow.description && !loading2) && <Description />}
                            {(sideShow.previousLotteries && !loading2) && <PreviousLotteriesState><PreviousLotteries /> </PreviousLotteriesState>}
                            {(sideShow.contact && !loading2) && <Contact />}
                            
                        </div>
                       </div>
                    </div>
                </div>      
        </div>
        
    )
}

export default withRouter(Index)
