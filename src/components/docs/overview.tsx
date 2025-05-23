import { RiChatPrivateLine, RiFilePaper2Line } from 'react-icons/ri'
import Footer from '../footer/footer'
import NavbarForTCPP from './navbarForTCPP'
import { Link } from 'react-router-dom'

const Overview = () => {
  return (
    <div>
      <NavbarForTCPP />
      <div className='p-3 h-dvh'>
        <h1 className='text-[24px] font-medium'>Overview</h1>
        <p className='mt-3 text-[14px]'>
          This is the overview page for the Terms and Conditions, Privacy
          Policy. You can find all the relevant information regarding our
          policies here.
        </p>
        <div className='flex items-center flex-col md:flex-row gap-5 mt-5'>
          <Link to={'/privacy-policy'} className='p-4 w-90 md:w-80 h-55 bg-base-200/50 rounded-selector border border-base-content/10 shadow-md hover:bg-base-100 hover:scale-95 duration-300 ease-out cursor-pointer'>
            <RiChatPrivateLine size={48} />
            <h2 className='text-[16px] md:text-[24px] font-medium mt-3'>
              Privacy and Policy
            </h2>
            <p className='mt-2 text-[14px]'>
              Read our privacy policy to understand how we collect, use, and
              protect your personal information.
            </p>
          </Link>
          <Link to={'/terms-conditions'} className='p-4 w-90 md:w-80 h-55 bg-base-200/50 rounded-selector border border-base-content/10 shadow-md hover:bg-base-100 hover:scale-95 duration-300 ease-out cursor-pointer'>
            <RiFilePaper2Line size={48} />
            <h2 className='text-[16px] md:text-[24px] font-medium mt-3'>
              Terms and Conditions
            </h2>
            <p className='mt-2 text-[14px]'>
              Read our terms and conditions to understand the rules and
              regulations of using our services.
            </p>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Overview
