import { useEffect, useMemo, useState } from 'react'
import { RootState } from '../../redux/reducers/rootReducer'
import { useSelector } from 'react-redux'

const FrameRate = () => {
  const { fpsDisabled } = useSelector((state: RootState) => state.utils)
  const [frameRate, setFrameRate] = useState(0)

  let lastTime = performance.now()
  let frame = 0

  const checkFPS = () => {
    const now = performance.now()
    frame++

    if (now - lastTime >= 1000) {
      setFrameRate(frame)
      frame = 0
      lastTime = now
    }

    requestAnimationFrame(checkFPS)
  }

  useEffect(() => {
    if (!fpsDisabled) return

    checkFPS()
  }, [fpsDisabled])

  const FrameRateComponent = useMemo(() => {
    if (!fpsDisabled) return null

    return (
      <div className='flex items-center justify-center gap-1 text-white bg-black/70 text-base md:text-lg font-medium p-3 rounded-box fixed top-[70px] md:top-1 left-1 max-w-[130px] w-[80px] md:w-[100px] h-[40px] md:h-[50px] z-[calc(infinity)]'>
        <span>{frameRate}</span>
        <span>FPS</span>
      </div>
    )
  }, [frameRate, fpsDisabled])

  return <>{FrameRateComponent}</>
}

export default FrameRate
