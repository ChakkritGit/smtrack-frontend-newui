import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers/rootReducer'

const Loading = () => {
  // ดึงค่า loadingStyle มา
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
    // เพิ่ม w-full h-full เพื่อให้มั่นใจว่ามันขยายเต็มพื้นที่ที่ parent ส่งมา
    <div className='flex items-center justify-center w-full h-full p-3 gap-3 min-h-25'>
      {timeoutError ? (
        <span className='text-red-500'>{t('descriptionWrong')}</span>
      ) : (
        <>
          {/* แก้ตรงนี้: ใส่ || 'loading-spinner' เพื่อกันเหนียวในกรณีที่ loadingStyle ไม่มีค่า */}
          <span
            className={`loading ${
              loadingStyle || 'loading-spinner'
            } loading-md bg-base-content`}
          ></span>

          {/* Debug: ลองเปิดบรรทัดนี้ดูถ้ายังไม่เห็น loading เพื่อเช็คว่า Component ถูกเรียกจริงไหม */}
          {/* <span className='text-xs'>Loading...</span> */}
        </>
      )}
    </div>
  )
}

export default Loading
