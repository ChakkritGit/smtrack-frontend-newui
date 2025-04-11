import { useRef, useState, useEffect } from 'react'
import Video from '../assets/images/dynamic.mp4'
import {
  TbPlayerPause,
  TbPlayerPlay,
  TbVolume,
  TbVolumeOff
} from 'react-icons/tb'
import { RiFullscreenExitFill, RiFullscreenFill } from 'react-icons/ri'

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showCenterIcon, setShowCenterIcon] = useState(false)

  const updateProgress = () => {
    const video = videoRef.current
    if (video && video.duration) {
      const percent = (video.currentTime / video.duration) * 100
      setProgress(percent)
      setCurrentTime(video.currentTime)
      setDuration(video.duration)
    }
  }

  const seek = (e: any) => {
    const video = videoRef.current
    const progressBar = progressRef.current
    if (!video || !progressBar) return

    const rect = progressBar.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const percent = offsetX / rect.width
    video.currentTime = percent * video.duration
    updateProgress()
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }

    setShowCenterIcon(true)
    setTimeout(() => setShowCenterIcon(false), 800)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const handleVolumeChange = (e: any) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = parseFloat(e.target.value)
    video.volume = newVolume
    setVolume(newVolume)
    if (newVolume === 0) {
      video.muted = true
      setIsMuted(true)
    } else {
      video.muted = false
      setIsMuted(false)
    }
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (!document.fullscreenElement) {
      video.parentElement?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '00:00'
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)
    return [
      hours > 0 ? hours.toString().padStart(2, '0') : null,
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ]
      .filter(Boolean)
      .join(':')
  }

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      if (isDragging) seek(e)
    }
    const handleMouseUp = () => setIsDragging(false)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  return (
    <div className='relative w-full max-w-5xl mx-auto group mt-5'>
      <video
        ref={videoRef}
        className='w-full rounded-2xl'
        src={Video}
        controls={false}
        onTimeUpdate={updateProgress}
        width={1080}
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
      />

      {showCenterIcon && (
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
          <div
            className={`bg-black/70 text-white p-3 rounded-full text-3xl opacity-80 animate-fade`}
          >
            {isPlaying ? <TbPlayerPause /> : <TbPlayerPlay />}
          </div>
        </div>
      )}

      <div className='absolute bottom-0 left-0 right-0 h-[50px] flex gap-3 items-center justify-between px-4 py-2 rounded-bl-2xl rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 overflow-hidden'>
        <div
          className='before:absolute before:inset-x-0 before:bottom-0 before:h-12
          before:bg-gradient-to-t before:from-base-content/50 before:to-transparent'
        ></div>

        <div className='flex items-center space-x-3 z-20'>
          <button
            onClick={togglePlay}
            className='text-white hover:scale-110 duration-300 ease-in-out'
          >
            {isPlaying ? (
              <TbPlayerPause size={24} />
            ) : (
              <TbPlayerPlay size={24} />
            )}
          </button>

          <button
            onClick={toggleMute}
            className='text-white hover:scale-110 duration-300 ease-in-out'
          >
            {isMuted || volume === 0 ? (
              <TbVolumeOff size={24} />
            ) : (
              <TbVolume size={24} />
            )}
          </button>

          <input
            type='range'
            min='0'
            max='1'
            step='0.01'
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className='w-20'
          />
        </div>

        <div className='w-full flex items-center gap-3 z-20'>
          <div className='text-white text-sm w-14 text-right'>
            {formatTime(currentTime)}
          </div>
          <div
            ref={progressRef}
            className='relative w-full h-[6px] hover:h-2 transition-[height] bg-white/30 cursor-pointer'
            onClick={seek}
            onMouseDown={() => setIsDragging(true)}
          >
            <div
              className='h-full bg-red-500'
              style={{ width: `${progress}%` }}
            />
            <div
              className='absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full pointer-events-none'
              style={{ left: `${progress}%` }}
            />
          </div>
          <div className='text-white text-sm w-14'>
            -{formatTime(duration - currentTime)}
          </div>
        </div>

        <div className='z-20'>
          <button
            onClick={toggleFullscreen}
            className='text-white hover:scale-110 duration-300 ease-in-out'
          >
            {isFullscreen ? (
              <RiFullscreenExitFill size={24} />
            ) : (
              <RiFullscreenFill size={24} />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
