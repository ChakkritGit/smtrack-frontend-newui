import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'
import { HideFlashFW, HideSetting } from '../../middleware/Auth'

const ErrorScreen = lazy(() => import('../error/error'))
const Home = lazy(() => import('../../pages/home/home'))
const Dashboard = lazy(() => import('../../pages/dashboard/smtrack/dashboard'))
const FullChart = lazy(() => import('../../pages/dashboard/smtrack/fullChart'))
const PreviewPDF = lazy(() => import('../../components/pdf/previewPdf'))
const FullTable = lazy(() => import('../../pages/dashboard/smtrack/fullTable'))
const Users = lazy(() => import('../../pages/users/users'))
const Management = lazy(() => import('../../pages/management/smtrack/management'))
const Warranty = lazy(() => import('../../pages/warranty/warranty'))
const Repair = lazy(() => import('../../pages/repair/repair'))
const Settings = lazy(() => import('../../pages/settings/settings'))
const Notification = lazy(() => import('../../pages/notification/notification'))
const RepairPdf = lazy(() => import('../../components/pdf/repairPdf'))
const WarrantyPdf = lazy(() => import('../../components/pdf/WarrantyPdf'))
const Changelog = lazy(() => import('../../components/changelog/changelog'))
const VideoPlayer = lazy(() => import('../../test/testtwo'))
const DynamicVideoColor = lazy(() => import('../../test/test'))
const TestWrapper = lazy(() => import('../../test/testWrapper'))
const ChartPdf = lazy(() => import('../../test/chartPdf'))
const ManageCsv = lazy(() => import('../../pages/reports/manageCsv'))

const smtrackChildren: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'dashboard',
    element: <Dashboard />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'dashboard/chart',
    element: <FullChart />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'dashboard/chart/preview',
    element: <PreviewPDF />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'dashboard/table',
    element: <FullTable />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'dashboard/chart/compare',
    element: <>dashboard/chart/compare</>,
    errorElement: <ErrorScreen />
  },
  {
    element: <HideSetting />,
    errorElement: <ErrorScreen />,
    children: [
      {
        path: 'users',
        element: <Users />,
        errorElement: <ErrorScreen />
      },
      {
        path: 'management',
        element: <Management />,
        errorElement: <ErrorScreen />
      },
      // {
      //   path: 'management/:id',
      //   element: <>management/:id</>,
      //   errorElement: <ErrorScreen />
      // },
      {
        path: 'management/csv',
        element: <ManageCsv />,
        errorElement: <ErrorScreen />
      }
    ]
  },
  {
    path: 'warranty',
    element: <Warranty />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'warranty/preview',
    element: <WarrantyPdf />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'repair',
    element: <Repair />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'repair/preview',
    element: <RepairPdf />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'settings',
    element: <Settings />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'notification',
    element: <Notification />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'changelog',
    element: <Changelog />,
    errorElement: <ErrorScreen />
  },
  ...(import.meta.env.VITE_APP_NODE_ENV === 'development'
    ? [
        {
          path: 'test',
          element: <TestWrapper />,
          errorElement: <ErrorScreen />,
          children: [
            {
              path: '/test',
              element: <DynamicVideoColor />,
              errorElement: <ErrorScreen />
            },
            {
              path: 'test1',
              element: <VideoPlayer />,
              errorElement: <ErrorScreen />
            },
            {
              path: 'test2',
              element: <ChartPdf />,
              errorElement: <ErrorScreen />
            }
          ]
        }
      ]
    : []),
  {
    element: <HideFlashFW />,
    errorElement: <ErrorScreen />,
    children: [
      {
        path: 'management/flasher',
        element: <>management/flasher</>,
        errorElement: <ErrorScreen />
      }
    ]
  }
]

export { smtrackChildren }
