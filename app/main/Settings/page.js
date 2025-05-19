"use client"
import { useEffect ,useState } from "react";
import { ethers } from "ethers";

export default function Setting() {

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

    }, [])

    const ConnectNetwork = async () => {
        
        if (!window.ethereum) {
            alert("Please Install Metamask")
            return
        }

        try {

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const walletAddress = await signer.getAddress();
            setAddress(walletAddress);

            const response = await fetch('/api/web3_wallet', {

                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    address: address,
                    user_id: user.id
                })

            })

            const result = await response.json()
            
            if (response.ok) {
                alert(result.message)
            } else {
                alert(result.error)
            }


        } catch (error) {

            alert("Somethings Went Wrong")

        }
            

    };


    return(
        <div className="Settings">
            <button onClick={ConnectNetwork}>Connect Wallet</button>
        </div>
    )

}