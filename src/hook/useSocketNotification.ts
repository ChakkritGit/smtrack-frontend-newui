import { useEffect, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Import sounds
import n1 from '../assets/sounds/n1.mp3'
import n2 from '../assets/sounds/n2.wav'
import n3 from '../assets/sounds/n3.wav'
import n4 from '../assets/sounds/n4.wav'
import n5 from '../assets/sounds/n5.wav'
import n6 from '../assets/sounds/n6.wav'
import n7 from '../assets/sounds/n7.wav'
import n8 from '../assets/sounds/n8.mp3'
import { RootState } from '../redux/reducers/rootReducer'
import { SocketResponseType } from '../types/global/socketType'
import { setSocketData } from '../redux/actions/utilsActions'
import { socket } from '../services/websocket'

const sounds = [null, n1, n2, n3, n4, n5, n6, n7, n8] // Index 0 is null for easier mapping

export const useSocketNotification = () => {
  const dispatch = useDispatch()
  const { tokenDecode, sound, popUpMode, soundMode, socketData } = useSelector(
    (state: RootState) => state.utils
  )
  const { role, hosId } = tokenDecode || {}

  // Audio Instance Memoization
  const audioSrc = useMemo(() => sounds[sound] || n8, [sound])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio(audioSrc)
  }, [audioSrc])

  // Socket Logic
  useEffect(() => {
    const isSocketResponseType = (res: any): res is SocketResponseType => {
      return res && typeof res === 'object' && 'hospital' in res
    }

    const handleMessage = (response: unknown) => {
      if (!role && !hosId) return
      if (!isSocketResponseType(response)) return

      if (
        hosId?.toLowerCase() === response.hospital.toLowerCase() ||
        role === 'SUPER' ||
        role === 'SERVICE'
      ) {
        dispatch(setSocketData(response))
      }
    }

    socket.on('receive_message', handleMessage)
    return () => {
      socket.off('receive_message', handleMessage)
    }
  }, [hosId, role, dispatch])

  // Sound Play Logic
  useEffect(() => {
    if (!socketData) return

    const isMessageValid = socketData.message?.toLowerCase() ?? ''
    const isStatusMessage =
      isMessageValid.includes('device offline') ||
      isMessageValid.includes('device online')

    if (isStatusMessage) {
      // อาจจะไม่ต้องทำอะไร หรือเคลียร์ socketData ทันทีข้างนอก
      return
    }

    if (!popUpMode && !soundMode && isMessageValid && audioRef.current) {
      audioRef.current.play().catch(e => console.error('Audio play error', e))
    }
  }, [socketData, popUpMode, soundMode])

  return { audioRef }
}
