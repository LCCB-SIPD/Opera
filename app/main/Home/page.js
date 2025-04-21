"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2"
import "../../css/home.css"

export default function Home() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState('')
    const [loading, setLoading] = useState(false)
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
                    setProfile(data.profile)
                } 

            } catch (error) {
                alert("Server API Arror Can't Fetch or Database is offline")
            }

        }

        getProduct()

    }, [router]);

    const handleLogOut = async () => {

        try {

             Swal.fire({
                title: 'Logging Out',
                text: 'Please wait...', color: '#ffffff',
                allowOutsideClick: false,
                didOpen: () => {
                Swal.showLoading(); // Show loading spinner
                },
                background: '#21262d'
            })

            const res = await fetch("/api/log_out", { method: "GET" })

            if (!res.ok) {
                throw new Error("Logout failed")
            }

            const data = await res.json()
            Swal.fire({
                title: 'Log Out',
                text: data.message,
                icon: 'success',
                background: '#222831',      // Custom background color
                color: '#ffffff',           // Optional: Text color
                confirmButtonColor: '#00adb5' // Optional: Button color
            }) .then(() => {
                router.push("/")
            });

            

        } catch (error) {
            alert("Internet Timeout OR Server Error")
            console.error(error)
        }

    }

    return (
        <div className="welcome_page">
            <div className="banners">
                <div className="banners_Lwidth">
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
                <div className="notifications">
                    <Image
                        src="/Icons/notification-bell.png"
                        alt="Notifications"
                        width={25}
                        height={25}
                    />
                </div>
                <div className="profile">
                    
                    <div className="profile_pic">
                    {user?.username && (
                       <Image
                       src={`${profile}${user.username}`}
                       alt="Sample"
                       fill
                       unoptimized
                    />
                    )}  
                    </div>
                    
                    <div className="profile_text">
                        <h1>{user ? user.username : "----"}</h1>
                    </div>
                    <div className="profile_option">
                        <button type="button" onClick={() => {router.replace("/main/Profile"); setLoading(true); }}>My Profile</button>
                        <button type="button" onClick={() => {router.replace("/main/SellerShop"); setLoading(true); }}>Sell Product</button>
                        <button type="button" onClick={() => {router.replace("/main/Settings"); setLoading(true); }}>Settings</button>
                        <button type="button" onClick={handleLogOut}>Log Out</button>
                    </div>
                </div>
                </div>
            </div>
            <div className="products_cons">
            <div className="products_cons_001">
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
                            <p>Price - {products_value.price}</p>
                        </div>
                        <div className="buttons">
                            <button>Cart</button>
                            <button>Order</button>
                        </div>
                    </div>    
                ))
            ) : (
                
                <>
                <span className="products_loading1"></span>
                <span className="products_loading2"></span>  
                <span className="products_loading3"></span>
                <span className="products_loading4"></span>      
                </>
                
            )}
            </div>
            </div>
            <span className={`${loading ? "loading": "hidden"}`}>
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
                
        </div>
    );
}
