"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import "../css/sign_up.css"

export default function Sign_up() {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [e_passwd, setPassword] = useState('')
    const [c_passwd, setconfirmPassword] = useState('')

    const handleSubmit = async (e) => {

        e.preventDefault()

        if (e_passwd !== c_passwd) {
            alert("Passwords do not match!!!")
            return
        }
        
        const response = await fetch('/api/sign_up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                username,
                e_passwd,
                c_passwd
            })
        })

        const data = await response.json()
        if (response.ok) {
            alert("Sign up Successful!")
            window.location.reload()
        } else {
            alert(`Error: ${data.error}`)
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
                <div>
                    <button type="button" onClick={() => router.push("/")}>Back</button>
                    <button type="submit">Confirm</button>
                </div>
            </form>
        </div>
    )

}