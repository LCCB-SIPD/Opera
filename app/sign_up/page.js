"use client"
import { useRouter } from "next/navigation"
import "../css/sign_up.css"

export default function Sign_up() {
    
    const router = useRouter()

    return(
        <div className="sign_up">
            <h1 className="title">Sign Up</h1>
            <form action="" method="post">
                <div>
                    <input type="email" id="email" name="email" placeholder=" " required/>
                    <label htmlFor="email">Email</label>
                </div>
                <div>
                    <input type="text" id="username" name="username" placeholder=" " required/>
                    <label htmlFor="username">Username</label>
                </div>
                <div>
                    <input type="password" id="e_passwd" name="e_passwd" placeholder=" " required/>
                    <label htmlFor="e_passwd">Password</label>
                </div>
                <div>
                    <input type="password" id="e_passwd" name="c_passwd" placeholder=" " required/>
                    <label htmlFor="c_passwd">Confirm Password</label>
                </div>
                <div>
                    <button type="button" onClick={() => router.push("/")}>Back</button>
                    <button type="submit">Confirm</button>
                </div>
            </form>
        </div>
    )

}