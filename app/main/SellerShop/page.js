"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../../css/sellers.css"

export default function SellerShop() {

    const router = useRouter();
    const [user, setUser] = useState(null);
    const [prd_name, setPrd_name] = useState('')
    const [prd_price, setPrd_price] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const username = user?.username || ''

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

    const productHandle = async (e) => {

        setLoading(true)

        e.preventDefault()

        try {

            const response = await fetch('/api/seller_auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prd_name,
                    prd_price
                })
            })

            const fetchdata = await response.json()

            if(response.ok) {
                setLoading(false)
                setError(fetchdata.message)
            } else {
                setError(fetchdata.error)
            }

        } catch(error) {
            console.log(error)
            setError(error)
        } 

    }

    return(
        <div className="SellerShop">
            <form onSubmit={productHandle}>
                <div className="upload_img">
                <h1 className={`loading-screen ${loading ? "": "hidden"}`}>ADDING...</h1>
                    <h1>Feature Img Upload Currently On Development</h1>
                    <div className="prd_img">
                        <Image
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCQ5DaMNfmNBEuQaBUawxCv2NOgV01Kmqj0Q&s"
                            alt="Sample"
                            fill
                            unoptimized
                        />
                    </div>
                    <div className="prd_img_input">
                        <input type="file" disabled/>
                    </div>        
                </div>
                <div className="product_info">
                    <div>
                        <label htmlFor="product_name">Product Name: </label>
                        <input 
                        type="text" 
                        id="product_name" 
                        value={prd_name}
                        onChange={(e) => setPrd_name(e.target.value)}
                        placeholder="Enter Product Name"
                        required
                        />
                    </div>
                    <div>
                        <label htmlFor="product_price">Product Price: </label>
                        <input 
                        type="number" 
                        id="product_price" 
                        value={prd_price}
                        onChange={(e) => setPrd_price(e.target.value)}
                        placeholder="Enter Product Price"
                        required
                        />
                    </div>
                    <input 
                    type="hidden"
                    value="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCQ5DaMNfmNBEuQaBUawxCv2NOgV01Kmqj0Q&s"
                    />
                    {error && <p style={{ color: "#ff0" }}>{error}</p>}
 
                    <div>
                        <button type="button" onClick={() => router.push("/main/Home")}>Back</button>
                        <button type="submit">Add Product</button>
                    </div>
                </div>
            </form>
        </div>
    )

}
