import { RiCheckLine } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { setLoadingStyle } from '../../redux/actions/utilsActions'

const LoadingList = () => {
    const dispatch = useDispatch()
  const { loadingStyle } = useSelector((state: RootState) => state.utils)

  const saveLoadingStyle = (style: string) => {
    dispatch(setLoadingStyle(style))
    localStorage.setItem('loadingStyle', style)
  }

  return (
    <div className='grid grid-cols-2 gap-0.5 py-3 max-h-[200px] overflow-y-scroll'>
      <div
        className='flex items-center gap-3 w-full justify-between mt-3 cursor-pointer hover:bg-base-200 transition-all duration-300 ease-out px-4 py-3 rounded-selector'
        onClick={() => saveLoadingStyle('loading-spinner')}
      >
        <span className='loading loading-spinner loading-md'></span>
        <div>
          {loadingStyle === 'loading-spinner' ? (
            <div className='flex items-center justify-center w-5 h-5 p-0.5 bg-neutral text-neutral-content rounded-selector'>
              <RiCheckLine size={18} />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      <div
        className='flex items-center gap-3 w-full justify-between cursor-pointer hover:bg-base-200 transition-all duration-300 ease-out px-4 py-3 rounded-selector'
        onClick={() => saveLoadingStyle('loading-dots')}
      >
        <span className='loading loading-dots loading-md'></span>
        <div>
          {loadingStyle === 'loading-dots' ? (
            <div className='flex items-center justify-center w-5 h-5 p-0.5 bg-neutral text-neutral-content rounded-selector'>
              <RiCheckLine size={18} />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      <div
        className='flex items-center gap-3 w-full justify-between cursor-pointer hover:bg-base-200 transition-all duration-300 ease-out px-4 py-3 rounded-selector'
        onClick={() => saveLoadingStyle('loading-ring')}
      >
        <span className='loading loading-ring loading-md'></span>
        <div>
          {loadingStyle === 'loading-ring' ? (
            <div className='flex items-center justify-center w-5 h-5 p-0.5 bg-neutral text-neutral-content rounded-selector'>
              <RiCheckLine size={18} />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      <div
        className='flex items-center gap-3 w-full justify-between cursor-pointer hover:bg-base-200 transition-all duration-300 ease-out px-4 py-3 rounded-selector'
        onClick={() => saveLoadingStyle('loading-ball')}
      >
        <span className='loading loading-ball loading-md'></span>
        <div>
          {loadingStyle === 'loading-ball' ? (
            <div className='flex items-center justify-center w-5 h-5 p-0.5 bg-neutral text-neutral-content rounded-selector'>
              <RiCheckLine size={18} />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      <div
        className='flex items-center gap-3 w-full justify-between cursor-pointer hover:bg-base-200 transition-all duration-300 ease-out px-4 py-3 rounded-selector'
        onClick={() => saveLoadingStyle('loading-bars')}
      >
        <span className='loading loading-bars loading-md'></span>
        <div>
          {loadingStyle === 'loading-bars' ? (
            <div className='flex items-center justify-center w-5 h-5 p-0.5 bg-neutral text-neutral-content rounded-selector'>
              <RiCheckLine size={18} />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      <div
        className='flex items-center gap-3 w-full justify-between cursor-pointer hover:bg-base-200 transition-all duration-300 ease-out px-4 py-3 rounded-selector'
        onClick={() => saveLoadingStyle('loading-infinity')}
      >
        <span className='loading loading-infinity loading-md'></span>
        <div>
          {loadingStyle === 'loading-infinity' ? (
            <div className='flex items-center justify-center w-5 h-5 p-0.5 bg-neutral text-neutral-content rounded-selector'>
              <RiCheckLine size={18} />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}

export default LoadingList
