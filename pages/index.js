import React,{useState, useEffect, Fragment} from 'react'
import EnterLotteryButton from "../components/EnterLotteryButton.js"
import { withRouter } from 'next/router'
import Spinner from "../components/layout/Spinner.js" 

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

    useEffect(()=>{
        if(paymentId) getMoneyBack(paymentId)
        //
       // console.log("useeffect")        
    });

    useEffect(()=>{
        getAllUsers()
    },[])
    
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
                 return ;
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

    if(loading) return <Spinner />

    return(
        <div>
            
            <EnterLotteryButton registerHandler={registerHandler} errorRegister={errorRegister} startLoading={startLoading}/>
            {moneyBack && <p>There is no lottery open at the momment. We have returned your money back to your Pay Pal account</p>}
                {!errorRegister && <p>There are {users.length} users now in this Lottery! money played : {money}</p> }
                      
        </div>
        
    )
}

export default withRouter(Index)
