import './index.css'
import './styles/daisyui/daisyuiTheme.css'
import 'react-circular-progressbar/dist/styles.css'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import 'react-loading-skeleton/dist/skeleton.css'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'
import { StyleSheetManager } from 'styled-components'
import Routes from './routes/routes.tsx'
import i18n from './lang/i18n.ts'
import isPropValid from '@emotion/is-prop-valid'
import store from './redux/store/index.ts'
import FrameRate from './constants/utils/frameRate.tsx'

class AppRenderer {
  private static instance: AppRenderer

  private constructor () {
    this.disableConsoleInProduction()
    this.renderApp()
  }

  public static getInstance (): AppRenderer {
    if (!AppRenderer.instance) {
      AppRenderer.instance = new AppRenderer()
    }
    return AppRenderer.instance
  }

  private disableConsoleInProduction (): void {
    if (import.meta.env.VITE_APP_NODE_ENV === 'production') {
      console.log = () => {}
      // console.error = () => {}
      // console.warn = () => {}
    }
  }

  private renderApp (): void {
    const rootElement = document.getElementById('appWrapper')

    if (!rootElement) {
      console.error('❌ Failed to find root element: #appWrapper')
      return
    }

    createRoot(rootElement).render(
      <StrictMode>
        <StyleSheetManager shouldForwardProp={isPropValid}>
          <HelmetProvider>
            <Provider store={store}>
              <I18nextProvider i18n={i18n}>
                <Routes />
                <FrameRate />
                <Toaster position='bottom-right' reverseOrder={false} />
              </I18nextProvider>
            </Provider>
          </HelmetProvider>
        </StyleSheetManager>
      </StrictMode>
    )
  }
}

AppRenderer.getInstance()
