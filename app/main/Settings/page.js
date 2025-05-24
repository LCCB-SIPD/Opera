"use client"
import { useEffect ,useState } from "react";
import Swal from "sweetalert2"
import { useRouter } from "next/navigation";
import { Web3Modal } from "@web3modal/standalone";
import { BrowserProvider } from "ethers";

export default function Setting() {
    const router = useRouter();
    const [address, setAddress] = useState('')
    const [user, setUser] = useState('')

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

    }, [router])

    const ConnectNetwork = async () => {
        
        try {
        
            const web3Modal = new Web3Modal({
                projectId: '53bd961a5625d0b5c5d2ad9bf5e8e912',
                themeMode: 'dark'
            })
            
            web3Modal.openModal()
            
            const provider = await web3Modal.connect()
            
            const ethersProvider = new BrowserProvider.providers.Web3Provider(provider)
            
            const signer = ethersProvider.getSigner()
            
            const walletAddress = await signer.getAddress()
                  
               
               Swal.fire({
                title: 'Connecting Wallet',
                text: 'Fetching Wallet Address Please wait...', color: '#ffffff',
                allowOutsideClick: false,
                didOpen: () => {
                Swal.showLoading(); // Show loading spinner
                },
                background: '#21262d'
            })

            const response = await fetch('/api/web3_wallet', {

                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    address: walletAddress,
                    user_id: user.id
                })

            })

            const result = await response.json()
            
            if (response.ok) {
                Swal.fire({
                    title: 'Connected Successfully',
                    text: result.message,
                    icon: 'success',
                    background: '#222831',      // Custom background color
                    color: '#ffffff',           // Optional: Text color
                    confirmButtonColor: '#00adb5' // Optional: Button color
                })
            } else {
                Swal.fire({
                    title: 'Error',
                    text: result.error,
                    icon: 'error',
                    background: '#222831',      // Custom background color
                    color: '#ffffff',           // Optional: Text color
                    confirmButtonColor: '#00adb5' // Optional: Button color
                })
            }
              


        } catch (error) {

            Swal.fire({
                    title: 'Error',
                    text: error,
                    icon: 'error',
                    background: '#222831',
                    color: '#ffffff',
                    confirmButtonColor: '#00adb5'
                })
                
              

        }
            

    };


    return(
        <div className="Settings">
            <div className="settings_options">

            </div>
            <div className="">

            </div>
            <button onClick={ConnectNetwork}>Connect Wallet</button>
        </div>
    )

}
