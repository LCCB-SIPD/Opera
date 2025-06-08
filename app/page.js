"use client"
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const [connect, setConnect] = useState(false)
  const [status, setStatus] = useState("Connecting to Server")
  const [timer, setTimer] = useState("")
  let attemps = 0;

  const router = useRouter()
  
  const checkConnections = useCallback(async () => {
        
        if (attemps >= 5) {
        setStatus("Server Connection Error Reload the Browser")
        
        
        return
    }
    
    try{
        
        const response = await fetch("/api/checkCon")

      setConnect(true)
      
      attemps++
      
      if (response.ok) {

        router.push("/log_in")

        setStatus("Server Connected")

        setConnect(false)
        

      } else {
        
        setStatus(`Error Connections Retrying`)
        
        setTimeout(checkConnections, 3000)
        
      }
        
    } catch(error) {
        
        
         setStatus(error)
        
    }  
        
       
    }, [router, attemps])
    
    useEffect(() => {
    
        setTimeout(checkConnections, 8000)
   
    }, [checkConnections])

    

  return (
    <div className="container">
        <span className="loading_home">
            <span className="light_home"></span>
            <Image
            className="fade_in_image" 
            src="/Icons/logo-transparent.png" 
            alt="Loading..."
            width={120}
            height={120}
            unoptimized // Optional if you want to skip Next.js optimization for the image
            />
        </span>
        <span className={`status_load ${connect ? "" : "status_hide"}`}>
          <span><p>{status + timer}</p></span>
          </span>
    </div>
  );
}
