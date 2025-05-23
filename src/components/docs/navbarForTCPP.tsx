import { Link, useLocation } from 'react-router-dom'
import Logo from '../../assets/images/app-logo.png'
// import LanguageList from '../language/languageList'

const NavbarForTCPP = () => {
  const location = useLocation()

  return (
    <div className='flex flex-col justify-center pt-3 px-5 bg-base-100 border-b border-base-content/15 sticky top-0 left-0 z-40'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3 w-max'>
          <Link to={'/'}>
            <img
              src={Logo}
              alt='Logo'
              className='bg-base-300/50 rounded-sm w-5 h-5 md:w-8 md:h-8'
            />
          </Link>
          <Link
            to={'/policies'}
            className='text-[16px] md:text-[22px] font-medium active:underline underline-offset-[5px]'
          >
            Privacy & Terms
          </Link>
        </div>
        <div>
          {/* <LanguageList /> */}
        </div>
      </div>
      <div className='flex items-center gap-7 mt-3.5'>
        <div className='flex flex-col items-center gap-0.5'>
          <Link
            to={'/policies'}
            className={`text-[12px] md:text-[15px] font-medium ${
              location.pathname === '/policies' ? 'text-primary' : ''
            }`}
          >
            Overview
          </Link>
          <div
            className={`h-[3px] w-full rounded-t-sm ${
              location.pathname === '/policies' ? 'bg-primary' : ''
            } `}
          ></div>
        </div>
        <div className='flex flex-col items-center gap-0.5'>
          <Link
            to={'/privacy-policy'}
            className={`text-[12px] md:text-[15px] font-medium ${
              location.pathname === '/privacy-policy'
                ? 'text-primary'
                : ''
            }`}
          >
            Privacy & Policy
          </Link>
          <div
            className={`h-[3px] w-full rounded-t-sm ${
              location.pathname === '/privacy-policy' ? 'bg-primary' : ''
            } `}
          ></div>
        </div>
        <div className='flex flex-col items-center gap-0.5'>
          <Link
            to={'/terms-conditions'}
            className={`text-[12px] md:text-[15px] font-medium ${
              location.pathname === '/terms-conditions'
                ? 'text-primary'
                : ''
            }`}
          >
            Terms & Conditions
          </Link>
          <div
            className={`h-[3px] w-full rounded-t-sm ${
              location.pathname === '/terms-conditions' ? 'bg-primary' : ''
            } `}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default NavbarForTCPP
