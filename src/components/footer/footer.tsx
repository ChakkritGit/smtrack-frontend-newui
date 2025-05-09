import Logo from '../../assets/images/app-logo.png'

const Footer = () => {
  return (
    <footer className={`footer items-center justify-center md:justify-end bg-base-100 z-40 sticky bottom-0 left-0 
    p-2.5 md:pr-5 border-t border-base-content/10 shadow-sm`}>
      <aside className='grid-flow-col items-center'>
        <img
          src={Logo}
          alt='Logo'
          className='bg-base-300/50 rounded-sm w-5 h-5'
        />
        <p className='text-xs'>
          Copyright © {new Date().getFullYear()} - Siamatic Co. Ltd
        </p>
      </aside>
    </footer>
  )
}

export default Footer
