"use client";
import { 
    Header,
    Banner,
    Footer
} from "@/app/components";
import { useEffect } from "react";
import {
    Fetchers
} from "@/app/utilities";

export default function Home() {

    useEffect(() => {

      Fetchers("/services/api/test_db", "GET");

    }, [])

    return (
        <>
            <Header />
            <Banner />
            <Footer />
        </>
    );
}
