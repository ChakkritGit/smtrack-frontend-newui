import { useEffect, useRef, useState } from 'react'
import { Vibrant } from 'node-vibrant/browser'
import Video from '../assets/images/dynamic.mp4'

export default function DynamicVideoColor () {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [color, setColor] = useState<string>('')

  useEffect(() => {
    const interval = setInterval(() => {
      extractColorFromVideo()
    }, 1300)

    return () => clearInterval(interval)
  }, [])

  const extractColorFromVideo = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(async blob => {
      if (blob) {
        console.log('Blob: ', blob)
        const imageURL = URL.createObjectURL(blob)
        const palette = await Vibrant.from(imageURL).getPalette()
        setColor(palette?.Vibrant?.hex ?? '#000000')
      }
    }, 'image/jpeg')
  }

  useEffect(() => {
    console.log('Color: ', color)
  }, [color])

  return (
    <div className='h-screen p-5 flex flex-col items-center gap-2'>
      <div className='relative flex justify-center items-center'>
        <video
          ref={videoRef}
          controls
          autoPlay
          muted
          loop
          src={Video}
          crossOrigin='anonymous'
          className='w-[320px] h-[180px] md:w-[720px] md:h-[405px] rounded-2xl z-20'
        />
        <div
          className={`absolute w-[320px] h-[180px] md:w-[800px] md:h-[500px] blur-[128px] md:blur-[256px] rounded-2xl duration-1000 ease-linear z-10`}
          style={{ backgroundColor: color }}
        ></div>
      </div>
      <div className='relative flex justify-center mt-3 w-full'>
        <canvas
          ref={canvasRef}
          className='w-[320px] md:w-[720px] rounded-2xl z-10'
        />
        <p className='text-white bg-black/70 p-2 rounded-lg text-[22px] md:text-[32px] font-medium absolute bottom-3 z-20'>
          <span className='text-shadow-lg'>Dominant color:</span>{' '}
          <span
            className='text-white rounded-lg px-2'
            style={{ backgroundColor: color }}
          >
            {' '}
            <span className='text-shadow-lg'>{color}</span>
          </span>
        </p>
      </div>
    </div>
  )
}
