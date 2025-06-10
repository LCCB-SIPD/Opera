'use client';
import { useState, useEffect, useRef } from "react"
import "@/app/css/profile_info.css"
import Image from "next/image"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation";

export default function ProfileInfo() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [birthday, setBirthday] = useState('')
  const [user, setUser] = useState("")
  const [userData, setUserdata] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errorColor, setErrorColor] = useState(true);
  const [imageSrc, setImagSrc] = useState('sample')
  const [file, setFile] = useState(null)
  
  const usernameData = user.username ?? null
  
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
                console.log(`User Data ${userData}`)
            } catch (error) {
                alert("somthings went wrong")
            }
        };
        checkAuth();
        
        const getUser = async () => {
          
            if (usernameData === null) return

            try {

                const response = await fetch('/api/getUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: usernameData
                    })
                })

                const result = await response.json()

                if (response.ok) {

                    setImagSrc(result.profile + usernameData)                
     
                    setUserdata(result.data)

                } 

            } catch (error) {

                console.error("Somethings Went Wrong")

            }

        }

        getUser()
        
        
        
  }, [router, usernameData])
  
  const handleSubmit = async (e) => {
      
      e.preventDefault()
      
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
            formData.append('name', name)
            formData.append('address', address)
            formData.append('walletAddress', walletAddress)
            formData.append('birthday', birthday)
            formData.append('username', user.username)

            if (file) {
                formData.append("img", file);
            }

            const response = await fetch('/api/profile_set_up', {
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
                    window.location.reload()
                });
                
            } else {
                Swal.fire({
                    title: 'Invalid',
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
                
                alert("something went wrong")
                
                console.log(error)
                
            }
      
  }
  
  const handleChangeFile = (e) => {

        const selectedFile = e.target.files[0]

        if (selectedFile) {
            
            setFile(selectedFile)
            setImagSrc(URL.createObjectURL(selectedFile))

        }

    }

  return (
    <div className='profile_info1'>
      <h1>Update Profile Info</h1>
      <form onSubmit={handleSubmit}>
                
                <div className="prd_img">
                        <Image
                            src={imageSrc}
                            alt="Sample"
                            width={120}
                            height={120}
                            unoptimized
                        />
                    </div>
                    <div className="prd_img_input">
                        <input 
                        type="file" 
                        accept="image/*"
                        className="pic_input" 
                        onChange={handleChangeFile} 
                        />
                    </div>
                
                <div>
                    <label htmlFor="fname">Name: </label>
                    <input 
                    type="text" 
                    id="fname" 
                    value={name} 
                    placeholder={userData.name}
                    onChange={(e) => setName(e.target.value)} 
                    autoComplete="fname"/>
                    
                </div>
                
                <div>
                    <label htmlFor="address">address: </label>
                    <input 
                    type="address" 
                    id="address" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    placeholder={userData.address}
                    autoComplete="address"/>
                    
                </div>
                
                <div>
                    <label htmlFor="walletAddress">Shop Address: </label>
                    <input 
                    type="text" 
                    id="walletAddress" 
                    value={walletAddress} 
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder={userData.walletAddress}
                    autoComplete="walletAddress"/>
                    
                </div>
                
                <div>
                    <label htmlFor="birthday">Birthday: {userData.birth}</label>
                    <input 
                    type="date" 
                    id="birthday" 
                    value={birthday} 
                    onChange={(e) => setBirthday(e.target.value)} 
                    autoComplete="birthday"/>
                    
                </div>
                
                
                {error && <p className={`error ${errorColor ? "": "success"}`}>{error}</p>}
                <div>
                    <button type="submit" disabled={loading}>{loading ? "Loading..." : "Confirm"}</button>
                </div>
            </form>
    </div>
  );
}
