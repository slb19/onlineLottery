import {
    GET_LOTTERIES
} from "./types.js"

export default (state, action)=>{
    switch(action.type){
        case GET_LOTTERIES:
            return{
                ...state,
                lotteries:action.payload
            }
            default: return state
    }
}