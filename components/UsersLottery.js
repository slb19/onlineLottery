
const UsersLottery=({users})=>{

    return(
        <div className="users-container">
            {users.map((user, index)=>{
                return <p key={index}>{user}</p>
            })} 
        </div>
    )
}

export default UsersLottery