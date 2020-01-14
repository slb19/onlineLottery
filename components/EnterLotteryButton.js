import React,{Fragment, useState, useEffect, useRef} from 'react'
 
const EnterLotteryButton=(props)=>{

useEffect(()=>{
    props.registerHandler()
         
}, [props.errorRegister]);

    return(
        <Fragment>
            
            {props.errorRegister && <p>Lottery has closed ..Wait for the next one</p>}
            <h4>Take part to the next lottery with 5 euros</h4>
               
               <form action="/register" method="POST">
               {props.errorRegister ? <button type="button" disabled >Enter the next Lottery</button> 
                                        :
                 <button onClick={props.startLoading}>Enter the next Lottery!</button>
               } 
                </form> 
                    
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
