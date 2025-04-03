"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import "../css/sign_up.css"

export default function Sign_up() {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [e_passwd, setPassword] = useState('')
    const [c_passwd, setconfirmPassword] = useState('')
    const [generateCode, setGenerateCode] = useState('')
    const [code, setCode] = useState('')
    const [error, setError] = useState('')
    const [errorColor, setErrorColor] = useState(true);
    const [v_button, setVbutton] = useState(false)
    const [timer, setTimer] = useState(0)
    const [loading, setLoading] = useState(false)

    const ConfirmEmail = async () => {

        if (!email || !username || !c_passwd || !e_passwd) {
            setError("Please Input Your Credentials First")
            setErrorColor(true)
            setLoading(false)
            return
        }

        setVbutton(true)

        try {

            setLoading(true)

            setTimer(60)

            const countdown = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdown);
                        setVbutton(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            

            const response = await fetch("api/c_email", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    username
                })
            })            

            const result = await response.json()

            if (response.ok) { 

                setGenerateCode(result.message)
                setLoading(false)
                setError("Code Successfully Sent")
                setErrorColor(false)

            } else {
                setLoading(false)
                setError(result.error)
                setErrorColor(true)
                setTimer(0)
            }

        } catch (error) {

            setError("Somethings went wrong")
            setErrorColor(true)
            console.error(error)
            setLoading(false)
        }

    }


    const handleSubmit = async (e) => {

        e.preventDefault()
        
        setLoading(true)

        if (!code) {
            setLoading(false)
            setError("Please Confirm Your Email")
            setErrorColor(true)
            return
        }

        if (generateCode !== code) {
            setLoading(false)
            setError("Verification Code Not Match")
            setErrorColor(true)
            return
        }

        

        try {

            const response = await fetch("/api/sign_up", {
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
                setErrorColor(false)
                window.location.reload()
            } else {
                setError(data.error || "Somethings went wrong")
                setErrorColor(true)
                setLoading(false)
            }

        } catch (error) {
            setLoading(false)
            setError("Error Can't Connect...")
            setErrorColor(true)
            console.error("Error during fetch:", error);
        }



    }

    const router = useRouter()

    return(
        <div className="sign_up">
            <h1 className={`loading-screen ${loading ? "": "hidden"}`}>Fetching...</h1>
            <h1 className="title">Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input 
                    type="email" 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder=" " required autoComplete="email"/>
                    <label htmlFor="email">Email</label>
                </div>
                <div>
                    <input 
                    type="text" 
                    id="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder=" " required autoComplete="username"/>
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
                    <input 
                    type="number" 
                    id="Code" 
                    value={code}
                    onChange={(e) => setCode(e.target.value)} 
                    placeholder=" "/>
                    <label htmlFor="Code">Confirm Email</label>
                    <button type="button" onClick={ConfirmEmail} disabled={v_button}>{v_button ? `${timer}`: "Send"}</button>
                </div>
                {error && <p className={`error ${errorColor ? "": "success"}`}>{error}</p>}
                <div>
                   <button type="button" onClick={() => router.replace("/")}>Back</button>
                    <button type="submit" disabled={loading}>{loading ? "Loading..." : "Confirm"}</button>
                </div>
            </form>
        </div>
    )

}