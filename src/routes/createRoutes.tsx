import { createBrowserRouter } from 'react-router-dom'
import { smtrackChildren } from './routes/smtrackChildren'
import { tmsChildren } from './routes/tmsChildren'
import { AuthRoute } from '../middleware/authprotect'
import { LogoutAuth } from '../middleware/Auth'
import ErrorScreen from './error/error'
import NotFound from './error/notFound'
import MainSmtrack from '../main/smtrack/main'
import Overview from './docs/overview'
import PrivacyPolicy from './docs/privacyPolicy'
import TermsConditions from './docs/termsConditions'
import Support from './docs/support'
import App from './docs/app'
import MainTms from '../main/tms/main'
// const MainTms = import('../main/tms/main')
// const MainSmtrack = import('../main/smtrack/main')
// const Overview = lazy(() => import('./docs/overview'))
// const PrivacyPolicy = lazy(() => import('./docs/privacyPolicy'))
// const TermsConditions = lazy(() => import('./docs/termsConditions'))
// const Support = lazy(() => import('./docs/support'))
// const App = lazy(() => import('./docs/app'))

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
      path: '/policies',
      element: <Overview />
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
