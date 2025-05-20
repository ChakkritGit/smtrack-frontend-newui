import { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'

interface LoadingModalProps {
  submitLoading: boolean
}

export const SubmitLoading = (props: LoadingModalProps) => {
  const { loadingStyle } = useSelector((state: RootState) => state.utils)
  const modalRef = useRef<HTMLDialogElement>(null)
  const { submitLoading } = props

  useEffect(() => {
    const html = document.documentElement
    html.style.overflow = 'hidden'

    return () => {
      html.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (modalRef.current && submitLoading) {
      modalRef.current.showModal()

      timeout = setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.close()
        }
      }, 60000)
    }

    return () => {
      if (modalRef.current) {
        modalRef.current.close()
      }
      clearTimeout(timeout)
    }
  }, [submitLoading])

  return ReactDOM.createPortal(
    <dialog ref={modalRef} className='modal'>
      <div className='modal-box flex items-center justify-center w-[100px] h-[100px]'>
        <div className='flex items-center justify-center bg-base-100 rounded-field'>
          <span className={`loading ${loadingStyle} loading-lg`}></span>
        </div>
      </div>
    </dialog>,
    document.body
  )
}
