import './index.css'
import './styles/daisyui/daisyuiTheme.css'
import 'react-circular-progressbar/dist/styles.css'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import 'react-loading-skeleton/dist/skeleton.css'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { Profiler, StrictMode, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { HelmetProvider } from 'react-helmet-async'
import { StyleSheetManager } from 'styled-components'
import i18n from './lang/i18n.ts'
import isPropValid from '@emotion/is-prop-valid'
import store from './redux/store/index.ts'
import Routes from './routes/routes.tsx'
import FrameRate from './constants/utils/frameRate.tsx'
import { Toaster } from 'react-hot-toast'

// 1. แยก Logic การตั้งค่า Production ออกมา
const setupProductionEnv = () => {
  if (import.meta.env.VITE_APP_NODE_ENV === 'production') {
    // ปิด console log ทั้งหมด ยกเว้น error และ warn
    console.log = () => {}
    console.info = () => {}
    console.table = () => {}
    console.debug = () => {}
    console.trace = () => {}
  }
}

// 2. แยก Logic Fullscreen (Optional: อาจย้ายไป custom hook ได้ในอนาคต)
const setupGlobalListeners = () => {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error enabling fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'f') {
      e.preventDefault() // กัน Default browser action
      toggleFullscreen()
    }
  }

  window.addEventListener('keydown', handleKeyDown)
}

// 3. Wrapper สำหรับ Profiler (แสดงผลเฉพาะ Dev)
const AppProfiler = ({ children }: { children: ReactNode }) => {
  if (import.meta.env.VITE_APP_NODE_ENV !== 'development') {
    return <>{children}</>
  }

  return (
    <Profiler
      id='app'
      onRender={(id, phase, actualDuration) => {
        // Log เฉพาะตอนช้าๆ หรือตามต้องการ
        if (actualDuration > 100) {
          console.log(
            `[Profiler] ${id} (${phase}): ${actualDuration.toFixed(2)}ms`
          )
        }
      }}
    >
      {children}
    </Profiler>
  )
}

// 4. Main Execution Function
const initApp = () => {
  const rootElement = document.getElementById('appWrapper')

  if (!rootElement) {
    console.error('❌ Failed to find root element: #appWrapper')
    return
  }

  setupProductionEnv()
  setupGlobalListeners()

  const root = createRoot(rootElement)

  root.render(
    <StrictMode>
      <AppProfiler>
        <StyleSheetManager shouldForwardProp={isPropValid}>
          <HelmetProvider>
            <Provider store={store}>
              <I18nextProvider i18n={i18n}>
                <Routes />

                {/* FrameRate มักใช้แค่ตอน Dev ถ้า Production ไม่จำเป็นก็ซ่อนได้ */}
                {import.meta.env.VITE_APP_NODE_ENV === 'development' && (
                  <FrameRate />
                )}

                <Toaster position='bottom-right' reverseOrder={false} />
              </I18nextProvider>
            </Provider>
          </HelmetProvider>
        </StyleSheetManager>
      </AppProfiler>
    </StrictMode>
  )
}

// รัน App
initApp()
