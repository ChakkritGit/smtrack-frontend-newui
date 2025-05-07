import { RouteObject } from 'react-router-dom'
import { HideFlashFW, HideSetting } from '../../middleware/Auth'
import ErrorScreen from '../error/error'
import Home from '../../pages/home/home'
import Dashboard from '../../pages/dashboard/smtrack/dashboard'
import FullChart from '../../pages/dashboard/smtrack/fullChart'
import PreviewPDF from '../../components/pdf/previewPdf'
import FullTable from '../../pages/dashboard/smtrack/fullTable'
import Users from '../../pages/users/users'
import Management from '../../pages/management/smtrack/management'
import Warranty from '../../pages/warranty/warranty'
import Repair from '../../pages/repair/repair'
import Settings from '../../pages/settings/settings'
import Notification from '../../pages/notification/notification'
import RepairPdf from '../../components/pdf/repairPdf'
import WarrantyPdf from '../../components/pdf/WarrantyPdf'
import Changelog from '../../components/changelog/changelog'
// import VideoPlayer from '../../test/testtwo'
// import DynamicVideoColor from '../../test/test'
import TestWrapper from '../../test/testWrapper'
import ChartPdf from '../../test/chartPdf'

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
      {
        path: 'management/:id',
        element: <>management/:id</>,
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
  ...(import.meta.env.VITE_APP_NODE_ENV === 'production'
    ? [
        {
          path: 'test',
          element: <TestWrapper />,
          errorElement: <ErrorScreen />,
          children: [
            // {
            //   path: '/test',
            //   element: <DynamicVideoColor />,
            //   errorElement: <ErrorScreen />
            // },
            // {
            //   path: 'test2',
            //   element: <VideoPlayer />,
            //   errorElement: <ErrorScreen />
            // },
            {
              path: '/test',
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
