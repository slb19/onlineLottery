//import React from 'react'
const RandomUsername=(props)=>{

    const {username}=props
    return(
        <div>
            <p>We generated the <b>{username}</b> username for you</p>
            <p>If you want to change it submit the email of your pay-pal acount to change it </p>
        </div>
    )
}

export default RandomUsername