import React , {Fragment} from 'react'
import loading2 from "./loading2.gif"

const Spinner2 = () => {
    return (
        <Fragment>
            <img src={loading2} alt="Loading..." style={{ width:"100px",margin:"auto", display:"block" }}/>
        </Fragment>
    )
}


export default Spinner2