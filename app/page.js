"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Home() {

  const [connect, setConnect] = useState(false)
  const [status, setStatus] = useState("")
  const [timer, setTimer] = useState("")

  const router = useRouter()

  useEffect(() => {

    const checkConnections = async () => {

      const response = await fetch("/api/checkCon")

      setConnect(true)

      if (response.ok) {

        router.push("/log_in")

        clearInterval(interval)

        setStatus("Connected")

        setConnect(false)

      } else {

        setStatus("Error Retrying in ")

        setTimer(5)

            const countdown = setInterval(() => {

                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdown);
                        setStatus("")
                        setTimer("")
                        return 0;
                    }
                    return prev - 1;
                });
                
          }, 1000);

      }

    }

    

    const interval = setInterval(checkConnections, 10000)

   
  }, [router])

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
