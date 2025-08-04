import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers/rootReducer'

const Loading = () => {
  const { loadingStyle } = useSelector((state: RootState) => state.utils)
  const { t } = useTranslation()
  const [timeoutError, setTimeoutError] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutError(true)
    }, 60000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='flex items-center justify-center w-full p-3 h-full gap-3'>
      {timeoutError ? (
        <span className='text-red-500'>{t('descriptionWrong')}</span>
      ) : (
        <>
          <span className={`loading ${loadingStyle} loading-md bg-base-content`}></span>
          {/* <span className='text-base-content'>{t('loading')}</span> */}
        </>
      )}
    </div>
  )
}

export default Loading
