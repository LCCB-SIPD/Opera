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
    const [categories, setCategories] = useState('')
    const [quantity, setQuantity] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [imageSrc, setImagSrc] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCQ5DaMNfmNBEuQaBUawxCv2NOgV01Kmqj0Q&s')
    const [file, setFile] = useState(null)


    const handleChangeFile = (e) => {

        const selectedFile = e.target.files[0]

        if (selectedFile) {

            setFile(selectedFile)
            setImagSrc(URL.createObjectURL(selectedFile))

        }

    }

    const userId = user?.id || ''

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
    }, [router]);

    const productHandle = async (e) => {

        if (prd_name.length > 8) {
            setError("Product Name should be only 8 characters")
            return
        }

        setLoading(true)

        e.preventDefault()

        try {

            const formData = new FormData();
            formData.append('prd_name', prd_name)
            formData.append('prd_price', prd_price)
            formData.append('userId', userId)
            formData.append('username', username)
            formData.append('quantity', quantity)
            formData.append('categories', categories)

            if (file) {
                formData.append("img", file);
            } else {
                alert("Image Can't Upload");
                return;
            }

            const response = await fetch('/api/seller_auth', {
                method: 'POST',
                body: formData
            })

            const fetchdata = await response.json()

            if(response.ok) {
                setLoading(false)
                setError(fetchdata.message)
            } else {
                setLoading(false)
                setError(fetchdata.error)
            }

        } catch(error) {
            setLoading(false)
            console.log(error)
            setError(error)
        } 

    }

    return(
        <div className="SellerShop">
            <form onSubmit={productHandle}>
                <div className="upload_img">
                <h1 className={`${loading ? "": "hidden"}`}>UPLOADING...</h1>
                    <h1>Feature Img Upload Currently is On Development</h1>
                    <div className="prd_img">
                        <Image
                            src={imageSrc}
                            alt="Sample"
                            fill
                            unoptimized
                        />
                    </div>
                    <div className="prd_img_input">
                        <input type="file" accept="image/*" onChange={handleChangeFile} required/>
                    </div>        
                </div>
                <div className="product_info2">
                    <div>
                        <label htmlFor="product_name">Product Name: </label>
                        <input 
                        type="text" 
                        id="product_name" 
                        value={prd_name}
                        onChange={(e) => setPrd_name(e.target.value)}
                        placeholder="Enter Product Name"
                        maxLength={10}
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
                        maxLength={5}
                        required
                        />
                    </div>
                    <div>
                        <label htmlFor="categories">Categories: </label>
                        <input 
                        type="text" 
                        id="categories" 
                        value={categories}
                        onChange={(e) => setCategories(e.target.value)}
                        placeholder="Enter Categories"
                        maxLength={10}
                        required
                        />
                    </div>
                    <div>
                        <label htmlFor="quantity">Quantity: </label>
                        <input 
                        type="number" 
                        id="quantity" 
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Enter Quantity"
                        maxLength={5}
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
                        <button type="submit">Sell Product</button>
                    </div>
                </div>
            </form>
        </div>
    )

}
