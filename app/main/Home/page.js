"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../../css/home.css"

export default function Home() {
    const router = useRouter();
    const [user, setUser] = useState(null);

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
    }, []);

    const handleLogOut = async () => {

        try {

            const res = await fetch("/api/log_out", { method: "GET" })

            if (!res.ok) {
                throw new Error("Logout failed")
            }

            const data = await res.json()
            alert(data.message)

            router.push("/")

        } catch (error) {
            alert("Internet Timeout OR Server Error")
        }

    }

    return (
        <div className="welcome_page">
            <div className="banners">
                <div className="title">
                    <h1>One For All</h1>
                </div>
                <div className="searchBar">
                    <input 
                    type="text" 
                    id="search"
                    placeholder="Search"
                    />
                </div>
                <div className="profile">
                    <div className="profile_pic">
                        <Image
                            src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                            alt="Sample"
                            fill
                            unoptimized
                        />
                    </div>
                    <div className="profile_text">
                        <h1>{user ? user.username : "Loading..."}</h1>
                    </div>
                    <div className="profile_option">
                        <button>My Profile</button>
                        <button onClick={handleLogOut}>Log Out</button>
                    </div>
                </div>
            </div>
            <div className="products_cons">
                <div className="products">
                    <div className="products_image">
                        <Image
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCQ5DaMNfmNBEuQaBUawxCv2NOgV01Kmqj0Q&s"
                            alt="Sample"
                            fill
                            unoptimized
                        />
                    </div>
                    <div className="product_info">
                        <h1>Product 1</h1>
                        <p>Price: 1200</p>
                    </div>
                    <div className="buttons">
                        <button>Cart</button>
                        <button>Buy</button>
                    </div>
                </div>
                
            </div>
        </div>
    );
}
