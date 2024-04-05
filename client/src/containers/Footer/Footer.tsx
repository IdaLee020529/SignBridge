import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../store/theme';
import './Footer.css';

function Footer() {
  const { color } = useTheme();

  // Function to check if user is logged in based on session storage
  const isUserLoggedIn = () => {
    return document.cookie.split("; ").some((row) => row.startsWith("token="));
  };

  isUserLoggedIn();

  return (
    <>
    <div className='footer-container' style={{background: color}}>
      <div className='footer-links'>
        <div className='footer-link-wrapper'>
          <div className='footer-link-items'>
            <h2>Sign Bridge</h2>
            <Link to='/login'>How it works</Link>
            <Link to='/'>Testimonials</Link>
            <Link to='/'>Careers</Link>
            <Link to='/'>Investors</Link>
            <Link to='/'>Terms of Service</Link>
          </div>
          <div className='footer-link-items'>
            <h2>Contact Us</h2>
            <Link to='/'>Contact</Link>
            <Link to='/'>Support</Link>
            <Link to='/'>Destinations</Link>
            <Link to='/'>Sponsorships</Link>
          </div>
        </div>
        <div className='footer-link-wrapper'>
          <div className='footer-link-items'>
            <h2>Modules</h2>
            <Link to='/library'>Library</Link>
            <Link to='/communication'>Communication</Link>
            <Link to='/education'>Education</Link>
          </div>
          <div className='footer-link-items'>
            <h2>Social Media</h2>
            <Link to='/'>Instagram</Link>
            <Link to='/'>Facebook</Link>
            <Link to='/'>Youtube</Link>
            <Link to='/'>Twitter</Link>
          </div>
        </div>
      </div>
      <section className='social-media'>
        <div className='social-media-wrap'>
          {/* <div className='footer-logo'>
            <Link to='/' className='social-logo'>
              TRVL
              <i className='fab fa-typo3' />
            </Link>
          </div> */}
          <small className='website-rights'>© CopyRight reserved by SIGN BRIDGE 2024</small>
          <div className='social-icons'>
            <Link
              className='social-icon-link facebook'
              to='/'
              target='_blank'
              aria-label='Facebook'
            >
              <i className='fab fa-facebook-f' />
            </Link>
            <Link
              className='social-icon-link instagram'
              to='/'
              target='_blank'
              aria-label='Instagram'
            >
              <i className='fab fa-instagram' />
            </Link>
            <Link
              className='social-icon-link youtube'
              to='/'
              target='_blank'
              aria-label='Youtube'
            >
              <i className='fab fa-youtube' />
            </Link>
            <Link
              className='social-icon-link twitter'
              to='/'
              target='_blank'
              aria-label='Twitter'
            >
              <i className='fab fa-twitter' />
            </Link>
            <Link
              className='social-icon-link twitter'
              to='/'
              target='_blank'
              aria-label='LinkedIn'
            >
              <i className='fab fa-linkedin' />
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}

export default Footer;