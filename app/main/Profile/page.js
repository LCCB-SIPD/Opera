"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2"
import "../../css/profile.css"

export default function Profile() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    //Data Information
   
    const [src, getSrc] = useState("/main/Iframe_buy_pro")

    const changeSrc = (newSrc) => {
        getSrc(newSrc)
    }


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
            } catch (error) {
                router.replace("/");
            }
        };
        checkAuth();

    }, [router])      
        
    
    const loadingSign = () => {

        

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
                    <button type="button" onClick={() => {router.replace("/main/Home"); setLoading(true); }}>&larr; Back</button>
                    <button type="button" onClick={() => {changeSrc("/main/Iframe_buy_pro"); loadingSign();}}>Dashboard</button>
                    <button type="button" onClick={() => {changeSrc("/main/Iframe_buy_pro"); loadingSign();}}>Your Ordered</button>
                    <button type="button" onClick={() => {changeSrc("/main/Iframe_buy_pro"); loadingSign();}}>Carts</button>
                    <button type="button" onClick={() => {changeSrc("/main/Iframe_sell_pro"); loadingSign();}}>Your Products</button>
                </div>
                <div className="iframe_home">
                    <iframe
                        src={src}
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    )
}