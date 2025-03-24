"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../../css/profile.css"

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState("");
    const [name, setName] = useState("")
    const [date, setDate] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [hide, setHide] = useState(false)

    //Data Information
    const [ExName, getExname] = useState("")
    const [ExBirth, getExbirth] = useState("")
    const [ExUsername, getExusername] = useState("")
    const [ExEmail, getExemail] = useState("")
    const [ExId, getExid] = useState("")
    const [src, getSrc] = useState("/main/Iframe_buy_pro")


    const changeSrc = (newSrc) => {
        getSrc(newSrc)
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

        if (username) {
            getUser()
        }

    }, [username])

        const getUser = async () => {
            try {
                const response = await fetch("/api/getUser", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username }),
                    credentials: "include"
                })

                const Exdata = await response.json()

                if (response.ok) {

                    setHide(true)
                    getExname(Exdata.data.name)
                    getExid(Exdata.data.id)
                    getExusername(Exdata.data.username)
                    getExemail(Exdata.data.email)
                    getExbirth(Exdata.data.birth)

                } else {

                    setError(data.error)

                }

            } catch (error) {

                setError("Failed to Connect try again later")

            }
        }
            
        
    const handleUpdate = async (e) => { 

        e.preventDefault()

        setLoading(true)

        try {

            const response = await fetch('/api/profile_set_up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    name,
                    date
                })
            })

            const data = await response.json()

            if(response.ok) {
                alert(data.message)
                window.location.reload()
            } else {
                setError(data.error)
                setLoading(false)
            }

        } catch (error) {
            setError('Error Database Connection')
        }


    }


    return(
        <div className="Profile">
            <div className="profile_info">
                <div className="profile_pic2">
                    <Image
                        src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                        alt="Sample"
                        fill
                        unoptimized
                    />
                </div>
                <div className="profile_data">
                    <div className="profile_infos">
                        <div>
                            <h1>Name: {ExName}</h1>
                        </div>
                        <div>
                            <h1>Birthday: {ExBirth}</h1>
                        </div>
                        <div>
                            <h1>Email: {ExEmail}</h1>
                        </div>
                        <div>
                            <h1>User ID: {ExId}</h1>
                        </div>
                        <div>
                            <h1>Username: @{ExUsername}</h1>
                        </div>
                    </div>
                    <div className={`${hide ? "hidden": "set_up_profile"}`}>
                        <form onSubmit={handleUpdate}>
                            <h1>Set up Profile Information</h1>
                            <div>
                                <label htmlFor="name">Name: </label>
                                <input 
                                type="text" 
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                                required/>
                            </div>
                            <div>
                                <button type="submit">Update</button>
                            </div>
                            {error && <p style={{ color: "#f00" }}>{error}</p>}
                            <h1 className={`loading-screen ${loading ? "": "hidden"}`}>Updating...</h1>

                        </form>
                    </div>
                </div>
                
            </div>
            <div className="inventory">
                <div className="inventory_banners">
                    <button type="button" onClick={() => changeSrc("/main/Iframe_buy_pro")}>Buy Products</button>
                    <button type="button" onClick={() => changeSrc("/main/Iframe_sell_pro")}>Sell Products</button>
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