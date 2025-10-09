import style from "./css/styles.module.css";

export default function Header() {
	return(
		<header className={style.header_header}>
			<div className={`flex ${style.container}`}>
				<div className={style.title}>
					<h2>Opera</h2>
				</div>
				<div className={`flex ${style.nav_and_buttons}`}>
					<nav>
						<ul className="flex">
							<li><a href="#">Home</a></li>
							<li><a href="#">Contacts</a></li>
						</ul>
					</nav>
					<button>Get Started</button>
				</div>
			</div>
		</header>
	);
}