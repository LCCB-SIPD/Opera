"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import "../css/sign_up.css"

export default function Sign_up() {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [e_passwd, setPassword] = useState('')
    const [c_passwd, setconfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false) 

    const handleSubmit = async (e) => {

        e.preventDefault()

        if (e_passwd !== c_passwd) {
            alert("Passwords do not match!!!")
            return
        }
        
        setLoading(true)

        try {

            const response = await fetch('/api/sign_up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    username,
                    e_passwd,
                    c_passwd,
                })
            })
    
            const data = await response.json()
            if (response.ok) {
                setError(data.message)
                window.location.reload()
            } else {
                setError(data.error || "Somethings went wrong")
                setLoading(false)
            }

        } catch (error) {
            setLoading(false)
            setError("Network Error. Please Try Again...")

        }
    }

    const router = useRouter()

    return(
        <div className="sign_up">
            <h1 className="title">Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input 
                    type="email" 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder=" " required/>
                    <label htmlFor="email">Email</label>
                </div>
                <div>
                    <input 
                    type="text" 
                    id="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder=" " required/>
                    <label htmlFor="username">Username</label>
                </div>
                <div>
                    <input 
                    type="password" 
                    id="e_passwd" 
                    value={e_passwd}
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder=" " required/>
                    <label htmlFor="e_passwd">Password</label>
                </div>
                <div>
                    <input 
                    type="password" 
                    id="c_passwd" 
                    value={c_passwd}
                    onChange={(e) => setconfirmPassword(e.target.value)} 
                    placeholder=" " required/>
                    <label htmlFor="c_passwd">Confirm Password</label>
                </div>
                {error && <p style={{ color: "#ff0" }}>{error}</p>}
                <div>
                    <button type="button" onClick={() => router.back()}>Back</button>
                    <button type="submit" disabled={loading}>{loading ? "Loading..." : "Confirm"}</button>
                </div>
            </form>
        </div>
    )

}