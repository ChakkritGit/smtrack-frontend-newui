import { createBrowserRouter } from 'react-router-dom'
import { smtrackChildren } from './routes/smtrackChildren'
import { tmsChildren } from './routes/tmsChildren'
import MainSmtrack from '../main/smtrack/main'
import MainTms from '../main/tms/main'
import { AuthRoute } from '../middleware/authprotect'
import { LogoutAuth } from '../middleware/Auth'
import NotFound from './error/notFound'
import App from './docs/app'
import Support from './docs/support'
import TermsConditions from './docs/termsConditions'
import PrivacyPolicy from './docs/privacyPolicy'
import ErrorScreen from './error/error'

const router = (role: string, tmsMode: boolean) =>
  createBrowserRouter([
    {
      path: '/',
      element: <AuthRoute />,
      children: [
        {
          path: '/',
          element: (
            tmsMode
              ? !(role === 'LEGACY_ADMIN' || role === 'LEGACY_USER')
              : role === 'LEGACY_ADMIN' || role === 'LEGACY_USER'
          ) ? (
            <MainTms />
          ) : (
            <MainSmtrack />
          ),
          errorElement: <ErrorScreen />,
          children: (
            tmsMode
              ? !(role === 'LEGACY_ADMIN' || role === 'LEGACY_USER')
              : role === 'LEGACY_ADMIN' || role === 'LEGACY_USER'
          )
            ? tmsChildren
            : smtrackChildren
        }
      ]
    },
    {
      path: '/privacy-policy',
      element: <PrivacyPolicy />
    },
    {
      path: '/terms-conditions',
      element: <TermsConditions />
    },
    {
      path: '/support',
      element: <Support />
    },
    {
      path: '/app',
      element: <App />
    },
    {
      path: '/login',
      element: <LogoutAuth />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ])

export { router }
