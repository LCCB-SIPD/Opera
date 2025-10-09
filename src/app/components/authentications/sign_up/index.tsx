import style from "./css/styles.module.css";
import Image from "next/image";
import image_src from "@/app/config/images.json";
import Link from "next/link";
import { useState } from "react";

export default function Sign_up() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [e_passwd, setPassword] = useState("");
    const [c_passwd, setConfirmPassword] = useState("");

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        
        e.preventDefault()

        alert("Testing");

    }

    return(
        <div className={`flex ${style.container}`}>
            <div className={`flex ${style.left}`}>
                <Image 
                src={image_src.image_1}
                alt="Background"
                title="Background"
                fill
                unoptimized
                />
            </div>
            <div className={`flex ${style.right}`}>
                <form className="flex" onSubmit={handleSubmit}>
                    <h1>Create New Account</h1>
                    <div className={`flex ${style.credentials}`}>
                        <label htmlFor="email">Email *</label>
                        <input 
                        type="text" 
                        id="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Enter Your Email" required autoComplete="email"/>
                    </div>
                    <div className={`flex ${style.credentials}`}>
                        <label htmlFor="username">Username</label>
                        <input 
                        type="text" 
                        id="username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder="Enter Your Username" required autoComplete="username"/>
                    </div>
                    <div className={`flex ${style.credentials}`}>
                        <label htmlFor="e_passwd">Password</label>
                        <input 
                        type="password" 
                        id="e_passwd" 
                        value={e_passwd}
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Enter Your Password" required/>
                    </div>
                    <div className={`flex ${style.credentials}`}>
                        <label htmlFor="c_passwd">Confirm Password</label>
                        <input 
                        type="password" 
                        id="c_passwd" 
                        value={c_passwd}
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        placeholder="Confirm Your Password" required/>
                    </div>
                    <div>
                        <button>Submit</button>
                        <p>
                            Already have an account? <Link href="/login"><u>Log In</u></Link>
                        </p>

                    </div>
                </form>
            </div>
        </div>
    );
}