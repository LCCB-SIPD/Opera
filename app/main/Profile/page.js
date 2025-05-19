"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2"
import "../../css/profile.css"

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState("");
    const [name, setName] = useState("")
    const [date, setDate] = useState("")
    const [address, setAddress] = useState("")
    const [loading, setLoading] = useState(true)
    const [Derror, setError] = useState('')
    const [hide, setHide] = useState(true)
    const [profile, setProfile] = useState('')
    const [imageSrc, setImagSrc] = useState('https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=')
    const [file, setFile] = useState(null)
    const [profile_val, setProfile_val] = useState([])

    //Data Information
   
    const [src, getSrc] = useState("/main/Iframe_buy_pro")

    const changeSrc = (newSrc) => {
        getSrc(newSrc)
    }

    const handleChangeFile = (e) => {

        const selectedFile = e.target.files[0]

        if (selectedFile) {

            setFile(selectedFile)
            setImagSrc(URL.createObjectURL(selectedFile))

        }

    }

    const username = user?.username || ""

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

        const getUser = async () => {

            try {
                const response = await fetch("/api/getUser", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username }),
                })

                const Exdata = await response.json()

                if (response.ok) {

                    setProfile_val(Exdata.data)
                    setProfile(Exdata.profile)
                    setLoading(false)

                } else {
                    setLoading(false)
                    setHide(false)   
                    setError(Exdata.error)

                }

            } catch (error) {
                
                setError("Connection Error or Databse is offline")

            }
        }

        if (username) {
            getUser()
        }

    }, [username, router])      
        
    const handleUpdate = async (e) => { 

        e.preventDefault()

        Swal.fire({
            title: 'Updating Your Profile',
            text: 'Please wait...',
            allowOutsideClick: false, color: '#ffffff',
            didOpen: () => {
            Swal.showLoading(); // Show loading spinner
            },
            background: '#21262d'
        })
        setHide(true)
        try {

            const formData = new FormData()
            formData.append("username", username)
            formData.append("name", name)
            formData.append("date", date)
            formData.append("address", address)

            if (file) {
                formData.append("img", file);
            } else {
                alert("Image Can't Upload");
                return;
            }

            const response = await fetch("/api/profile_set_up", {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if(response.ok) {
                 Swal.fire({
                    title: 'Updated',
                    text: data.message,
                    icon: 'success',
                    background: '#222831',      // Custom background color
                    color: '#ffffff',           // Optional: Text color
                    confirmButtonColor: '#00adb5' // Optional: Button color
                }).then(() => {
                    window.location.reload()
                }) 
            } else {
                setError(data.error)
                Swal.fire({
                    title: 'Error!',
                    text: data.error,
                    icon: 'error',
                    background: '#222831',      // Custom background color
                    color: '#ffffff',           // Optional: Text color
                    confirmButtonColor: '#00adb5' // Optional: Button color
                })
                setHide(false)
            }

        } catch (error) {
            setError('Error Database Connection')
        }

        const loadingSign = () => {

            setLoading(true)

            const timeOut = setTimeout(() => {}, 1000)

        }


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