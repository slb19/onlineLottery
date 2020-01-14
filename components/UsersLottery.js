
const UsersLottery=({users})=>{

    return(
        <div>
            {users.map((user, index)=>{
                return <p key={index}>{user}</p>
            })} 
        </div>
    )
}

export default UsersLottery