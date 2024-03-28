import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [name, setName] = useState('');
  const [picture, setPicture] = useState('');
  const [logo, setLogo] = useState('/images/PUBLIC_LOGO.jpg');
  const [navbarColor, setNavbarColor] = useState('#1C2E4A');

  // Function to set user authentication status in session storage when user logs in
  const setUserLoggedIn = () => {
    sessionStorage.setItem("isLoggedIn", "true");
  };

  // Function to check if user is logged in based on session storage
  const isUserLoggedIn = () => {
    return document.cookie.split("; ").some((row) => row.startsWith("token="));
  };

  const isLoggedIn = isUserLoggedIn();

  // Function to clear user authentication status from session storage when user logs out
  const handleLogout = () => {
    // remove the name, email, and token from the cookies
    document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "picture=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "role_access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  // check if token exists inside the cookies, if exists, get the user's name from the cookies called name
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("name="))
      ?.split("=")[1];
    if (token) {
      setName(token);
    }
  });

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("picture="))
      ?.split("=")[1];
    if (token) {
      setPicture(token);
    }
  }); 

  useEffect(() => {
    const roleAccess = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role_access="))
      ?.split("=")[1];
    if (roleAccess === "admin") {
      setNavbarColor('#FCC003');
      setLogo('/images/ADMIN_LOGO.jpg');
    } else if (roleAccess === "signexpert") {
      setNavbarColor('#71839F');
      setLogo('/images/SIGN_EXPERT_LOGO.jpg');
    } else {
      setNavbarColor('#1C2E4A');
      setLogo('/images/PUBLIC_LOGO.jpg');
    }
    console.log("navRole Access:", roleAccess); // Check roleAccess value
    console.log("navCookies:", document.cookie);
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
      <nav className="navbar" style={{background: navbarColor}}>
        <div className="navbar-container">
          {/* ---------- Webiste's logo ---------- */}
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            <img
              src= {logo}
              alt="Logo"
              className="navbar-logo-image"
            />
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
                  <Link to="/library" className="dropdown-link" onClick={closeMobileMenu} >
                    Library
                  </Link>
                </li>

                <li>
                  <Link to="/communication" className="dropdown-link" onClick={closeMobileMenu} >
                    Communication
                  </Link>
                </li>

                <li>
                  <Link to="/education" className="dropdown-link" onClick={closeMobileMenu} >
                    Education
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link to="/dataset-collection" className="nav-links" onClick={closeMobileMenu} >
                Dataset Collection
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/feedback" className="nav-links" onClick={closeMobileMenu} >
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
                    <Button type="button" onClick={closeMobileMenu} buttonStyle="btn--outline" buttonSize="btn--mobile" >
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