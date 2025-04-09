"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2"
import "../../css/sellers.css"

export default function SellerShop() {

    const router = useRouter();
    const [user, setUser] = useState(null);
    const [prd_name, setPrd_name] = useState('')
    const [prd_price, setPrd_price] = useState('')
    const [categories, setCategories] = useState('')
    const [quantity, setQuantity] = useState('')
    const [error, setError] = useState('')
    const [errorColor, setErrorColor] = useState(true);
    const [loading, setLoading] = useState(false)
    const [imageSrc, setImagSrc] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCQ5DaMNfmNBEuQaBUawxCv2NOgV01Kmqj0Q&s')
    const [file, setFile] = useState(null)
    const [generateCode, setGenerateCode] = useState('')
    const [code, setCode] = useState('')
    const [v_button, setVbutton] = useState(false)
    const [timer, setTimer] = useState(0)

    const email = user?.email || ''

    const ConfirmEmail = async () => {

        if (!prd_name || !prd_price || !categories || !quantity || !email) {
            setError("Please Input Your Credentials First")
            setErrorColor(true)
            return
        }

        setVbutton(true)

        try {

            setTimer(60)

            

            const countdown = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdown);
                        setVbutton(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            Swal.fire({
                title: 'Sending Verification Code',
                text: 'Please wait...', color: '#ffffff',
                allowOutsideClick: false,
                didOpen: () => {
                Swal.showLoading(); // Show loading spinner
                },
                background: '#21262d'
            })

            const response = await fetch("../api/c_email", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    username
                })
            })            

            const result = await response.json()

            if (response.ok) { 

                setGenerateCode(result.message)
                Swal.fire({
                    title: 'Successfully Send',
                    text: `Code Successfully Sent to ${email}`,
                    icon: 'success',
                    background: '#222831',      // Custom background color
                    color: '#ffffff',           // Optional: Text color
                    confirmButtonColor: '#00adb5' // Optional: Button color
                })
                setError(`Code Successfully Sent to ${email}`)
                setErrorColor(false)

            } else {
                Swal.fire({
                    title: 'Error',
                    text: result.message,
                    icon: 'error',
                    background: '#222831',      // Custom background color
                    color: '#ffffff',           // Optional: Text color
                    confirmButtonColor: '#00adb5' // Optional: Button color
                })
                setError(result.error)
                setErrorColor(true)
                setTimer(0)
            }

        } catch (error) {

            setError("Somethings went wrong")
            setErrorColor(true)
            console.error(error)
            setLoading(false)
        }

    }

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

        e.preventDefault()

        if (prd_name.length > 15) {
            setError("Product Name should be only 15 characters")
            setErrorColor(true)
            return
        }

        if (!generateCode || generateCode !== code) {
            setError("Input Verification first")
            setErrorColor(true)
            return
        }

        Swal.fire({
            title: 'Uploading',
            text: 'Please wait...',
            color: '#ffffff',
            allowOutsideClick: false,
            didOpen: () => {
            Swal.showLoading(); // Show loading spinner
            },
            background: '#21262d'
        })

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
                setError(fetchdata.message)
                Swal.fire({
                    title: 'Uploaded Successfully',
                    text: fetchdata.message,
                    icon: 'success',
                    background: '#222831',      // Custom background color
                    color: '#ffffff',           // Optional: Text color
                    confirmButtonColor: '#00adb5' // Optional: Button color
                }).then(() => {
                    router.push("/main/Home")
                });
                
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: fetchdata.error,
                    icon: 'error',
                    background: '#222831',      // Custom background color
                    color: '#ffffff',           // Optional: Text color
                    confirmButtonColor: '#00adb5' // Optional: Button color
                })
                setError(fetchdata.error)
                setErrorColor(true)
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
                        <input 
                        type="file" 
                        accept="image/*"
                        className="pic_input" 
                        onChange={handleChangeFile} required/>
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
                        maxLength={15}
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
                    
                    <div>
                    <label htmlFor="Code">C_email:</label>
                    <input 
                    type="number" 
                    id="Code" 
                    value={code}
                    onChange={(e) => setCode(e.target.value)} 
                    placeholder="Confirm Email"/>
                    <button type="button" onClick={ConfirmEmail} disabled={v_button}>{v_button ? `${timer}`: "Send"}</button>
                    </div>
                    
                    {error && <p className={`error ${errorColor ? "": "success"}`}>{error}</p>}
                    <div>
                        <button type="button" onClick={() => {router.replace("/main/Home"); setLoading(true); }}>Back</button>
                        <button type="submit">Sell Product</button>
                    </div>
                </div>
            </form>
        </div>
    )

}
