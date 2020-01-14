import Link from "next/Link"

const cancelByUser=()=>{
    return (
        <div>
            <p>You have cancelled your entry to the lottery"</p>
            <Link href="/"><button>GoBack</button></Link>
        </div>
    )
}

export default cancelByUser