import { RouteObject } from 'react-router-dom'
import { HideSettingManageTms, HideSettingTms } from '../../middleware/Auth'
import HomeTms from '../../pages/home/homeTms'
import DashboardTms from '../../pages/dashboard/tms/dashboardTms'
import FullChartTms from '../../pages/dashboard/tms/fullChartTms'
import PreviewPDF from '../../components/pdf/previewPdf'
import FullTableTms from '../../pages/dashboard/tms/fullTableTms'
import Users from '../../pages/users/users'
import ManagementTms from '../../pages/management/tms/managementTms'
import Settings from '../../pages/settings/settings'
import Changelog from '../../components/changelog/changelog'
import Notification from '../../pages/notification/notification'

const tmsChildren: RouteObject[] = [
  {
    index: true, // หน้าแรกของ TMS
    element: <HomeTms />
  },
  {
    path: 'dashboard',
    element: <DashboardTms />
  },
  {
    path: 'dashboard/chart',
    element: <FullChartTms />
  },
  {
    path: 'dashboard/chart/preview',
    element: <PreviewPDF />
  },
  {
    path: 'dashboard/table',
    element: <FullTableTms />
  },
  {
    // Middleware กลุ่ม 1
    element: <HideSettingTms />,
    children: [
      {
        path: 'users',
        element: <Users />
      }
    ]
  },
  {
    // Middleware กลุ่ม 2
    element: <HideSettingManageTms />,
    children: [
      {
        path: 'management',
        element: <ManagementTms />
      }
    ]
  },
  {
    path: 'settings',
    element: <Settings />
  },
  {
    path: 'notification',
    element: <Notification />
  },
  {
    path: 'changelog',
    element: <Changelog />
  }
]

export { tmsChildren }
