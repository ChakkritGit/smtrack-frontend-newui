import { RootState } from '../../redux/reducers/rootReducer'
import { useSelector } from 'react-redux'

const SplashScreen = () => {
  const { themeMode } = useSelector((state: RootState) => state.utils)

  return (
    <div
      className='w-full h-screen flex flex-col gap-3 items-center justify-center'
      data-theme={themeMode}
    >
      <span className='text-4xl md:text-5xl font-medium'>SMTrack+</span>
      <span className='font-medium'>Temperature Tracking</span>
    </div>
  )
}

export default SplashScreen
