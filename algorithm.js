const doLottery=(users)=>{

    let entries=users.map(user=>user.username)
                                               // console.log(entries)
    let ascCode
    let ascCodeSum=0
    let winner=[];
    
    const numOfEntries=entries.length;
    const randomNumber=Math.floor(Math.random()* numOfEntries) 
    
    for(let i in entries[randomNumber]){  
        ascCode=entries[randomNumber].charCodeAt(i) 
        ascCodeSum+=ascCode;   
    }
    
    for(let j=0; j<ascCodeSum; j++){
        let oldIndex=Math.floor(Math.random()* numOfEntries)
        let newIndex=Math.floor(Math.random()* numOfEntries)
        
            entries.splice(newIndex, 0 , entries.splice(oldIndex, 1)[0])
                                                                          //console.log(entries, j)
            }
                                                                         //console.log("final" , entries)
        let index1=Math.floor(Math.random()* numOfEntries)
                                                                        //console.log(index1)      
    while(entries.length>0){
        if(index1>numOfEntries) index1=0
            
            winner=entries.splice(index1,1)
                index1++           
         }
         console.log(winner, entries);  
            return winner;
                                                                     
    }
    
    module.exports=doLottery