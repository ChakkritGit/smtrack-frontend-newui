import { HideSettingManageTms, HideSettingTms } from '../../middleware/Auth'
import { RouteObject } from 'react-router-dom'
import ErrorScreen from '../error/error'
import HomeTms from '../../pages/home/homeTms'
import DashboardTms from '../../pages/dashboard/tms/dashboardTms'
import FullChartTms from '../../pages/dashboard/tms/fullChartTms'
import PreviewPDF from '../../components/pdf/previewPdf'
import FullTableTms from '../../pages/dashboard/tms/fullTableTms'
import Users from '../../pages/users/users'
import ManagementTms from '../../pages/management/tms/managementTms'
import Settings from '../../pages/settings/settings'
import Notification from '../../pages/notification/notification'
import Changelog from '../../components/changelog/changelog'

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
