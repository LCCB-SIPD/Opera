"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../../css/home.css"

export default function Home() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [imgUrl, setImgUrl] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCQ5DaMNfmNBEuQaBUawxCv2NOgV01Kmqj0Q&s')
    const [products_val, setProducts_val] = useState([])

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

        const getProduct = async () => {
            
            try {
                const response = await fetch("/api/getProduct"); // Assuming this is your API route
                const data = await response.json();
    
                if (response.ok) {
                    setProducts_val(data.data); // Assuming 'data' contains the rows from the database
                    console.log("Status: ", data.message)
                    setImgUrl(data.imgUrl)
                } 

            } catch (error) {
                alert("Server API Arror Can't Fetch or Database is offline")
            }

        }

        getProduct()

    }, [router]);

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
                    <Image 
                    src="/Icons/logo-transparent.png"
                    alt="logo"
                    width={55}
                    height={55}
                    />
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
                        <h1>{user ? user.username : "----"}</h1>
                    </div>
                    <div className="profile_option">
                        <button type="button" onClick={() => router.push("/main/Profile")}>My Profile</button>
                        <button type="button" onClick={() => router.push("/main/SellerShop")}>Sell Product</button>
                        <button type="button" onClick={() => router.push("/main/Setting")}>Settings</button>
                        <button type="button" onClick={handleLogOut}>Log Out</button>
                    </div>
                </div>
            </div>
            <div className="products_cons">
            
            { products_val && products_val.length > 0 ? (
                products_val.map((products_value) => (
                    <div className="products" key={products_value.id}>
                        <div className="products_image">
                            <Image
                                src={`${imgUrl}prd_id=${products_value.id}`}
                                alt="Sample"
                                fill
                                unoptimized
                            />
                        </div>
                        <div className="product_info">
                            <h1>{products_value.name}</h1>
                            <h2>Owner: {products_value.owner}</h2>
                            <h2>Categories: {products_value.categories}</h2>
                            <p>{products_value.price}</p>
                        </div>
                        <div className="buttons">
                            <button>Cart</button>
                            <button>Pre-Order</button>
                        </div>
                    </div>    
                ))
            ) : (
                <div className={`loadingHome`}>
                <span className={`light`}></span>
                <Image  
                src="/Icons/logo-transparent.png" 
                alt="Loading..." 
                width={120} 
                height={120} 
                unoptimized // Optional if you want to skip Next.js optimization for the image
                />
                </div>
            )}

            </div>
        </div>
    );
}
