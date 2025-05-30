import { lazy } from 'react'
import { HideSettingManageTms, HideSettingTms } from '../../middleware/Auth'
import { RouteObject } from 'react-router-dom'
import ErrorScreen from '../error/error'

const HomeTms = lazy(() => import('../../pages/home/homeTms'))
const DashboardTms = lazy(() => import('../../pages/dashboard/tms/dashboardTms'))
const FullChartTms = lazy(() => import('../../pages/dashboard/tms/fullChartTms'))
const PreviewPDF = lazy(() => import('../../components/pdf/previewPdf'))
const FullTableTms = lazy(() => import('../../pages/dashboard/tms/fullTableTms'))
const Users = lazy(() => import('../../pages/users/users'))
const ManagementTms = lazy(() => import('../../pages/management/tms/managementTms'))
const Settings = lazy(() => import('../../pages/settings/settings'))
const Notification = lazy(() => import('../../pages/notification/notification'))
const Changelog = lazy(() => import('../../components/changelog/changelog'))

const tmsChildren: RouteObject[] = [
  {
    path: '/',
    element: <HomeTms />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'dashboard',
    element: <DashboardTms />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'dashboard/chart',
    element: <FullChartTms />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'dashboard/chart/preview',
    element: <PreviewPDF />,
    errorElement: <ErrorScreen />
  },
  {
    path: 'dashboard/table',
    element: <FullTableTms />,
    errorElement: <ErrorScreen />
  },
  {
    element: <HideSettingTms />,
    errorElement: <ErrorScreen />,
    children: [
      {
        path: 'users',
        element: <Users />,
        errorElement: <ErrorScreen />
      }
    ]
  },
  {
    element: <HideSettingManageTms />,
    errorElement: <ErrorScreen />,
    children: [
      {
        path: 'management',
        element: <ManagementTms />,
        errorElement: <ErrorScreen />
      }
    ]
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
]

export { tmsChildren }
