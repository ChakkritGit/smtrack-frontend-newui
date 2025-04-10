import { KeyboardEvent } from 'react'
import { ModalPropsType } from '../../types/global/alertModal'

const AlertModal = (modalProps: ModalPropsType) => {
  const { icon, title, message, ref, onClose } = modalProps

  const handleBackdropClick = () => {
    onClose?.()
    if (ref && 'current' in ref && ref.current) {
      ref.current.close()
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
    }
  }

  return (
    <dialog ref={ref} className='modal' onKeyDown={handleKeyDown}>
      <div className='modal-box'>
        <div className='flex flex-col items-center justify-center gap-3'>
          {icon}
          <span className='font-bold text-[24px]'>{title}</span>
        </div>
        <div role='alert' className='alert alert-warning'>
          <span className='text-center'>{message}</span>
        </div>
      </div>
      <div className='modal-backdrop' onClick={handleBackdropClick}></div>
    </dialog>
  )
}

export default AlertModal
