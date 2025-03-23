"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Welcome() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth", { credentials: "include" });
                if (!res.ok) {
                    router.push("/"); // Redirect if not authenticated
                    return;
                }
                const userData = await res.json();
                setUser(userData);
            } catch (error) {
                router.push("/");
            }
        };

        checkAuth();
    }, []);

    return (
        <div>
            <h1>Welcome {user ? user.username : "User"}!</h1>
        </div>
    );
}
