const getTheTime=()=>{
    let d=new Date();
    const hours=("0"+d.getHours()).slice(-2)
    const minutes=("0"+ d.getMinutes()).slice(-2)
    const seconds=("0"+ d.getSeconds()).slice(-2)
        let time=`${hours}:${minutes}:${seconds}`
    //let time=d.toLocaleTimeString();
        return time
}

const getTheDate=()=>{
    let date=new Date()
    let day=date.getDate()
    let month=date.getMonth()+1
    let year=date.getFullYear()

    if (day < 10) {
      day ="0"+day;
    } 
    if (month < 10) {
      month ="0"+month;
    }
     
    let fullDate=day+"/"+month+"/"+year;
        return fullDate
}

module.exports={
    getTheTime , getTheDate
}