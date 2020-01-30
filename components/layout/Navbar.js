import React from 'react'

const Navbar = ({setSideShow}) => {

  const navBarLinksHandler=(e)=>{
    console.log(e.target)
    if(e.target.textContent==="Description") setSideShow({
      description:true,
        previousLotteries:false,
        contact:false
    });
    if(e.target.textContent==="Previous Lotteries") setSideShow({
      description:false,
        previousLotteries:true,
        contact:false
    })
    if(e.target.textContent==="Contact") setSideShow({
      description:false,
        previousLotteries:false,
        contact:true
    })
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
