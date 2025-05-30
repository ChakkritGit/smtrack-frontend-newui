// import { useEffect, useState } from 'react'
// import { RootState } from '../../redux/reducers/rootReducer'
// import { useSelector } from 'react-redux'
// import { getOKLCHColor } from '../../constants/utils/color'
// import Logo from '../../assets/images/app-logo.png'
// import { useTranslation } from 'react-i18next'
// import { TFunction } from 'i18next'

// interface ProgressBarProps {
//   progress: number
//   showPercentage?: boolean
//   className?: string
//   t: TFunction
// }

// const ProgressBar = ({
//   progress,
//   showPercentage = false,
//   className = '',
//   t
// }: ProgressBarProps) => {
//   return (
//     <div className={`w-full max-w-xs ${className}`}>
//       {showPercentage && (
//         <div className='mb-2 flex justify-between items-center'>
//           <span className='text-sm opacity-70'>{t('loading')}</span>
//           <span className='text-sm opacity-70'>{Math.round(progress)}%</span>
//         </div>
//       )}
//       <div className='w-full bg-base-300/30 rounded-full h-1.5 overflow-hidden'>
//         <div
//           className='bg-primary h-1.5 rounded-full transition-all duration-500 ease-out'
//           style={{ width: `${progress}%` }}
//         />
//       </div>
//     </div>
//   )
// }

// interface CircularProgressProps {
//   progress: number
//   size?: number
//   strokeWidth?: number
//   showPercentage?: boolean
//   className?: string
// }

// const CircularProgress = ({
//   progress = 0,
//   size = 80,
//   strokeWidth = 3,
//   showPercentage = false,
//   className = ''
// }: CircularProgressProps) => {
//   const radius = (size - strokeWidth) / 2
//   const circumference = radius * 2 * Math.PI
//   const offset = circumference - (progress / 100) * circumference

//   return (
//     <div className={`flex items-center justify-center ${className}`}>
//       <div className='relative'>
//         <svg width={size} height={size} className='transform -rotate-90'>
//           <circle
//             cx={size / 2}
//             cy={size / 2}
//             r={radius}
//             stroke='currentColor'
//             strokeWidth={strokeWidth}
//             fill='transparent'
//             className='text-base-300/30'
//           />
//           <circle
//             cx={size / 2}
//             cy={size / 2}
//             r={radius}
//             stroke='currentColor'
//             strokeWidth={strokeWidth}
//             fill='transparent'
//             strokeDasharray={circumference}
//             strokeDashoffset={offset}
//             className='text-primary transition-all duration-500 ease-out'
//             strokeLinecap='round'
//           />
//         </svg>
//         {showPercentage && (
//           <div className='absolute inset-0 flex items-center justify-center'>
//             <span className='text-sm font-medium opacity-70'>
//               {Math.round(progress)}%
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// const DotsLoading = ({ className = '' }: { className?: string }) => {
//   return (
//     <div className={`flex items-center justify-center space-x-1 ${className}`}>
//       <div className='w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]'></div>
//       <div className='w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]'></div>
//       <div className='w-2 h-2 bg-primary rounded-full animate-bounce'></div>
//     </div>
//   )
// }

// interface SplashScreenProps {
//   progressType?: 'linear' | 'circular' | 'dots' | 'none'
//   showPercentage?: boolean
//   duration?: number
// }

// const SplashScreen = ({
//   progressType = 'linear',
//   showPercentage = false,
//   duration = 2500
// }: SplashScreenProps) => {
//   const { t } = useTranslation()
//   const [visible, setVisible] = useState(true)
//   const [progress, setProgress] = useState(0)
//   const [loadingStage, setLoadingStage] = useState('')
//   const { themeMode } = useSelector((state: RootState) => state.utils)

//   const system = window.matchMedia('(prefers-color-scheme: dark)').matches
//     ? 'dark'
//     : 'light'

//   useEffect(() => {
//     const htmlElement = document.documentElement
//     htmlElement.setAttribute('data-theme', themeMode)
//     const themeColorMetaTag = document.querySelector('meta[name="theme-color"]')
//     const currentColor = getOKLCHColor(themeMode, system)

