"use client"
import "../css/log_in.css"
import { useRouter } from "next/navigation";
export default function Log_in() {

    const router = useRouter()

    return(
        <div className="log_in">
                <h1 className="title">One For All</h1>
            <form action="" method="post">
                <div>
                    <input 
                    type="text" 
                    id="username" 
                    name="username"
                    placeholder=" "
                    required 
                    />
                    <label htmlFor="username">Username </label>
                </div>
                <div>
                    <input 
                    type="password" 
                    id="password" 
                    name="password"
                    placeholder=" " 
                    required
                    />
                    <label htmlFor="password">Password </label>
                </div>
                <div>
                    <a href="#">Forgot Password?</a>
                </div>
                <div>
                    <button type="button" onClick={() => router.push("/sign_up")}>Sign Up</button>
                    <button type="submit">Log In</button>
                </div>
            </form>
        </div>
    )

}