import { Link } from 'react-router-dom';
import { useThemeStore } from '../../store/theme';
import './Footer.css';
import { useTranslation } from "react-i18next";

function Footer() {
  const { color } = useThemeStore();
  const { t, i18n } = useTranslation()

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
            <Link to='/login'>{t('how_it_works')}</Link>
            <Link to='/'>{t('testimonials')}</Link>
            <Link to='/'>{t('careers')}</Link>
            <Link to='/'>{t('investors')}</Link>
            <Link to='/'>{t('terms_of_service')}</Link>
            <Link to='/references'>{t('references')}</Link>
          </div>
          <div className='footer-link-items'>
            <h2>{t('contact_us')}</h2>
            <Link to='/'>{t('contact')}</Link>
            <Link to='/'>{t('support')}</Link>
            <Link to='/'>{t('destinations')}</Link>
            <Link to='/'>{t('sponsorship')}</Link>
          </div>
        </div>
        <div className='footer-link-wrapper'>
          <div className='footer-link-items'>
            <h2>{t('modules')}</h2>
            <Link to='/library'>{t('library')}</Link>
            <Link to='/communication'>{t('communication')}</Link>
            <Link to='/education'>{t('education')}</Link>
          </div>
          <div className='footer-link-items'>
            <h2>{t('social_media')}</h2>
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
          <small className='website-rights'>{t('copyright')}</small>
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
