import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { useThemeStore } from "../../store/theme";
import "./Navbar.css";
import Cookies from "js-cookie";
import { LogoutUser } from "../../services/account.service";
import { GetUserIdByEmail, FetchNotificationCounts } from "../../services/notification.service";
import { GetUserByEmail } from "../../services/account.service";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

function Navbar() {
  const navigate = useNavigate();
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [name, setName] = useState("");
  const [picture, setPicture] = useState("");
  const userRole = Cookies.get("role_access");
  const { color, updateColors } = useThemeStore();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
    closeMobileMenu();
  };

  useEffect(() => {
    const currentLang = localStorage.getItem("i18nextLng") || "en"; // Default to English
    i18n.changeLanguage(currentLang);
  }, [i18n]);

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

  const email = Cookies.get("email");

  useEffect(() => {
    const getUserInfo = async () => {
      const res = await GetUserByEmail(email ?? "");
      setPicture(res.data.picture);
      setName(res.data.username);
    };
    
    if (isLoggedIn) {
      getUserInfo();
    } else {
      setPicture(""); 
      setName("");
    }
  }, [email, isLoggedIn]);

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

  // ---------- Fetch notification counts ----------
  const [userIds, setUserIds] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const getUserId = async () => {
      const res = await GetUserIdByEmail(email);
      setUserIds(res.data);
    };

    if (isLoggedIn) {
      getUserId();
    } else {
      setUserIds(""); // Reset userIds if user is not logged in
    }
  }, [email, isLoggedIn]);

  useEffect(() => {
    const fetchCounts = async () => {
      if (isLoggedIn && userIds !== "") {
        const response = await FetchNotificationCounts(parseInt(userIds), 0);
        const data = response.data;
        setNotificationCount(data);
      }
    };

    fetchCounts();

    // Fetch counts only if the user is logged in and userIds is not empty
    if (isLoggedIn && userIds !== "") {
      const interval = setInterval(fetchCounts, 10000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, userIds]);

  // ---------- Listen on the weebsite screen size ----------
  window.addEventListener("resize", showButton);

  return (
    <>
      <nav className="navbar" style={{ background: color }}>
        <div className="navbar-container">
          {/* ---------- Webiste's logo ---------- */}
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            <img
              src="./images/PUBLIC_LOGO.png"
              alt="Logo"
              className="navbar-logo-image"
            />
          </Link>

          {/* ---------- Hamburger menu icon (Small screen size) ---------- */}
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>

          {/* ---------- Navbar menu ---------- */}
          <ul className={click ? "nav-menu activate" : "nav-menu"}>
            <li className="nav-item dropdown">
              <Link to="#" className="nav-links" onClick={closeMobileMenu}>
                {t("module")}
              </Link>

              <ul className="dropdown-menu">
                <li>
                  <Link
                    to="/library"
                    className="dropdown-link"
                    onClick={closeMobileMenu}
                  >
                    {t("library")}
                  </Link>
                </li>

                <li>
                  <Link
                    to="/communication"
                    className="dropdown-link"
                    onClick={closeMobileMenu}
                  >
                    {t("communication")}
                  </Link>
                </li>

                <li>
                  <Link
                    to="/education"
                    className="dropdown-link"
                    onClick={closeMobileMenu}
                  >
                    {t("education")}
                  </Link>
                </li>
              </ul>
            </li>
            {userRole === "signexpert" ? (
              // Render dropdown menu for dataset collection for sign experts
              <li className="nav-item dropdown">
                <Link to="#" className="nav-links" onClick={closeMobileMenu}>
                  {t("dataset_collection")}
                </Link>
                <ul className="dropdown-menu2">
                  <li>
                    <Link
                      to="/dataset-collection"
                      className="dropdown-link"
                      onClick={closeMobileMenu}
                    >
                      {t("dataset_form")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dataset-collection-review"
                      className="dropdown-link"
                      onClick={closeMobileMenu}
                    >
                      {t("dataset_review")}
                    </Link>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link
                  to="/dataset-collection"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  {t("dataset_collection")}
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link
                to="/feedback"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                {t("feedback")}
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/faq" className="nav-links" onClick={closeMobileMenu}>
                {t("faq")}
              </Link>
            </li>

          <li className="nav-item">
              <Link
                  to="#"
                  className="nav-links"
                  onClick={closeMobileMenu}
              >
                  <Globe />
              </Link>
            <ul className="dropdown-menu">
                <li>
                    <Link
                        to="#"
                        className="dropdown-link"
                        onClick={() => changeLanguage('en')}
                    >
                        EN
                    </Link>
                </li>

                <li>
                  <Link
                    to="#"
                    className="dropdown-link"
                    onClick={() => changeLanguage("bm")}
                  >
                    BM
                  </Link>
                </li>
              </ul>
            </li>

            {!isLoggedIn ? (
              // Render login button for users who are not logged in
              <>
                <li className="nav-item">
                  <Link
                    to="/login"
                    className="nav-links-mobile"
                    onClick={closeMobileMenu}
                  >
                    {t("login")}
                  </Link>
                </li>
                {/* ---------- Login button (Small screen size) ---------- */}
                <Link to="/login" className="btn-mobile">
                  {button && (
                    <Button
                      type="button"
                      onClick={closeMobileMenu}
                      buttonStyle="btn--outline"
                      buttonSize="btn--mobile"
                    >
                      {t("login")}
                    </Button>
                  )}
                </Link>
              </>
            ) : (
              // Render profile and notifications icons for logged-in users
              <>
                <li className="nav-item">
                  <Link
                    to="/notifications"
                    className="nav-links notification"
                    onClick={closeMobileMenu}
                  >
                    <div className="notification-icon-container">
                      <i className="fas fa-bell" />
                      {notificationCount > 0 && (
                        <span className="notification-count">
                          {notificationCount}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>

                <li className="nav-item dropdown">
                  <img src={picture} alt="Profile" className="profileimg" />

                  <ul className="dropdown-menu">
                    <li>
                      <Link
                        to="/profile"
                        className="dropdown-link"
                        onClick={closeMobileMenu}
                      >
                        {name}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/login"
                        className="dropdown-link"
                        onClick={handleLogout}
                      >
                        {t("logout")}
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
