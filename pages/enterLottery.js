import React,{useState, useEffect, Fragment} from 'react'
import { withRouter } from 'next/router'
import Link from "next/Link"
import RandomUsername from "../components/RandomUsername.js"
import CustomUsername from "../components/CustomUsername.js"
import UsersLottery from "../components/UsersLottery.js"
import Spinner from "../components/layout/Spinner.js" 

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
    if(paymentId && user.username!==null) getAllUsers()

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

    const getAllUsers=()=>{
        //console.log("frm get All Users")
        fetch("http://localhost:3000/getUsers", {
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
 {user.loading  ? <Spinner/>
                :
                <Fragment>
        <h4>Your payment is complete</h4>
                
                
                {!user.updatedUsername && user.hotReload && !user.updateUser && <RandomUsername username={user.username}/> }
                {user.updatedUsername && <CustomUsername username={user.username}/>} 
                     
                        {user.fail && <div><p>{user.fail}</p></div>} 
    
                        <form onSubmit={onSubmit}>
                            <label htmlFor="email">email</label><br/>
                            <input type="email" name="email" placeholder="email" value={updateUsernameForm.email} onChange={onChange}  required />
                            <label htmlFor="New username">New username</label><br/>
                            <input type="text" name="newUsername" placeholder="New username" value={updateUsernameForm.newUsername} onChange={onChange}  required />
                            <input type="submit" value="change username" />
                        </form>
                    <p>if you are ok press <Link href="/"><button onClick={okToggler}>OK</button></Link></p>
                        <h4>There are {users.length} Entries to this lottery ! money played : {money}</h4>
                          
                            <UsersLottery  users={users}/>
                                     
                    </Fragment>
        }
    </div>
)
}

export default withRouter(enterLottery)