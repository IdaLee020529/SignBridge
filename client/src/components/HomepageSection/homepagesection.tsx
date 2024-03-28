import { useState, useEffect } from 'react';
import './homepagesection.css';

export default function HomepageSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [primaryColor, setprimaryColor] = useState('#77828F');
  const [secondaryColor, setsecondaryColor] = useState('#B7C1CA');
  

  // Array of images
  const slides = [
    { src: './images/image-slider/SignBridgeBanner1.png', alt: 'First Slide' },
    { src: './images/image-slider/SignBridgeBanner2.png', alt: 'Second Slide' },
    { src: './images/image-slider/SignBridgeBanner3.png', alt: 'Third Slide' },
  ];

  // Function to handle next slide
  const nextSlide = () => {
    setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  };

  // Function to handle previous slide
  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  };

  // Automatically move to the next slide
  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  // Function to check if user is logged in based on session storage
  const isUserLoggedIn = () => {
    return document.cookie.split("; ").some((row) => row.startsWith("token="));
  };

  const isLoggedIn = isUserLoggedIn();

  useEffect(() => {
    const roleAccess = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role_access="))
      ?.split("=")[1];
    if (roleAccess === "admin") {
      setprimaryColor('#FCC003');
      setsecondaryColor('#FFF1C5');
    } else if (roleAccess === "signexpert") {
      setprimaryColor('#71839F');
      setsecondaryColor('#E7F0FD');
    } else {
      setprimaryColor('#77828F');
      setsecondaryColor('#D3DEE8');
    }
  });

  return (
    <div>
      {/* For the image slider */}
      <div className="slider-container">
        <div className="slider">
        <img 
          src={slides[currentSlide].src} 
          alt={slides[currentSlide].alt} 
          className="slider-image" 
        />
        <div className="dot-container">
          {slides.map((slide, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}>
            </span>
          ))}
          </div>
        </div>
      </div>

      {/* For the available modules section */}
      <section className="available-module-section" id="available-module-section">
        <h1 className="heading" style={{background: secondaryColor}}><span style={{color: primaryColor}}>Available</span> Module</h1>
        <div className="available-module-container">
          <div className="avail-module-box">
            <div className="avail-module-image">
              <img src="/images/available-module/library.png" alt="Library"/>
              <div className="avail-module-text">
                <a href="/library" className="cart-btn">Library</a>
              </div>
            </div>
          </div>

          <div className="avail-module-box">
            <div className="avail-module-image">
              <img src="/images/available-module/communication.png" alt="Communication"/>
              <div className="avail-module-text">
                <a href="/communication" className="cart-btn">Communication</a>
              </div>
            </div>
          </div>

          <div className="avail-module-box">
            <div className="avail-module-image">
              <img src="/images/available-module/education.png" alt="Education"/>
              <div className="avail-module-text">
                <a href="/education" className="cart-btn">Education</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For the about section */}
      <section className="about" id="about">
        <h1 className="heading" style={{background: secondaryColor}}>About <span style={{color: primaryColor}}>Neuon AI</span></h1>
        <div className="row">
          <div className="video-container">
            <img src="/images/company.png" alt="Company"/>
          </div>
          <div className="content">
            <p>Neuon AI is a technology company dedicated to bridging communication gaps for the Sarawak Society for Deaf. We believe in leveraging the power of artificial intelligence to facilitate seamless two-way communication between sign language users and the broader community.</p>
            <p>Our mission is to empower individuals with hearing impairments by providing them with innovative tools and solutions that enhance their ability to communicate effectively in both digital and real-world environments.</p>
          </div>
        </div>
      </section>

      {/* Yotube */}
      <section className="youtube-video">
        <h1 className="heading" style={{background: secondaryColor}} id="ytvideo"> <span style={{color: primaryColor}}> Youtube </span> Video </h1>
        <iframe src="https://www.youtube.com/embed/JOgJXtbcdC0?si=Znzc4PlcHQBE_bbS" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
      </section>

      {/* Location */}
      <section className="location">
        <h1 className="heading" style={{background: secondaryColor}} id="gmap_canvas">Location</h1>
        <div className="mapouter"><div className="gmap_canvas">
        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15953.835287675945!2d110.4059977!3d1.4957629!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31fba1332943cb13%3A0x9050a3791464b11a!2sNEUON%20AI!5e0!3m2!1sen!2smy!4v1710735767635!5m2!1sen!2smy"></iframe>
        <a href="https://123movies-to.org"></a>
        <br/>
        <a href="https://www.embedgooglemap.net"></a>
      </div></div>
      </section>
    </div>
  );
}
