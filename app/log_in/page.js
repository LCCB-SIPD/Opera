"use client"
import "../css/log_in.css"
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function Log_in() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorColor, setErrorColor] = useState(true);
    const router = useRouter()   

    const handleLogIn = async (e) => {
        e.preventDefault()

        try {

            setLoading(true)

            const response = await fetch("/api/log_in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            })
    
            const data = await response.json()
    
            if (response.ok) {
                router.push("/main/Home")
                setError(data.message)
                setErrorColor(false)
            } else {
                setError(data.error)
                setLoading(false)
                setErrorColor(true)
            }
    
        } catch (error) {
            setError('Internet Connection TimeOut')
            setLoading(false)
            setErrorColor(true)
        }
        
    }

    return(
        <div className="log_in">
                <span className={`loading ${loading ? "": "hidden"}`}>
                    <span className={`light ${loading ? "": "hidden"}`}></span>
                    <Image 
                    className={`${loading ? "": "hidden"}`}
                    src="/Icons/logo-transparent.png" 
                    alt="Loading..."
                    width={120}
                    height={120}
                    unoptimized // Optional if you want to skip Next.js optimization for the image
                    />
                </span>
                <h1 className="title">One For All</h1>
            <form onSubmit={handleLogIn}>
                <div>
                    <input 
                    type="text" 
                    id="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder=" "
                    required
                    autoComplete="username"
                    />
                    <label htmlFor="username">Username </label>
                </div>
                <div>
                    <input 
                    type="password" 
                    id="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=" " 
                    required
                    />
                    <label htmlFor="password">Password </label>
                </div>
                <div>
                    <a href="#">Forgot Password?</a>
                </div>
                {error && <p className={`error ${errorColor ? "": "success"}`}>{error}</p>} 
                <div>
                    <button type="button" onClick={() => {router.replace("/sign_up"); setLoading(true); }}>Sign Up</button>
                    <button type="submit" disabled={loading}>{loading ? "Fetching..." : "Log In"}</button>
                </div>
            </form>
        </div>
    )

}