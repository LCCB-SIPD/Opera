"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../../css/profile.css";

export default function Profile() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState("")
    const [src, getSrc] = useState("/main/Profile_info")
    const [profile, setProfile] = useState('')
    const [userData, setUserdata] = useState([])
    const scrollDown = useRef(null)

    const changeSrc = (newSrc) => {
        getSrc(newSrc)
    }

    const usernameData = user.username ?? null    

    useEffect(() => {

        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth", { credentials: "include" });
                if (!res.ok) {
                    router.replace("/");
                    alert("Invalid Credentials")
                    return;
                }
                const userData = await res.json();
                setUser(userData);
                console.log(`User Data ${userData}`)
            } catch (error) {
                alert("somthings went wrong")
            }
        };
        checkAuth();

        const getUser = async () => {

            if (usernameData === null) return

            try {

                const response = await fetch('/api/getUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: usernameData
                    })
                })

                const result = await response.json()

                if (response.ok) {

                    setProfile(result.profile)

                    setUserdata(result.data)

                }

            } catch (error) {

                console.error("Somethings Went Wrong")

            }

        }

        getUser()

    }, [router, usernameData]) 
    
    
    const scrollDownTo = () => {
        
        scrollDown.current?.scrollIntoView({ behavior: 'smooth' })
        
        
    }     
        

    return(
        <div className="Profile">
            <span className={` ${loading ? "loading": "hidden"}`}>
                    <span className={` ${loading ? "light": "hidden"}`}></span>
                    <Image 
                    className={`${loading ? "fade_in_image_load": "hidden"}`}
                    src="/Icons/logo-transparent.png" 
                    alt="Loading..."
                    width={120}
                    height={120}
                    unoptimized // Optional if you want to skip Next.js optimization for the image
                    />
                </span>
            
            <div className="inventory">
                
                <div className="inventory_banners">
                    <div className="profile_info_inner">
                        <div className="profile_pic_inner">
                            {user?.username && (
                                <Image
                                src={`${profile}${user.username}`}
                                alt="Sample"
                                fill
                                unoptimized
                            />
                            )}  
                        </div>
                        <div className="profile_username_inner">
                            <h2>{userData.username}</h2>
                            <h2>{userData.email}</h2>
                        </div>
                    </div>
                    <button type="button" onClick={() => {router.replace("/main/Home"); setLoading(true); }}>Home</button>
                    <button type="button" onClick={() => {changeSrc("/main/Profile_info"); scrollDownTo();}}>Update Information</button>
                    <button type="button" onClick={() => {changeSrc("/main/Iframe_buy_pro"); scrollDownTo();}}>Carts</button>
                    <button type="button" onClick={() => {changeSrc("/main/Iframe_buy_pro"); scrollDownTo();}}>Ordered Product</button>
                    <button type="button" onClick={() => {changeSrc("/main/Iframe_sell_pro"); scrollDownTo();}}>My Product</button>
                </div>
                <div className="iframe_home" ref={scrollDown}>
                    <iframe
                        src={src}
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    )
}
