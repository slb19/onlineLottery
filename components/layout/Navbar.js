import React from 'react'

const Navbar = ({setSideShow, setLoading2, sideShow}) => {

  const navBarLinksHandler=(e)=>{
    console.log(e.target)

    if(e.target.textContent==="Description"){
      if(sideShow.description===true) return;
        setTimeout(()=>{
          setSideShow({
            description:true,
              previousLotteries:false,
              contact:false
          });
        }, 500)
  
        setLoading2(true)
    }

    if(e.target.textContent==="Previous Lotteries"){
      if(sideShow.previousLotteries===true) return ;
      setTimeout(()=>{
        setSideShow({
          description:false,
            previousLotteries:true,
            contact:false
        })
      }, 500)
      
      setLoading2(true)
    }
  
    if(e.target.textContent==="Contact"){
      if(sideShow.contact===true) return ;
      setTimeout(()=>{
        setSideShow({
          description:false,
            previousLotteries:false,
            contact:true
        })
      }, 500)

      setLoading2(true)
    } 
  }

    return (
        
           <nav className="navb">
                <div className="title">Parta Ola</div>
                <div className="navb-links">
              <ul className="navb-links-ul" onClick={navBarLinksHandler}>
                 
                <li>Description</li>
                <li>Previous Lotteries</li>
                <li>Contact</li>
                  
              </ul>
            </div>
           </nav> 
    )
}

export default Navbar
