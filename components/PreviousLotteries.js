import React,{useContext, useEffect} from 'react'
import PreviousLotteriesContext from "../context/previousLotteries/previousLotteriesContext.js"

const PreviousLotteries = () => {

    const previousLotteriesContext=useContext(PreviousLotteriesContext)
   
    const {getLotteries, lotteries }=previousLotteriesContext

    useEffect(()=>{
        getLotteries()      
     },[])

    //console.log(lotteries)

     const tableData=()=>{
        return lotteries.map((lottery, index)=>{
            const {lottery_no, date, winner, has_won}= lottery
            const dateCutTime= date.slice(0,10)
            return <tr key={index}>
                        <td>{lottery_no}</td>
                        <td>{dateCutTime}</td>
                        <td>{winner}</td>
                        <td>{has_won}</td>
                    </tr>
        })
     }

     const tableHeader=()=>{
         if(lotteries[0]!==undefined){
        let header= Object.keys(lotteries[0])
        return header.map((title, index)=>{
            return <th key={index}>{title}</th>
        })
       }
     }

    return (
        <div >
            <h4>Previous Lotteries</h4>
            <table style={{margin:"0 auto"}}>
                <tbody>
                <tr>{tableHeader()}</tr>
                    {tableData()}
                </tbody>
            </table>
        </div>
    )
}

export default PreviousLotteries
