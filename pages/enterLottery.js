import React,{useState, useEffect, Fragment} from 'react'
import { withRouter } from 'next/router'
import Link from "next/Link"
import Head from 'next/head';
import Navbar from "../components/layout/Navbar.js"
import RandomUsername from "../components/RandomUsername.js"
import CustomUsername from "../components/CustomUsername.js"
import UsersLottery from "../components/UsersLottery.js"
import Spinner from "../components/layout/Spinner.js" 
import Check from "../components/layout/Check.js" 

// let AbortController
// if (process.browser) {
//     AbortController = window.AbortController
//   }


const enterLottery=(props)=>{
    const { router } = props
    // console.log(router.query.paymentId)
     const paymentId=router.query.paymentId

     const [user, setUser]=useState({
        id:null,
        username:null,
        updatedUsername:null,
        hotReload:true,
       // moneyBack:false,
        fail:false,
        error:null,
        loading:true
    });

    const [users, setUsers]=useState([])
    const [money, setMoney]=useState(0)
    
    const [updateUsernameForm , setUpdateUsernameForm ]=useState({
        newUsername:"",
        email:"",
        });
    
    let {id}=user
    
   useEffect(()=>{
    
    const abortController= new AbortController()
    const signal=abortController.signal
    if(paymentId && user.username!==null) getAllUsers(signal)

        return function cleanup(){
            abortController.abort()
        }
   },[user])

    const getUser=(paymentId)=>{
        fetch(`http://localhost:3000/getUser/${paymentId}`, {
           method:"GET" 
        }).then(res=>{
            return res.json()
        }).then(data=>{
            //console.log(data)
            if(data.noUser){
                return ;
            }else{
                setUser({...user, username:data.username, id:data.userid, updatedUsername:data.updatedbyusers, loading:false});
            }                 
        }).catch(error=>{
            console.log(error)
        });
    }

    const getAllUsers=(signal)=>{
        //console.log("frm get All Users")
        fetch("http://localhost:3000/getUsers", {
            signal:signal,
            method:"GET"
        }).then(res=>{
            return res.json()
        }).then(data=>{
            //console.log(data.users[0].username)
            setUsers([...data.users.map(user=>{
                return user.username
            })])
            setMoney(data.money)
        }).catch(error=>{
            console.log(error)
            if(errror.name="AbortError") return;
        });
    }
//console.log(users)
    const onChange=(e)=>{
        //console.log(e.target.name);
       //console.log(e.target.value);
       setUpdateUsernameForm({...updateUsernameForm, [e.target.name]:e.target.value});
   }

   const updateUser=(updateUsernameForm)=>{
    fetch(`http://localhost:3000/updateUsername/${id}`, {
       method:"PUT",
       body:JSON.stringify(updateUsernameForm),
       headers:{
        Accept:"Application/json",
        "Content-Type":"Application/json"    
       } 
    }).then(res=>{
        return res.json()
    }).then(data=>{
        console.log(data)
        if(data.fail){
            setUser({...user, fail:data.fail});
            return ;
        }else{
            setUser({...user,username:data.updatedUsername, updatedUsername:data.updatedByUsers,fail:false, hotReload:false, loading:false});
        }        
    }).catch(error=>{
        console.log(error)
    });
}

   const onSubmit=(e)=>{
    e.preventDefault();
    updateUser(updateUsernameForm)
    setUpdateUsernameForm({
        newUsername:"",
        email:"",   
     })
}
const okToggler=()=>{
    setUser({
        id:null,
        username:false,
        updatedUsername:false,
        hotReload:true,
       // moneyBack:false,
        fail:false,
        error:null,
        loading:true 
    });
}

if(paymentId && user.username===null) getUser(paymentId)
//if(!user.id && paymentId) return <Spinner/>

return(
    <div>
        <Head>
          <link href="https://fonts.googleapis.com/css?family=Cantarell&display=swap" rel="stylesheet"/> 
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossOrigin="anonymous"/>
                <link href="styles.css" rel="stylesheet" />
        </Head>

 {user.loading  ? <Spinner/>
                :
                <Fragment>
                    <Navbar />
                    <div className='container enter-lottery'>
                        <div className="row">
                        <div className="col-lg-6 col-md-12 col-sm-12">
        <h3 className="payment-title">Your payment is complete <Check/> </h3>
                
                <div className="jumbotron jumbotron-extra">
                {!user.updatedUsername && user.hotReload && !user.updateUser && <RandomUsername username={user.username}/> }
                {user.updatedUsername && <CustomUsername username={user.username}/>} 
                     
                        {user.fail && <div className="fail-container"><p style={{margin:"6px"}}><b>{user.fail}</b></p></div>} 
    
                        <form onSubmit={onSubmit}>
                            <label className="label-username" htmlFor="email"><b>Email</b></label><br/>
                                <input className="input-username" type="email" name="email" placeholder="email..." value={updateUsernameForm.email} onChange={onChange}  required /><br/>
                            <label className="label-username" htmlFor="New username"><b>New Username</b></label><br/>
                                <input className="input-username" type="text" name="newUsername" placeholder="New username..." value={updateUsernameForm.newUsername} onChange={onChange}  required /><br/>
                            <input className="btn btn-primary" type="submit" value="change Username" />
                        </form>
                    <p style={{textAlign:"center", marginTop:"18px"}}>Are you done ? Press here <Link href="/"><button className="btn btn-success" onClick={okToggler}>OK</button></Link></p>
                           </div>
                          </div>

                          <div className="col-lg-6 col-md-12 col-sm-12">
                          <h5 className="entries-title">There are {users.length} Entries to this lottery ! money played : {money}</h5>
                            <UsersLottery  users={users}/>
                            </div>
                           </div>
                        </div>    
                    </Fragment>
        }
    </div>
)
}

export default withRouter(enterLottery)