//     if (themeColorMetaTag) {
//       themeColorMetaTag.setAttribute('content', currentColor)
//     } else {
//       const newMetaTag = document.createElement('meta')
//       newMetaTag.setAttribute('name', 'theme-color')
//       newMetaTag.setAttribute('content', currentColor)
//       document.head.appendChild(newMetaTag)
//     }

//     const statusBarMetaTag = document.querySelector(
//       'meta[name="apple-mobile-web-app-status-bar-style"]'
//     )
//     if (statusBarMetaTag) {
//       statusBarMetaTag.setAttribute('content', currentColor)
//     } else {
//       const newStatusBarMetaTag = document.createElement('meta')
//       newStatusBarMetaTag.setAttribute(
//         'name',
//         'apple-mobile-web-app-status-bar-style'
//       )
//       newStatusBarMetaTag.setAttribute('content', currentColor)
//       document.head.appendChild(newStatusBarMetaTag)
//     }

//     if (progressType !== 'none') {
//       const loadingStages = [
//         { stage: t('initial'), progress: 25 },
//         { stage: t('loadingResoures'), progress: 60 },
//         { stage: t('preparingInterface'), progress: 85 },
//         { stage: t('almostready'), progress: 100 }
//       ]

//       let currentStageIndex = 0
//       const stageInterval = duration / loadingStages.length

//       const updateProgress = () => {
//         if (currentStageIndex < loadingStages.length) {
//           const { stage, progress: targetProgress } =
//             loadingStages[currentStageIndex]
//           setLoadingStage(stage)

//           const startProgress =
//             currentStageIndex === 0
//               ? 0
//               : loadingStages[currentStageIndex - 1].progress
//           const progressDiff = targetProgress - startProgress
//           const steps = 20
//           const stepSize = progressDiff / steps
//           const stepDuration = stageInterval / steps

//           let step = 0
//           const progressTimer = setInterval(() => {
//             step++
//             const currentProgress = startProgress + stepSize * step
//             setProgress(Math.min(currentProgress, targetProgress))

//             if (step >= steps) {
//               clearInterval(progressTimer)
//               currentStageIndex++
//               if (currentStageIndex < loadingStages.length) {
//                 setTimeout(updateProgress, 100)
//               } else {
//                 setTimeout(() => {
//                   setVisible(false)
//                 }, 200)
//               }
//             }
//           }, stepDuration)
//         }
//       }

//       const startTimer = setTimeout(updateProgress, 300)

//       return () => {
//         clearTimeout(startTimer)
//       }
//     } else {
//       const timer = setTimeout(() => {
//         setVisible(false)
//       }, 300)

//       return () => clearTimeout(timer)
//     }
//   }, [themeMode, system, progressType, duration])

//   const renderProgress = () => {
//     switch (progressType) {
//       case 'linear':
//         return (
//           <ProgressBar
//             progress={progress}
//             showPercentage={showPercentage}
//             className={`mt-6 transition-all duration-800 delay-300 ease-out ${
//               visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
//             }`}
//             t={t}
//           />
//         )
//       case 'circular':
//         return (
//           <CircularProgress
//             progress={progress}
//             showPercentage={showPercentage}
//             className={`mt-6 transition-all duration-800 delay-300 ease-out ${
//               visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
//             }`}
//           />
//         )
//       case 'dots':
//         return (
//           <DotsLoading
//             className={`mt-6 transition-all duration-800 delay-300 ease-out ${
//               visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
//             }`}
//           />
//         )
//       default:
//         return null
//     }
//   }

