"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const [connect, setConnect] = useState(false)
  const [status, setStatus] = useState("")
  const [timer, setTimer] = useState("")
  let attemps = 0;
  const retry = 1;

  const router = useRouter()

  useEffect(() => {
    
    checkConnections()
   
  }, [router])
  
  const checkConnections = async () => {
    
    
    try{
        
        const response = await fetch("/api/checkCon")

      setConnect(true)
      

      if (response.ok) {

        router.push("/log_in")

        setStatus("Connected")

        setConnect(false)

      } else {
        setTimeout(retryCountDown, 6000)
       
      }
        
    } catch(error) {
        
        setTimeout(retryCountDown, 6000)
        
        
    }  

    }

    const retryCountDown = () => {
    
    if (timer > 1) return;
     
     setStatus("Error Retrying in ")

        setTimer(5)
        
        attemps++

            const countdown = setInterval(() => {

                setTimer((prev) => {
                    if (prev < 1) {
                        clearInterval(countdown);
                        setStatus("")
                        checkConnections()
                        return 0;
                        
                    }
                    return prev -= 1;
                });
                
          }, 1000);
     
     
     }

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
          <span><p>Connecting to Server {status + timer}</p></span>
          </span>
    </div>
  );
}
