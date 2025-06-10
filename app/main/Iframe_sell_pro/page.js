"use client"
import { useEffect, useState } from "react"
import "../../css/selled_prd.css"
import Image from "next/image"
import Swal from "sweetalert2"

export default function Sellproducts() {
    const [data, setData] = useState([])
    const [user, setUser] = useState("")
    const [imgUrl, setImgUrl] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCQ5DaMNfmNBEuQaBUawxCv2NOgV01Kmqj0Q&s')

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

        const getSellPrd = async () => {

            try {

                const response = await fetch("/api/showSelling", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username })
                })

                const result = await response.json()

                if (response.ok) {
                    
                    setImgUrl(result.img)

                    setData(result.data)

                }

            } catch(error) {

                console.error("Failed to Fetch: ", error)

                alert("Can't find User Data")

            } 

        }

        if (username) {
            getSellPrd()

        }

    }, [username])

    const handleDelete = async (id) => {

        if(confirm("Are you sure you want to delete this product?")) {

            Swal.fire({
                title: 'Deleting...',
                text: 'Please wait while we delete the product.',
                allowOutsideClick: false, color: '#ffffff',
                didOpen: () => {
                  Swal.showLoading(); // Show loading spinner
                },
                background: '#21262d'
              })

            const response = await fetch('/api/prd_dataDestroyer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id
                })
            })

            const result = await response.json()

            if (response.ok) {

                Swal.fire({
                    title: 'Deleted!',
                    text: result.message,
                    icon: 'success',
                    background: '#222831',      // Custom background color
                    color: '#ffffff',           // Optional: Text color
                    confirmButtonColor: '#00adb5' // Optional: Button color
                })
                .then(() => {
                    window.location.reload();
                });

            } else {

                Swal.fire({
                    title: 'Error!',
                    text: result.message,
                    icon: 'error',
                    background: '#222831',      // Custom background color
                    color: '#ffffff',           // Optional: Text color
                    confirmButtonColor: '#00adb5' // Optional: Button color
                })

            }

        } else {

            alert("Product deletion cancelled")

        }

    }

    return(
        <div className="selled_product">
            <h1><u>My Product</u></h1>
            <div className="selled_prd">

                {data && data.length > 0 ? (
                    data.map((prd_info) => (

                        <div key={prd_info.id} className="prd_info_selled">
                            <Image
                            src={`${imgUrl}prd_id=${prd_info.id}`}
                            alt="Img Prd"
                            width={150}
                            height={150}
                            unoptimized
                            />
                            <div className="prd_info">
                                <p className="prd_name">{prd_info.name}</p>
                                <p className="prd_price">Price: {prd_info.price}</p>
                                <p className="prd_time">Time Sell: {prd_info.time}</p>
                                <div className="prd_info_button">
                                    <button className="prd_info_button_white">Info</button>
                                    <button className="prd_info_button_red" onClick={() => handleDelete(prd_info.id)}>Delete</button>
                                </div>
                            </div>
                        </div>

                    ))


                ) : (

                    <>
                    
                    <span className="prd_info_selled1"></span>
                    <span className="prd_info_selled2"></span>
                    <span className="prd_info_selled3"></span>
                    <span className="prd_info_selled4"></span>

                    </>
                    

                )}

                

            </div>
        </div>
    )

}
