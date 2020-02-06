import Link from "next/Link"

const error = () => {
    return (
        <div>
            <p>Something went wrong</p>
            <Link href="/"><button>GoBack</button></Link>
        </div>
    )
}

export default error
