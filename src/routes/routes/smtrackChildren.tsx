import { RouteObject } from 'react-router-dom'
import { HideSetting } from '../../middleware/Auth'
import Home from '../../pages/home/home'
import Dashboard from '../../pages/dashboard/smtrack/dashboard'
import FullChart from '../../pages/dashboard/smtrack/fullChart'
import PreviewPDF from '../../components/pdf/previewPdf'
import FullTable from '../../pages/dashboard/smtrack/fullTable'
import Users from '../../pages/users/users'
import Management from '../../pages/management/smtrack/management'
import ManageCsv from '../../pages/reports/manageCsv'
import Warranty from '../../pages/warranty/warranty'
import WarrantyPdf from '../../components/pdf/WarrantyPdf'
import Repair from '../../pages/repair/repair'
import RepairPdf from '../../components/pdf/repairPdf'
import Settings from '../../pages/settings/settings'
import Notification from '../../pages/notification/notification'
import Changelog from '../../components/changelog/changelog'
// import TestWrapper from '../../test/testWrapper'
// import DynamicVideoColor from '../../test/test'
// import VideoPlayer from '../../test/testtwo'
// import ChartPdf from '../../test/chartPdf'

const smtrackChildren: RouteObject[] = [
  {
    index: true, // ใช้ index: true แทน path: '/' สำหรับหน้า Default
    element: <Home />
  },
  {
    path: 'dashboard',
    element: <Dashboard />
  },
  {
    path: 'dashboard/chart',
    element: <FullChart />
  },
  {
    path: 'dashboard/chart/preview',
    element: <PreviewPDF />
  },
  {
    path: 'dashboard/table',
    element: <FullTable />
  },
  {
    path: 'dashboard/chart/compare',
    element: <>dashboard/chart/compare</>
  },
  {
    // Group นี้มี Middleware คุม
    element: <HideSetting />,
    children: [
      {
        path: 'users',
        element: <Users />
      },
      {
        path: 'management',
        element: <Management />
      },
      {
        path: 'management/csv',
        element: <ManageCsv />
      }
    ]
  },
  {
    path: 'warranty',
    element: <Warranty />
  },
  {
    path: 'warranty/preview',
    element: <WarrantyPdf />
  },
  {
    path: 'repair',
    element: <Repair />
  },
  {
    path: 'repair/preview',
    element: <RepairPdf />
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
  // Dev Routes
  // ...(import.meta.env.VITE_APP_NODE_ENV === 'development'
  //   ? [
  //       {
  //         path: 'test',
  //         element: <TestWrapper />,
  //         children: [
  //           {
  //             path: '/test', // ระวัง: ใส่ / นำหน้า จะกลายเป็น Absolute Path (ต่อท้าย Domain) ไม่ต่อท้าย Parent
  //             element: <DynamicVideoColor />
  //           },
  //           {
  //             path: 'test1',
  //             element: <VideoPlayer />
  //           },
  //           {
  //             path: 'test2',
  //             element: <ChartPdf />
  //           }
  //         ]
  //       }
  //     ]
  //   : []),
  // {
  //   element: <HideFlashFW />,
  //   children: [
  //     {
  //       path: 'management/flasher',
  //       element: <>management/flasher</>
  //     }
  //   ]
  // }
]

export { smtrackChildren }
