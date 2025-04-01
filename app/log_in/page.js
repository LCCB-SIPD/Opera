"use client"
import "../css/log_in.css"
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function Log_in() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
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
    
            const data = await response.text()
    
            if (response.ok) {
                router.push("/main/Home")
            } else {
                setError(data)
                setLoading(false)
            }
    
        } catch (error) {
            setError('Internet Connection TimeOut')
            setLoading(false)
        }
        
    }

    return(
        <div className="log_in">
                <h1 className={`loading-screen ${loading ? "": "hidden"}`}>Fetching...</h1>
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
                {error && <p style={{ color: "#f00" }}>{error}</p>} 
                <div>
                    <button type="button" onClick={() => router.replace("/sign_up")}>Sign Up</button>
                    <button type="submit" disabled={loading}>{loading ? "Fetching..." : "Log In"}</button>
                </div>
            </form>
        </div>
    )

}