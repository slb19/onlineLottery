import React,{Fragment} from 'react'
import check from "./check.png"

const Check = () => {
    return (
        <Fragment>
            <img src={check} alt="Your payment is complete" style={{ width:"30px", marginLeft:"8px"}}/>
        </Fragment>
    )
}

export default Check
