import style from "./css/styles.module.css";
import { useRouter } from "next/navigation";

export default function Banner() {
    const router = useRouter()

    return(
        <section className={style.banner_section}>
            <div className={`flex ${style.container_and_title}`}>
                <h1>Opera | Next-Gen Shopping with Crypto | Web3 eCommerce for Everyone</h1>
                <p>Discover Opera, a Web3 eCommerce platform that lets you buy, sell, and earn using crypto. Own your data and shop without middlemen.</p>
                <button onClick={() => router.push("/signup")}>Get Started</button>
            </div>
        </section>
    );
}