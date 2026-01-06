import { createBrowserRouter, RouteObject } from 'react-router-dom'
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

const router = (role: string, tmsMode: boolean) => {
  // 1. แยก Logic เช็ค Legacy Role ออกมาเพื่อให้แก้ไของ่ายในอนาคต
  const isLegacyUser = ['LEGACY_ADMIN', 'LEGACY_USER'].includes(role)

  // 2. คำนวณ Logic หลักเพียงครั้งเดียว (ยุบ Ternary Operator ที่ซ้อนกันใน JSX)
  // Logic เดิมคือ: (tmsMode ? !isLegacy : isLegacy)
  const shouldUseTms = tmsMode ? !isLegacyUser : isLegacyUser

  // 3. เตรียม Component และ Route Children ตามผลลัพธ์ข้างบน
  const SystemMainElement = shouldUseTms ? <MainTms /> : <MainSmtrack />
  const systemChildren = shouldUseTms ? tmsChildren : smtrackChildren

  // 4. แยก Public Routes (หน้าเอกสาร/Login/404) ออกมาเป็น Array เพื่อความสะอาด
  const publicRoutes: RouteObject[] = [
    { path: '/policies', element: <Overview /> },
    { path: '/privacy-policy', element: <PrivacyPolicy /> },
    { path: '/terms-conditions', element: <TermsConditions /> },
    { path: '/support', element: <Support /> },
    { path: '/app', element: <App /> },
    { path: '/login', element: <LogoutAuth /> },
    { path: '*', element: <NotFound /> }
  ]

  // 5. Return Router Config ที่ดูโล่งตา
  return createBrowserRouter([
    {
      path: '/',
      element: <AuthRoute />,
      children: [
        {
          path: '/',
          element: SystemMainElement, // ใส่ตัวแปรที่เตรียมไว้
          errorElement: <ErrorScreen />,
          children: systemChildren // ใส่ตัวแปรที่เตรียมไว้
        }
      ]
    },
    ...publicRoutes // กระจาย Array เข้ามาต่อท้าย
  ])
}

export { router }
