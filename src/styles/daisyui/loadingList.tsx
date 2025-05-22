import { RiCheckLine } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { setLoadingStyle } from '../../redux/actions/utilsActions'
import { useTranslation } from 'react-i18next'

const LoadingList = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { loadingStyle } = useSelector((state: RootState) => state.utils)

  const saveLoadingStyle = (style: string) => {
    dispatch(setLoadingStyle(style))
    localStorage.setItem('loadingStyle', style)
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-0.5 py-3 max-h-[200px] overflow-y-scroll'>
      <div
        className={`flex items-center gap-3 w-full justify-between cursor-pointer hover:bg-base-200 transition-all duration-300 ease-out px-4 py-3 rounded-selector ${
          loadingStyle === 'loading-spinner' ? 'bg-base-300/50' : ''
        }`}
        onClick={() => saveLoadingStyle('loading-spinner')}
      >
        <div className='flex items-center gap-3'>
          <span className='loading loading-spinner loading-md'></span>
          <span>
            Spinner{` `}
            <span className='opacity-50 text-[14px]'>({t('default')})</span>
          </span>
        </div>
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
        className={`flex items-center gap-3 w-full justify-between cursor-pointer hover:bg-base-200 transition-all duration-300 ease-out px-4 py-3 rounded-selector ${
          loadingStyle === 'loading-dots' ? 'bg-base-300/50' : ''
        }`}
        onClick={() => saveLoadingStyle('loading-dots')}
      >
        <div className='flex items-center gap-3'>
          <span className='loading loading-dots loading-md'></span>
          <span className='text-[14px]'>Dots</span>
        </div>
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
        className={`flex items-center gap-3 w-full justify-between cursor-pointer hover:bg-base-200 transition-all duration-300 ease-out px-4 py-3 rounded-selector ${
          loadingStyle === 'loading-ring' ? 'bg-base-300/50' : ''
        }`}
        onClick={() => saveLoadingStyle('loading-ring')}
      >
        <div className='flex items-center gap-3'>
          <span className='loading loading-ring loading-md'></span>
          <span className='text-[14px]'>Ring</span>
        </div>
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
        className={`flex items-center gap-3 w-full justify-between cursor-pointer hover:bg-base-200 transition-all duration-300 ease-out px-4 py-3 rounded-selector ${
          loadingStyle === 'loading-ball' ? 'bg-base-300/50' : ''
        }`}
        onClick={() => saveLoadingStyle('loading-ball')}
      >
        <div className='flex items-center gap-3'>
          <span className='loading loading-ball loading-md'></span>
          <span className='text-[14px]'>Ball</span>
        </div>
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
        className={`flex items-center gap-3 w-full justify-between cursor-pointer hover:bg-base-200 transition-all duration-300 ease-out px-4 py-3 rounded-selector ${
          loadingStyle === 'loading-bars' ? 'bg-base-300/50' : ''
        }`}
        onClick={() => saveLoadingStyle('loading-bars')}
      >
        <div className='flex items-center gap-3'>
          <span className='loading loading-bars loading-md'></span>
          <span className='text-[14px]'>Bars</span>
        </div>
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
        className={`flex items-center gap-3 w-full justify-between cursor-pointer hover:bg-base-200 transition-all duration-300 ease-out px-4 py-3 rounded-selector ${
          loadingStyle === 'loading-infinity' ? 'bg-base-300/50' : ''
        }`}
        onClick={() => saveLoadingStyle('loading-infinity')}
      >
        <div className='flex items-center gap-3'>
          <span className='loading loading-infinity loading-md'></span>
          <span className='text-[14px]'>Infinity</span>
        </div>
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
