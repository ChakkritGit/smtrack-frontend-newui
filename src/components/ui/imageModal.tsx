import { RefObject } from 'react'
import { RiCloseLargeLine } from 'react-icons/ri'
import DefaultPic from '../../assets/images/default-pic.png'
import { DeviceLogsType } from '../../types/smtrack/devices/deviceType'
import { useTranslation } from 'react-i18next'

interface ImageModalProps {
  modalRef: RefObject<HTMLDialogElement | null>
  deviceData: DeviceLogsType | undefined
}

const ImageModal = (props: ImageModalProps) => {
  const { t } = useTranslation()

  const { modalRef, deviceData } = props
  return (
    <dialog ref={modalRef} className='modal overflow-y-scroll py-10'>
      <form className='modal-box md:w-5/6 max-w-200 h-max max-h-[95%]'>
        <div className='flex justify-between gap-2'>
          <div>
            <h3 className='font-bold text-base'>{deviceData?.id}</h3>
            <span>{deviceData?.position}</span>
          </div>
          <button
            type='button'
            name='close-modal'
            aria-label={t('closeButton')}
            className='btn btn-ghost outline-none flex p-0 min-w-7.5 min-h-7.5 max-w-7.5 max-h-7.5 duration-300 ease-linear'
            onClick={() => modalRef.current?.close()}
          >
            <RiCloseLargeLine size={20} />
          </button>
        </div>
        <div className='flex justify-center items-center mt-3'>
          <img
            src={deviceData?.positionPic ?? DefaultPic}
            alt='Device-image'
            className='rounded-field object-contain'
          />
        </div>
      </form>
    </dialog>
  )
}

export default ImageModal
