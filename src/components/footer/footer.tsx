import Logo from '../../assets/images/app-logo.png'

const Footer = () => {
  return (
    <footer className='footer items-center justify-center md:justify-end p-3 md:pr-5 border-t border-base-content/10'>
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