//   return (
//     <div
//       className={`fixed inset-0 z-[9999] flex flex-col gap-1.5 md:gap-3 items-center justify-center transition-opacity duration-800 delay-300 ease-in-out bg-base-100 ${
//         visible ? 'opacity-100 visible' : 'opacity-0 invisible'
//       }`}
//       data-theme={themeMode}
//     >
//       <div
//         className={`avatar transition-all duration-800 delay-300 ease-out ${
//           visible
//             ? 'scale-100 opacity-100 blur-none'
//             : 'scale-[2000%] opacity-0 blur-3xl'
//         }`}
//       >
//         <div className='w-16 md:w-28 rounded-2xl'>
//           <img
//             src={Logo}
//             alt='SM-LOGO'
//             className={`scale-105 transition-all duration-800 delay-300 ease-out ${
//               visible ? 'scale-100' : 'scale-[1800%]'
//             }`}
//           />
//         </div>
//       </div>

//       {progressType !== 'none' && (
//         <div
//           className={`text-center mt-4 transition-all duration-800 delay-200 ease-out ${
//             visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
//           }`}
//         >
//           <p className='text-sm opacity-70 min-h-[1.25rem]'>
//             {loadingStage || t('loading')}
//           </p>
//         </div>
//       )}

//       {renderProgress()}

//       <span
//         className={`text-lg font-medium opacity-70 absolute bottom-10 md:bottom-3.5 transition-all duration-800 delay-300 ease-out ${
//           visible ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-8'
//         }`}
//       >
//         Siamatic Co. Ltd
//       </span>
//     </div>
//   )
// }

// export default SplashScreen

import {
  useEffect,
  useState,
  ComponentType,
  StrictMode,
  Profiler,
  useRef
} from 'react'
import { RootState } from '../../redux/reducers/rootReducer'
import { useSelector } from 'react-redux'
import { getOKLCHColor } from '../../constants/utils/color'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { Toaster } from 'react-hot-toast'
import Logo from '../../assets/images/app-logo.png'
import FrameRate from '../../constants/utils/frameRate'

interface ProgressBarProps {
  progress: number
  showPercentage?: boolean
  className?: string
  t: TFunction
}

