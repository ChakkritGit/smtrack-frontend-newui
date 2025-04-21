import Logo from '../../assets/images/app-logo.png'

const Footer = () => {
  return (
    <footer className='footer items-center justify-center md:justify-end py-3 mt-4 border-t border-base-content/15 pr-3'>
      <aside className='grid-flow-col items-center'>
        <img
          src={Logo}
          alt='Logo'
          className='bg-base-300/50 rounded-sm w-6 h-6'
        />
        <p className='text-sm'>
          Copyright © {new Date().getFullYear()} - Siamatic Co. Ltd
        </p>
      </aside>
    </footer>
  )
}

export default Footer
