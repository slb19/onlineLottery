import React,{Fragment, useState, useEffect, useRef} from 'react'
 
const EnterLotteryButton=(props)=>{

    const {hours , minutes, seconds }= props.countdown

useEffect(()=>{
    props.registerHandler()
         
}/*,[props.errorRegister]*/);

let date=new Date()
let month=date.getMonth()+1
let fullDate=date.getDate()+"/"+month+"/"+date.getFullYear();

    return(
        <Fragment>
          
            {props.errorRegister && <p>Lottery has closed ..Wait for the next one</p>}
            <h4 className="take-part">Take part to the lottery with 5 euros</h4>
                <div>
{!props.errorRegister && <p>Actual Lottery will close in {fullDate} at 21:50 Time Remaining <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span></p>}
                    
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
