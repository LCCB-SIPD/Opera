"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

        setLoading(true)
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
                alert(data.message)
                window.location.reload()
            } else {
                setError(data.error)
                setLoading(false)
                setHide(false)
            }

        } catch (error) {
            setError('Error Database Connection')
        }


    }


    return(
        <div className="Profile">
            <div className="profile_info">
            {profile_val && profile_val.length > 0 ? (
                profile_val.map((profile_value) => (
                    <div key={profile_value[0].id} className="profile_info_cont">
                        <div className="profile_pic2">
                            {user?.username && (
                                <Image
                                src={`${profile}${user.username}`}
                                alt="Sample"
                                fill
                                unoptimized
                            />
                            )}
                        </div>
                        <div className="profile_data">
                            <div className="profile_infos">
                                <div>
                                    <h1>Name: {profile_value[0].name}</h1>
                                </div>
                                <div>
                                    <h1>Birthday: {profile_value[0].birth}</h1>
                                </div>
                                <div>
                                    <h1>Email: {profile_value[0].email}</h1>
                                </div>
                                <div>
                                    <h1>User ID: {profile_value[0].id}</h1>
                                </div>
                                <div>
                                    <h1>Address: {profile_value[0].address}</h1>
                                </div>
                                <div>
                                    <h1>Username: @{profile_value.username}</h1>
                                </div>
                                <div>
                                    <h1>Time Created: {profile_value[0].time_created}</h1>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                ))
            ) : (
                <h1 className={loading ? "": "hidden"}>Fetching Profile Data</h1>
            )}
            <span className={` ${loading ? "loading": "hidden"}`}>
                    <span className={` ${loading ? "light": "hidden"}`}></span>
                    <Image 
                    className={`${loading ? "": "hidden"}`}
                    src="/Icons/logo-transparent.png" 
                    alt="Loading..."
                    width={120}
                    height={120}
                    unoptimized // Optional if you want to skip Next.js optimization for the image
                    />
                </span>
            <div className={`${hide ? "hidden": "set_up_profile"}`}>
                        <form onSubmit={handleUpdate}>
                            <h1>Set up Profile Information</h1>
                            <div>
                                <div className="profile_img2_support">
                                    <Image
                                        src={imageSrc}
                                        alt="Sample"
                                        fill
                                        unoptimized
                                    />
                                </div>
                                <div className="profile_img2_input">
                                    <input 
                                    type="file" 
                                    accept="image/*"
                                    className="pic_input" 
                                    onChange={handleChangeFile} required/>
                                </div>        
                            </div>
                            <div>
                                <label htmlFor="name">Name: </label>
                                <input 
                                    type="text" 
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="birth">Birthday: </label>
                                <input 
                                    type="date" 
                                    id="birth"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)} 
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="address">Address: </label>
                                <input 
                                    type="text" 
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    autoComplete="address" 
                                    required
                                />
                            </div>
                            <div>
                                <button type="submit">Update</button>
                            </div>
                            {Derror && <p style={{ color: "#f00" }}>{Derror}</p>}
                        </form>
                    </div>
            </div>
            <div className="inventory">
                <div className="inventory_banners">
                    <button type="button" onClick={() => {router.replace("/main/Home"); setLoading(true); }}>&larr; Back</button>
                    <button type="button" onClick={() => changeSrc("/main/Iframe_buy_pro")}>DashBoard</button>
                    <button type="button" onClick={() => changeSrc("/main/Iframe_buy_pro")}>Your Ordered</button>
                    <button type="button" onClick={() => changeSrc("/main/Iframe_buy_pro")}>Carts</button>
                    <button type="button" onClick={() => changeSrc("/main/Iframe_sell_pro")}>Your Products</button>
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