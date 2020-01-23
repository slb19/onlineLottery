//import React from 'react'
const RandomUsername=(props)=>{

    const {username}=props
    return(
        <div>
            <p style={{textAlign:"center"}}>We generated the <b>{username}</b> username for you</p>
            <p style={{textDecoration:"underline", fontSize:"1.1rem", textAlign:"center"}}>If you want to change it submit the email of your pay-pal acount</p>
        </div>
    )
}

export default RandomUsername