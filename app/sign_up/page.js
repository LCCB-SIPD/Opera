"use client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import Swal from "sweetalert2"
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

    const router = useRouter()

     useEffect(() => {
    
            const checkConnections = async () => {
        
              const response = await fetch("/api/checkCon")
        
              if (!response.ok) {
        
                router.push("/log_in")
        
                alert("Can't Connect to Server")
        
              } 
        
            }
        
            checkConnections()
        
           
          }, [router])

    const ConfirmEmail = async () => {

        if (!email || !username || !c_passwd || !e_passwd) {
            setError("Please Input Your Credentials First")
            setErrorColor(true)
            setLoading(false)
            return
        }

        setVbutton(true)

        try {

            Swal.fire({
                title: 'Sending Verification Code',
                text: 'Please wait...',
                allowOutsideClick: false, color: '#ffffff',
                didOpen: () => {
                Swal.showLoading(); // Show loading spinner
                },
                background: '#21262d'
            })

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
                Swal.fire({
                    title: 'Successfully Send',
                    text: `Code Successfully Sent to ${email}`,
                    icon: 'success',
                    background: '#222831',      // Custom background color
                    color: '#ffffff',           // Optional: Text color
                    confirmButtonColor: '#00adb5' // Optional: Button color
                })
                setError(`Code Successfully Sent to ${email}`)
                setErrorColor(false)

            } else {
                Swal.fire({
                    title: 'Error',
                    text: result.message,
                    icon: 'error',
                    background: '#222831',      // Custom background color
                    color: '#ffffff',           // Optional: Text color
                    confirmButtonColor: '#00adb5' // Optional: Button color
                })
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

        if (username.length > 10) {
            setError("Username can be only at 10 characters")
            setErrorColor(true)
            return
        }

        if (c_passwd.length < 8) {
            setError("Password must be at least 8 characters")
            setErrorColor(true)
            return
        }

        if (!code) {
            setError("Please Confirm Your Email")
            setErrorColor(true)
            return
        }

        Swal.fire({
            title: 'Verifiying Identification',
            text: 'Please wait...',
            allowOutsideClick: false, color: '#ffffff',
            didOpen: () => {
            Swal.showLoading(); // Show loading spinner
            },
            background: '#21262d'
        })

        
        if (generateCode !== code) {
            Swal.fire({
                title: 'Error',
                text: "Verification Code Not Match",
                icon: 'error',
                background: '#222831',      // Custom background color
                color: '#ffffff',           // Optional: Text color
                confirmButtonColor: '#00adb5' // Optional: Button color
            })
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
                Swal.fire({
                    title: 'Log In your Account',
                    text: data.message,
                    icon: 'success',
                    background: '#222831',      // Custom background color
                    color: '#ffffff',           // Optional: Text color
                    confirmButtonColor: '#00adb5' // Optional: Button color
                }).then(() => {
                    router.push("/")
                })
                
            } else {
                setError(data.error || "Somethings went wrong")
                setErrorColor(true)
                Swal.fire({
                    title: 'Error',
                    text: data.error,
                    icon: 'error',
                    background: '#222831',      // Custom background color
                    color: '#ffffff',           // Optional: Text color
                    confirmButtonColor: '#00adb5' // Optional: Button color
                }).then(() => {
                    window.location.reload();
                });
               
            }

        } catch (error) {
            setLoading(false)
            setError("Error Can't Connect...")
            setErrorColor(true)
            console.error("Error during fetch:", error);
        }



    }

    return(
        <div className="sign_up">
            <span className={`${loading ? "loading": "hidden"}`}>
                <span className={`${loading ? "light": "hidden"}`}></span>
                <Image 
                className={`${loading ? "fade_in_image_load": "hidden"}`}
                src="/Icons/logo-transparent.png" 
                alt="Loading..."
                width={120}
                height={120}
                unoptimized // Optional if you want to skip Next.js optimization for the image
                />
            </span>
            
            
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
                    maxLength={10}
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
                   <button type="button" onClick={() => {router.replace("/log_in"); setLoading(true); }}>Back</button>
                    <button type="submit" disabled={loading}>{loading ? "Loading..." : "Confirm"}</button>
                </div>
            </form>
        </div>
    )

}