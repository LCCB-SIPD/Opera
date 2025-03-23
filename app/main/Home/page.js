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
                    router.push("/"); // Redirect if not authenticated
                    return;
                }
                const userData = await res.json();
                setUser(userData);
            } catch (error) {
                router.push("/");
            }
        };

        checkAuth();
    }, []);

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
                            src="https://www.shutterstock.com/image-vector/people-illustrations-profile-examples-260nw-1270121050.jpg"
                            alt="Sample"
                            fill
                            unoptimized
                        />
                    </div>
                    <div className="profile_text">
                        <h1>{user ? user.username : "Loading..."}</h1>
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
