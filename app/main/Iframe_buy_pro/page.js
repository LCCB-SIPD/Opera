"use client"
import "@/app/css/ordered.css"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Buyproducts() {
    const router = useRouter();
    const [user, setUser] = useState("");
    const [products_val, setProducts_val] = useState([])  
    
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
                
            } catch (error) {
                router.replace("/");
            }
        };

        checkAuth();
        
        
        
        const getProduct = async () => {
        
        
            if (usernameData === null) return
            
            try {
                const response = await fetch("/api/get_ordered", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: usernameData
                    })
                });
                const data = await response.json();
                
                if (response.ok) {
                    setProducts_val(data.data); 
                    console.log("Status: ", data.data)
                } 

            } catch (error) {
                console.error(error)
                alert("Server API Arror Can't Fetch or Database is offline")
            }

        }

        getProduct()
        
    }, [router, usernameData])
    
    
    
    
    return(
    <div className="ordered">
       <h1>My Ordered</h1>
    <table className="ordered_table">
    <thead>
      <tr>
        <th>TRHash</th>
        <th>product name</th>
        <th>chain from</th>
        <th>chain to</th>
        <th>username from</th>
        <th>username to</th>
        <th>quantity</th>
        <th>value</th>
      </tr>
    </thead>
    <tbody>
        { products_val && products_val.length > 0 ? (
                products_val.map((products_value) => (
       <tr key={products_value.id}>
        <td>{products_value.trhash}</td>
        <td>{products_value.pr_name}</td>
        <td>{products_value.chain_from}</td>
        <td>{products_value.chain_to}</td>
        <td>{products_value.username_from}</td>
        <td>{products_value.username_to}</td>
        <td>{products_value.quantity}</td>
        <td>{products_value.value}</td>
        </tr>
                ))
            ) : (
                
                <>
                <tr>
                <td>No Data</td>  
                </tr> 
                </>
                
            )}
      
    </tbody>
  </table>
        </div>
    )

}