const ProgressBar = ({
  progress,
  showPercentage = false,
  className = '',
  t
}: ProgressBarProps) => {
  return (
    <div className={`w-full max-w-xs ${className}`}>
      {showPercentage && (
        <div className='mb-2 flex justify-between items-center'>
          <span className='text-sm opacity-70'>{t('loading')}</span>{' '}
          <span className='text-sm opacity-70'>{Math.round(progress)}%</span>
        </div>
      )}
      <div className='w-full bg-base-300/30 rounded-full h-1.5 overflow-hidden'>
        <div
          className='bg-primary h-1.5 rounded-full transition-all duration-300 ease-linear'
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

interface CircularProgressProps {
  progress: number
  size?: number
  strokeWidth?: number
  showPercentage?: boolean
  className?: string
}

const CircularProgress = ({
  progress = 0,
  size = 80,
  strokeWidth = 3,
  showPercentage = false,
  className = ''
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className='relative'>
        <svg width={size} height={size} className='transform -rotate-90'>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke='currentColor'
            strokeWidth={strokeWidth}
            fill='transparent'
            className='text-base-300/30'
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke='currentColor'
            strokeWidth={strokeWidth}
            fill='transparent'
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className='text-primary transition-all duration-300 ease-linear'
            strokeLinecap='round'
          />
        </svg>
        {showPercentage && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <span className='text-sm font-medium opacity-70'>
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

const DotsLoading = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      <div className='w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]'></div>
      <div className='w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]'></div>
      <div className='w-2 h-2 bg-primary rounded-full animate-bounce'></div>
    </div>
  )
}

interface SplashScreenProps {
  progressType?: 'linear' | 'circular' | 'dots' | 'none'
  showPercentage?: boolean
  animationDuration?: number
  componentPromise?: Promise<{ default: ComponentType<any> }>
}

const PRE_ROUTES_LOAD_PROGRESS_TARGET = 80
const POST_ROUTES_LOAD_DURATION_RATIO = 0.3
const POST_100_DISPLAY_DURATION = 700

const SplashScreen = ({
  progressType = 'linear',
  showPercentage = false,
  animationDuration = 2000,
  componentPromise
}: SplashScreenProps) => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const [loadingStageMessage, setLoadingStageMessage] = useState(t('initial'))
  const [RoutesComponent, setRoutesComponent] =
    useState<ComponentType<any> | null>(null)
  const [areRoutesLoaded, setAreRoutesLoaded] = useState(false)
  const [delayedRender, setDelayedRender] = useState(false)
  const { themeMode } = useSelector((state: RootState) => state.utils)
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const visibilityTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setLoadingStageMessage(t('initial'))
    setProgress(0)

    if (componentPromise) {
      componentPromise
        .then(({ default: LoadedRoutes }) => {
          setRoutesComponent(() => LoadedRoutes)
          setAreRoutesLoaded(true)
        })
        .catch(error => {
          console.error('❌ Failed to load Routes:', error)
          setAreRoutesLoaded(true)
        })
    } else {
      setAreRoutesLoaded(true)
    }
  }, [componentPromise, t])

  useEffect(() => {
    const htmlElement = document.documentElement
    htmlElement.setAttribute('data-theme', themeMode)
    const themeColorMetaTag = document.querySelector('meta[name="theme-color"]')
    const currentColor = getOKLCHColor(themeMode, system)
    if (themeColorMetaTag) {
      themeColorMetaTag.setAttribute('content', currentColor)
    } else {
      const newMetaTag = document.createElement('meta')
      newMetaTag.setAttribute('name', 'theme-color')
      newMetaTag.setAttribute('content', currentColor)
      document.head.appendChild(newMetaTag)
    }
    const statusBarMetaTag = document.querySelector(
      'meta[name="apple-mobile-web-app-status-bar-style"]'
    )
    if (statusBarMetaTag) {
      statusBarMetaTag.setAttribute('content', currentColor)
    } else {
      const newMetaTag = document.createElement('meta')
      newMetaTag.setAttribute('name', 'apple-mobile-web-app-status-bar-style')
      newMetaTag.setAttribute('content', currentColor)
      document.head.appendChild(newMetaTag)
    }

    const clearProgressInterval = () => {
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }

    if (progressType === 'none') {
      if (areRoutesLoaded) {
        if (visibilityTimeoutRef.current)
          clearTimeout(visibilityTimeoutRef.current)
        visibilityTimeoutRef.current = setTimeout(
          () => setVisible(false),
          POST_100_DISPLAY_DURATION
        )
      }
      return
    }

    if (progress < PRE_ROUTES_LOAD_PROGRESS_TARGET && !areRoutesLoaded) {
      setLoadingStageMessage(t('loadingResoures'))
      const durationPhase1 =
        animationDuration * (1 - POST_ROUTES_LOAD_DURATION_RATIO)
      const steps = PRE_ROUTES_LOAD_PROGRESS_TARGET - progress
      if (steps <= 0) return

      const stepDuration = Math.max(durationPhase1 / steps, 10)
      clearProgressInterval()
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= PRE_ROUTES_LOAD_PROGRESS_TARGET - 1 || areRoutesLoaded) {
            clearProgressInterval()
            if (areRoutesLoaded) {
              setProgress(PRE_ROUTES_LOAD_PROGRESS_TARGET)
            }
            return Math.min(prev + 1, PRE_ROUTES_LOAD_PROGRESS_TARGET)
          }
          return prev + 1
        })
      }, stepDuration)
    } else if (areRoutesLoaded && progress < 100) {
      setLoadingStageMessage(t('almostready'))
      const startProgress = Math.max(progress, PRE_ROUTES_LOAD_PROGRESS_TARGET)
      if (progress < startProgress) {
        setProgress(startProgress)
        return
      }

      const durationPhase2 = animationDuration * POST_ROUTES_LOAD_DURATION_RATIO
      const stepsTo100 = 100 - startProgress
      if (stepsTo100 <= 0) {
        if (progress < 100) setProgress(100)
        return
      }

      const stepDuration100 = Math.max(durationPhase2 / stepsTo100, 10)
      clearProgressInterval()
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 99) {
            clearProgressInterval()
            setProgress(100)
            return 100
          }
          return prev + 1
        })
      }, stepDuration100)
    } else if (areRoutesLoaded && progress === 100 && visible) {
      setLoadingStageMessage(t('almostready'))
      clearProgressInterval()
      if (visibilityTimeoutRef.current)
        clearTimeout(visibilityTimeoutRef.current)
      visibilityTimeoutRef.current = setTimeout(() => {
        setVisible(false)
      }, POST_100_DISPLAY_DURATION)
    }

    return () => {
      clearProgressInterval()
      if (visibilityTimeoutRef.current)
        clearTimeout(visibilityTimeoutRef.current)
    }
  }, [
    themeMode,
    system,
    progressType,
    animationDuration,
    t,
    areRoutesLoaded,
    progress,
    visible
  ])

  const renderProgressComponent = () => {
    switch (progressType) {
      case 'linear':
        return (
          <ProgressBar
            progress={progress}
            showPercentage={showPercentage}
            className={`mt-6 transition-all duration-800 delay-300 ease-out ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            t={t}
          />
        )
      case 'circular':
        return (
          <CircularProgress
            progress={progress}
            showPercentage={showPercentage}
            className={`mt-6 transition-all duration-800 delay-300 ease-out ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          />
        )
      case 'dots':
        return (
          <DotsLoading
            className={`mt-6 transition-all duration-800 delay-300 ease-out ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          />
        )
      default:
        return null
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (!visible && RoutesComponent) {
      timer = setTimeout(() => {
        setDelayedRender(true)
      }, 600)
    }

    return () => {
      clearTimeout(timer)
      setDelayedRender(false)
    }
  }, [visible, RoutesComponent])

  if (!visible && RoutesComponent && delayedRender) {
    return (
      <StrictMode>
        <Profiler
          id='app'
          onRender={(
            id,
            phase,
            actualDuration,
            baseDuration,
            startTime,
            commitTime
          ) => {
            if (import.meta.env.VITE_APP_NODE_ENV === 'development') {
              console.table([
                {
                  Component: id,
                  Phase: phase,
                  'Actual Duration (ms)': actualDuration.toFixed(2),
                  'Base Duration (ms)': baseDuration.toFixed(2),
                  'Start Time (ms)': startTime.toFixed(2),
                  'Commit Time (ms)': commitTime.toFixed(2)
                }
              ])
            }
          }}
        >
          <RoutesComponent />
          <FrameRate />
          <Toaster position='bottom-right' reverseOrder={false} />
        </Profiler>
      </StrictMode>
    )
  }

  if (!visible && !RoutesComponent && areRoutesLoaded && delayedRender) {
    return (
      <div className='fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-base-100 text-error'>
        <p>{t('routesLoadError') || 'Error loading application.'}</p>
      </div>
    )
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col gap-1.5 md:gap-3 items-center justify-center transition-opacity duration-800 delay-300 ease-in-out bg-base-100 ${
        visible ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      data-theme={themeMode}
    >
      <div
        className={`avatar transition-all duration-800 delay-300 ease-out ${
          visible
            ? 'scale-100 opacity-100 blur-none'
            : 'scale-[500%] md:scale-[2000%] opacity-0 blur-3xl'
        }`}
      >
        <div className='w-16 md:w-28 rounded-2xl'>
          <img
            src={Logo}
            alt='SM-LOGO'
            className={`scale-105 transition-all duration-800 delay-300 ease-out ${
              visible ? 'scale-100' : 'scale-200 md:scale-[1800%]'
            }`}
          />
        </div>
      </div>

      {progressType !== 'none' && (
        <div
          className={`text-center mt-4 transition-all duration-800 delay-200 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className='text-sm opacity-70 min-h-[1.25rem]'>
            {loadingStageMessage}
          </p>
        </div>
      )}

      {renderProgressComponent()}

      <span
        className={`text-lg font-medium opacity-70 absolute bottom-10 md:bottom-3.5 transition-all duration-800 delay-300 ease-out ${
          visible ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        Siamatic Co. Ltd
      </span>
    </div>
  )
}

export default SplashScreen
