import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import "./Navbar.css";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener("resize", showButton);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            <img
              src="/images/SIGN_BRIDGE_LOGO.png"
              alt="Logo"
              className="navbar-logo-image"
            />
          </Link>

          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item dropdown">
              <Link to="#" className="nav-links" onClick={closeMobileMenu}>
                Modules
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link
                    to="/library"
                    className="dropdown-link"
                    onClick={closeMobileMenu}
                  >
                    Library
                  </Link>
                </li>
                <li>
                  <Link
                    to="/communication"
                    className="dropdown-link"
                    onClick={closeMobileMenu}
                  >
                    Communication
                  </Link>
                </li>
                <li>
                  <Link
                    to="/education"
                    className="dropdown-link"
                    onClick={closeMobileMenu}
                  >
                    Education
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link
                to="/dataset-collection"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Dataset Collection
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/feedback"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Feedback
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/faq" className="nav-links" onClick={closeMobileMenu}>
                FAQ
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/login"
                className="nav-links-mobile"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
            </li>
          </ul>
          {button && (
            <Button
              type="button"
              onClick={closeMobileMenu}
              buttonStyle="btn--outline"
              buttonSize="btn--mobile"
            >
              Login
            </Button>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;