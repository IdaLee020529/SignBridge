import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { useTheme } from "../../store/theme";
import "./Navbar.css";
import Cookies from "js-cookie";
import { LogoutUser } from "../../services/account.service";

function Navbar() {
	const navigate = useNavigate();
	const [click, setClick] = useState(false);
	const [button, setButton] = useState(true);
	const [name, setName] = useState("");
	const [picture, setPicture] = useState("");
	const userRole = Cookies.get("role_access");
	const { color, updateColors } = useTheme();

	//console.log("User Role: ", userRole);

	// Function to set user authentication status in session storage when user logs in
	const setUserLoggedIn = () => {
		sessionStorage.setItem("isLoggedIn", "true");
	};

	// Function to check if user is logged in based on session storage
	const isUserLoggedIn = () => {
		//console.log("Is user login:", Cookies.get("token"));
		return Cookies.get("token") ? true : false;
	};

	const isLoggedIn = isUserLoggedIn();

	// Function to clear user authentication status from session storage when user logs out
	const handleLogout = async () => {
		await LogoutUser({
			email: Cookies.get("email"),
		});

		// remove the name, email, and token from the cookies
		Cookies.remove("name");
		Cookies.remove("email");
		Cookies.remove("token");
		Cookies.remove("picture");
		Cookies.remove("role_access");

		// change the color back to the default color
		localStorage.setItem("color", "#1C2E4A");
		updateColors("#1C2E4A");
	};

	const handleClick = () => setClick(!click);
	const closeMobileMenu = () => setClick(false);

	// check if token exists inside the cookies, if exists, get the user's name from the cookies called name
	useEffect(() => {
		const token = Cookies.get("name");
		if (token) {
			setName(token);
		}
	});

	useEffect(() => {
		const token = Cookies.get("picture");
		if (token) {
			setPicture(token);
		}
	});

	// ---------- Function to show login button on small screens ----------
	const showButton = () => {
		if (window.innerWidth <= 1100) {
			setButton(false);
		} else {
			setButton(true);
		}
	};

	useEffect(() => {
		showButton();
	}, []);

	// ---------- Listen on the weebsite screen size ----------
	window.addEventListener("resize", showButton);

	return (
		<>
			<nav className="navbar" style={{ background: color }}>
				<div className="navbar-container">
					{/* ---------- Webiste's logo ---------- */}
					<Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
						<img src="./images/PUBLIC_LOGO.png" alt="Logo" className="navbar-logo-image" />
					</Link>

					{/* ---------- Hamburger menu icon (Small screen size) ---------- */}
					<div className="menu-icon" onClick={handleClick}>
						<i className={click ? "fas fa-times" : "fas fa-bars"} />
					</div>

					{/* ---------- Navbar menu ---------- */}
					<ul className={click ? "nav-menu active" : "nav-menu"}>
						<li className="nav-item dropdown">
							<Link to="#" className="nav-links" onClick={closeMobileMenu}>
								Modules
							</Link>

							<ul className="dropdown-menu">
								<li>
									<Link to="/library" className="dropdown-link" onClick={closeMobileMenu}>
										Library
									</Link>
								</li>

								<li>
									<Link to="/communication" className="dropdown-link" onClick={closeMobileMenu}>
										Communication
									</Link>
								</li>

								<li>
									<Link to="/education" className="dropdown-link" onClick={closeMobileMenu}>
										Education
									</Link>
								</li>
							</ul>
						</li>
						{userRole === "signexpert" ? (
							// Render dropdown menu for dataset collection for sign experts
							<li className="nav-item dropdown">
								<Link to="#" className="nav-links" onClick={closeMobileMenu}>
									Dataset Collection
								</Link>
								<ul className="dropdown-menu2">
									<li>
										<Link to="/dataset-collection" className="dropdown-link" onClick={closeMobileMenu}>
											Dataset Form
										</Link>
									</li>
									<li>
										<Link to="/dataset-collection" className="dropdown-link" onClick={closeMobileMenu}>
											Dataset Review
										</Link>
									</li>
								</ul>
							</li>
						) : (
							<li className="nav-item">
								<Link to="/dataset-collection" className="nav-links" onClick={closeMobileMenu}>
									Dataset Collection
								</Link>
							</li>
						)}

						<li className="nav-item">
							<Link to="/feedback" className="nav-links" onClick={closeMobileMenu}>
								Feedback
							</Link>
						</li>

						<li className="nav-item">
							<Link to="/faq" className="nav-links" onClick={closeMobileMenu}>
								FAQ
							</Link>
						</li>

						{!isLoggedIn ? (
							// Render login button for users who are not logged in
							<>
								<li className="nav-item">
									<Link to="/login" className="nav-links-mobile" onClick={closeMobileMenu}>
										Login
									</Link>
								</li>
								{/* ---------- Login button (Small screen size) ---------- */}
								<Link to="/login" className="btn-mobile">
									{button && (
										<Button type="button" onClick={closeMobileMenu} buttonStyle="btn--outline" buttonSize="btn--mobile">
											Login
										</Button>
									)}
								</Link>
							</>
						) : (
							// Render profile and notifications icons for logged-in users
							<>
								<li className="nav-item">
									<Link to="/notifications" className="nav-links notification" onClick={closeMobileMenu}>
										<i className="fas fa-bell" /> {/* Notification Icon */}
									</Link>
								</li>
								<li className="nav-item dropdown">
									<img src={picture} alt="Profile" className="profileimg" />

									<ul className="dropdown-menu">
										<li>
											<Link to="#" className="dropdown-link" onClick={closeMobileMenu}>
												{name}
											</Link>
										</li>
										<li>
											<Link to="/login" className="dropdown-link" onClick={handleLogout}>
												Logout
											</Link>
										</li>
									</ul>
								</li>
							</>
						)}
					</ul>
				</div>
			</nav>
		</>
	);
}

export default Navbar;
