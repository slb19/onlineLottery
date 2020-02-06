import React,{Fragment, useState, useEffect, useRef} from 'react'
 
const EnterLotteryButton=(props)=>{

    const {hours , minutes, seconds }= props.countdown

useEffect(()=>{
    props.registerHandler()
         
}/*,[props.errorRegister]*/);

const getTheDate=()=>{
    let date=new Date()
    let day=date.getDate()
    let month=date.getMonth()+1

    if (day < 10) {
        day ="0" + day;
    } 
    if (month < 10) {
        month ="0" + month;
    }
    return day+"/"+month+"/"+date.getFullYear();
}


    return(
        <Fragment>
          
            {props.errorRegister && <p>Lottery has closed ..Wait for the next one</p>}
            <h4 className="take-part">Take part to the lottery with 5 euros</h4>
                <div>
                    {!props.errorRegister && <p>Actual Lottery will close in {getTheDate()} at 21:59 Time Remaining <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span></p>}
                    
                </div>
                <div className="form-div">   
               <form action="/register" method="POST">
               {props.errorRegister ? <button className="btn btn-danger lottery-btn" type="button" disabled >Enter the next Lottery</button> 
                                        :
                 <button className="btn btn-primary lottery-btn" onClick={props.startLoading}>Take part to the Lottery!</button>
               } 
                </form> 
                </div>  
                    
        </Fragment>
    )
}

export default EnterLotteryButton

//<form >
/*
<form>
<input type="submit" value="Enter the next Lottery" onClick={registerHandler}/>
</form>

<button onClick={registerHandler} >Enter the next Lottery</button>
onClick={props.loadSpinner}
<button >Enter the next Lottery</button>
*/
