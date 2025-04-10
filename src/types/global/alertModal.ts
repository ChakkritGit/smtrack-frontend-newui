import { ReactElement, Ref } from 'react'

interface ModalPropsType {
  icon: ReactElement
  title: String
  message: String
  ref: Ref<HTMLDialogElement>
  onClose?: () => void
}

export type { ModalPropsType }
