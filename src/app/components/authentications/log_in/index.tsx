import style from "./css/styles.module.css";
import Image from "next/image";
import image_src from "@/app/config/images.json";
import Link from "next/link";
import { useState } from "react";

export default function Sign_up() {
    const [username, setUsername] = useState("");
    const [e_passwd, setPassword] = useState("");

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
                    <h1>Account Log In</h1>
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
                    <div>
                        <button>Log In</button>
                        <p>
                            Dont have an account? <Link href="/signup">Sign Up</Link>
                        </p>


                    </div>
                </form>
            </div>
        </div>
    );
}