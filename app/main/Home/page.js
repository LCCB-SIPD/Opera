"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2"
import "@/app/css/home.css"
import { useAccount, useWalletClient, usePublicClient, useDisconnect } from "wagmi";
import { parseUnits, erc20Abi } from "viem";
import useOFABalance from "@/app/components/C_walletBal"

export default function Home() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState('')
    const [loading, setLoading] = useState(false)
    const [imgUrl, setImgUrl] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCQ5DaMNfmNBEuQaBUawxCv2NOgV01Kmqj0Q&s')
    const [products_val, setProducts_val] = useState([])
    const [search, setSearch] = useState("")
    const { disconnect } = useDisconnect()
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();
    const walletBal = useOFABalance()
    
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
            
            try {
                const response = await fetch("/api/getProduct");
                const data = await response.json();
    
                if (response.ok) {
                    setProducts_val(data.data); 
                    console.log("Status: ", data.message)
                    setImgUrl(data.imgUrl)
                    setProfile(data.profile)
                } 

            } catch (error) {
                alert("Server API Arror Can't Fetch or Database is offline")
            }

        }

        getProduct()
        
    }, [router]);

    const handleLogOut = async () => {
    
    
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: 'You are about to disconnect your wallet.',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes, logout',
          cancelButtonText: 'No, stay connected',
          reverseButtons: true,
          background: '#21262d',
          color: '#ffffff'
        });
        
        if (!result.isConfirmed) return; 

        try {

             Swal.fire({
                title: 'Logging Out',
                text: 'Please wait...', color: '#ffffff',
                allowOutsideClick: false,
                didOpen: () => {
                Swal.showLoading(); // Show loading spinner
                },
                background: '#21262d',
                color: '#ffffff'
            })

            const res = await fetch("/api/log_out", { method: "GET" })

            if (!res.ok) {
                throw new Error("Logout failed")
            }
            
            disconnect()
            
            const data = await res.json()
            Swal.fire({
                title: 'Log Out',
                text: data.message,
                icon: 'success',
                background: '#222831',
                color: '#ffffff', 
                confirmButtonColor: '#00adb5'
            }) .then(() => {
                setLoading(true)
                router.push("/log_in")
                
            });

            
        } catch (error) {
            Swal.fire({
                title: 'Connection Failed',
                text: 'Try Again Later',
                icon: 'error',
                background: '#222831',
                color: '#ffffff',
                confirmButtonColor: '#00adb5'
            })
            console.error(error)
        }

    }
    
    
    const handleBuy = async(name, price, prId, owner, quantity) => {
        
        
        if (!walletClient || !address) {
            
            Swal.fire({
                title: 'No Wallet Detected',
                text: 'Please connect your wallet first',
                icon: 'warning',
                background: '#222831',
                color: '#ffffff',
                confirmButtonColor: '#00adb5'
            })
            return
        }
    
        Swal.fire({
          title: `${name}`,
          html: `<p>Stocks: ${quantity.toLocaleString()}</p>
                 <p style="color: #0f0;">Price: ${price.toLocaleString()} AFO</p>
          `,
          imageUrl: `${imgUrl}prd_id=${prId}`,
          imageWidth: 200,
          color: '#ffffff',
          background: '#222831',
          imageHeight: 200,
          imageAlt: 'Product Image',
          input: 'number',
          inputAttributes: {
            min: 1,
            max: 10,
            step: 1
          },
          inputValidator: (value) => {
          if (!value || value <= 0) {
             return 'Please enter a valid quantity!';
          } else if (value > quantity) {
              return 'Quantity Exceed!!';
          }
          },
          showCancelButton: true,
          confirmButtonText: 'Order',
          cancelButtonText: 'Cancel',
          reverseButtons: true,
          }).then(async(result) => {
              
              if (result.isConfirmed) {
              
              const quanty = result.value
              const resultValWarp = quanty * price
              const resultVal = resultValWarp.toLocaleString()
              
              Swal.fire({
                    title: 'Checking Your Wallet',
                    text: 'Please Wait...', 
                    icon : 'info',
                    color: '#ffffff',
                    allowOutsideClick: false,
                    didOpen: () => {
                    Swal.showLoading();
                    },
                    background: '#21262d',
                    color: '#ffffff'
                 })
              
              try {
                
                const response = await fetch('/api/getUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: owner
                    })
                })

                const result = await response.json()

                if (!response.ok) return;

                const sellerAddress = result.data?.walletAddress
                
                 if (sellerAddress === address.toLowerCase() || owner === user.username) {
                  await Swal.fire({
                  title: 'Invalid Actions',
                  text: 'Change Your Wallet or Same User as Owners',
                  icon: 'warning',
                  background: '#222831',
                  color: '#ffffff',
                  confirmButtonColor: '#00adb5'
                  })
                  return
                 }
                
                
                const walletBalWarp = Number(walletBal).toLocaleString()
                
              const result2 = await Swal.fire({
                title: 'Double Check Your Purchase',
                html: `
                    
                    <p style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">from: ${address}</p>
                    <p style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: #0ff;">balance: ${walletBalWarp !== null ? `${walletBalWarp} OFA` : 'Fetching Balance...'}</p>
                    <p>quantity: ${quanty}</p>
                    <p>value: ${resultVal}</p>
                    <p style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">to: ${sellerAddress}</p>
                `,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
                background: '#21262d',
                color: '#ffffff'
              })
              
              
              if (!result2.isConfirmed) return;
              
              const quantyDeduc =  quantity - quanty
              
              if (walletBal <= resultValWarp) {
                  await Swal.fire({
                  title: 'insufficient balance',
                  text: 'Change Wallet Address or Make a Deposit',
                  icon: 'warning',
                  background: '#222831',
                  color: '#ffffff',
                  confirmButtonColor: '#00adb5'
                  })
                  return
              }
              
              
          
              Swal.fire({
                title: 'Confirming Transaction',
                text: 'Validating...', 
                icon : 'info',
                color: '#ffffff',
                allowOutsideClick: false,
                didOpen: () => {
                Swal.showLoading();
                },
                background: '#21262d',
                color: '#ffffff'
             })
                
                const tokenAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
                
                const decimal = 18
                
                if (typeof resultValWarp !== 'number') {
                  alert("Invalid price");
                  return;
                }

                const amount = parseUnits(resultValWarp.toString(), decimal);
                
                const txHash = await walletClient.writeContract({
                    address: tokenAddress,
                    abi: erc20Abi,
                    functionName: 'transfer',
                    args: [sellerAddress, amount],
                    account: address
                })
                
                if (txHash) {
                
                
                const response = await fetch('/api/up_quantity', {
                  method: 'POST',
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ 
                  
                  productId: prId,
                  quanty: quantyDeduc
                  
                  })
                    
                    
                })
                
                
                const result = response.json()
                
                if (response.ok) {
                
                    
                    const ordered = await fetch('/api/ordered', {
                        method: 'POST',
                        headers: {
            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                        username: user.username,
                        owner: owner,
                        txHash: txHash,
                        name: name,
                        address: address,
                        sellerAddress: sellerAddress,
                        quanty: quanty,
                        resultVal: resultVal
                        }),
                    })
                
                    const ordered_result = await ordered.json()
                    if (ordered.ok) {
                    Swal.fire({
                        title: 'Purchased!',
                        text: `You bought ${name}, ${quanty} items for ${resultVal} AFO.`,
                        icon: 'success',
                        background: '#222831',
                        color: '#ffffff',
                        confirmButtonColor: '#00adb5'
                      }).then(() => {
                          window.location.reload()
                      })
                      
                    } else {
                        Swal.fire({
                        title: 'Purchased! but their as an error',
                        text: `You bought ${name}, ${quanty} items for ${resultVal} AFO.`,
                        icon: 'warning',
                        background: '#222831',
                        color: '#ffffff',
                        confirmButtonColor: '#00adb5'
                      }).then(() => {
                          window.location.reload()
                      })
                    }
                    
                      
                      
                } else {
                    
                 await Swal.fire({
                  title: 'Error!',
                  text: 'Database Error',
                  icon: 'error',
                  background: '#222831',
                  color: '#ffffff',
                  confirmButtonColor: '#00adb5'
                })
                
                console.error(result.error)
                    
                }
                
                   
                } 
                
                    
            } catch (error) {
                await Swal.fire({
                  title: 'Error!',
                  text: 'Somethings Went Wrong',
                  icon: 'error',
                  background: '#222831',
                  color: '#ffffff',
                  confirmButtonColor: '#00adb5'
                })
                console.error(error)

            } 
              
            }
              
          })
            
    }
    
    
    const handleSearch = async (e) => {
        
        e.preventDefault()
        
        try{
            
            setProducts_val([])
            
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({   
                    search: search
                })
            })
            
            const result = await response.json()
            
            if (response.ok) {
            
                setProducts_val(result.data)
                
            }
            
        } catch(error) {
            
            console.error(error)
             
        }
    }

    return (
        <div className="welcome_page">
            <div className="banners">
                <div className="banners_Lwidth">
                <div className="title">
                    <Image 
                    src="/Icons/logo-transparent.png"
                    alt="logo"
                    width={40}
                    height={40}
                    />
                    <h1>One For All</h1>
                </div>
                <div className="searchBar">
                    
                <form onSubmit={handleSearch} className="searchBar">
                 <input 
                    type="text" 
                    id="search"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </form>  
                   
                </div>
                <div className="notifications">
                    <Image
                        src="/Icons/notification-bell.png"
                        alt="Notifications"
                        width={25}
                        height={25}
                    />
                </div>
                <div className="profile">
                    
                    <div className="profile_pic">
                    {user?.username && (
                       <Image
                       src={`${profile}${user.username}`}
                       alt="Sample"
                       fill
                       unoptimized
                    />
                    )}  
                    </div>
                    
                    <div className="profile_text">
                        <h1>{user ? user.username : "----"}</h1>
                    </div>
                    <div className="profile_option">
                        <button type="button" onClick={() => {router.replace("/main/Profile"); setLoading(true); }}>My Profile</button>
                        <button type="button" onClick={() => {router.replace("/main/SellerShop"); setLoading(true); }}>Sell Product</button>
                        <button type="button" onClick={() => {router.replace("/main/Wallet"); setLoading(true); }}>Wallet</button>
                        <button type="button" onClick={handleLogOut}>Log Out</button>
                    </div>
                </div>
                </div>
            </div>
            <div className="products_cons">
            <div className="products_cons_001">
            { products_val && products_val.length > 0 ? (
                products_val.map((products_value) => (
                    <div className="products" key={products_value.id}>
                        <div className="products_image">
                            <Image
                                src={`${imgUrl}prd_id=${products_value.id}`}
                                alt="Sample"
                                fill
                                unoptimized
                            />
                        </div>
                        <div className="product_info">
                            <h2>{products_value.name}</h2>
                            <h3>Owner: {products_value.owner}</h3>
                            <h3>Categories: {products_value.categories}</h3>
                            <p>Price - {products_value.price.toLocaleString()} OFA</p>
                        </div>
                        <div className="buttons">
                            <button>Cart</button>
                            <button onClick={() => { handleBuy(products_value.name, products_value.price, products_value.id, products_value.owner, products_value.quantity) }}>Order</button>
                        </div>
                    </div>    
                ))
            ) : (
                
                <>
                <span className="products_loading1"></span>
                <span className="products_loading2"></span>  
                <span className="products_loading3"></span>
                <span className="products_loading4"></span>      
                </>
                
            )}
            </div>
            </div>
            <span className={`${loading ? "loading": "hidden"}`}>
                    <span className={` ${loading ? "light": "hidden"}`}></span>
                    <Image 
                    className={`${loading ? "fade_in_image_load": "hidden"}`}
                    src="/Icons/logo-transparent.png" 
                    alt="Loading..."
                    width={120}
                    height={120}
                    unoptimized // Optional if you want to skip Next.js optimization for the image
                    />
                </span>
                
        </div>
    );
}
