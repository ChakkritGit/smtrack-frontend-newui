import { RiStickyNoteFill } from 'react-icons/ri'
import { V2, V2_0_1 } from './version'

const Changelog = () => {
  return (
    <div className='p-3'>
      <RiStickyNoteFill className='text-[32px] md:text-[64px]' />
      <h1 className='text-lg md:text-2xl font-bold my-3'>Changelog</h1>
      <div>
        <V2_0_1 />
        <V2 />
      </div>
    </div>
  )
}

export default Changelog
