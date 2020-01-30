import React,{useReducer} from "react"
import PreviousLotteriesContext from "./previousLotteriesContext.js"
import PreviousLotteriesReducer from "./previousLotteriesReducer.js"
import {
    GET_LOTTERIES
} from "./types.js"

const PreviousLotteriesState=props=>{
    const initialState={
        lotteries:[]
    }

    const [state, dispatch]= useReducer(PreviousLotteriesReducer, initialState)

    const getLotteries=()=>{
        fetch("http://localhost:3000/lotteries",{
            method:"GET"
        }).then(res=>{
            return res.json()
        }).then(data=>{
            //console.log(data)
            dispatch({
                type:GET_LOTTERIES,
                payload:data
            })
        }).catch(error=>{
            console.log(error)
        })
    }

    return (<PreviousLotteriesContext.Provider value={{lotteries:state.lotteries , getLotteries}}>
                {props.children}
            </PreviousLotteriesContext.Provider>)
}

export default PreviousLotteriesState