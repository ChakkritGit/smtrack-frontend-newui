import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const Loading = () => {
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
        <span className='text-red-500'>{t('descriptionWrong')} {t('tooLoad')}</span>
      ) : (
        <>
          <span className='loading loading-spinner loading-md bg-base-content'></span>
          {/* <span className='text-base-content'>{t('loading')}</span> */}
        </>
      )}
    </div>
  )
}

export default Loading
