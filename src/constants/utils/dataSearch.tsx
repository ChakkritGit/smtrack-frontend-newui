import {
  RiDashboardLine,
  RiFileSettingsLine,
  RiHome3Line,
  RiListSettingsLine,
  RiSettings3Line,
  RiShieldCheckLine,
  RiUser6Line
} from 'react-icons/ri'
import { UserRole } from '../../types/global/users/usersType'

const menuDataArraySmtrack = (role: UserRole | undefined, tmsMode: boolean) => {
  switch (role) {
    case 'SUPER':
      return tmsMode
        ? [
            {
              text: 'sideShowAllBox',
              path: '/',
              tag: 'Show all Devices, แสดงกล่องทั้งหมด',
              icon: <RiHome3Line size={20} />
            },
            {
              text: 'sideDashboard',
              path: '/dashboard',
              tag: 'Dashboard, แดชบอร์ด',
              icon: <RiDashboardLine size={20} />
            },
            {
              text: 'sidePermission',
              path: '/users',
              tag: 'Manage Users, จัดการผู้ใช้',
              icon: <RiUser6Line size={20} />
            },
            {
              text: 'sideManage',
              path: '/management',
              tag: 'Manage, จัดการ',
              icon: <RiListSettingsLine size={20} />
            }
          ]
        : [
            {
              text: 'sideShowAllBox',
              path: '/',
              tag: 'Show all Devices, แสดงกล่องทั้งหมด',
              icon: <RiHome3Line size={20} />
            },
            {
              text: 'sideDashboard',
              path: '/dashboard',
              tag: 'Dashboard, แดชบอร์ด',
              icon: <RiDashboardLine size={20} />
            },
            {
              text: 'sidePermission',
              path: '/users',
              tag: 'Manage Users, จัดการผู้ใช้',
              icon: <RiUser6Line size={20} />
            },
            {
              text: 'sideManage',
              path: '/management',
              tag: 'Manage, จัดการ',
              icon: <RiListSettingsLine size={20} />
            },
            {
              text: 'sideRepair',
              path: '/repair',
              tag: 'Repairs, แจ้งซ่อม',
              icon: <RiFileSettingsLine size={20} />
            },
            {
              text: 'sideWarranty',
              path: '/warranty',
              tag: 'Warranties, การรับประกัน',
              icon: <RiShieldCheckLine size={20} />
            },
            {
              text: 'sideSetting',
              path: '/settings',
              tag: 'Settings, การตั้งค่า',
              icon: <RiSettings3Line size={20} />
            }
          ]
    case 'SERVICE':
      return [
        {
          text: 'sideShowAllBox',
          path: '/',
          tag: 'Show all Devices, แสดงกล่องทั้งหมด',
          icon: <RiHome3Line size={20} />
        },
        {
          text: 'sideDashboard',
          path: '/dashboard',
          tag: 'Dashboard, แดชบอร์ด',
          icon: <RiDashboardLine size={20} />
        },
        {
          text: 'sidePermission',
          path: '/users',
          tag: 'Manage Users, จัดการผู้ใช้',
          icon: <RiUser6Line size={20} />
        },
        {
          text: 'sideManage',
          path: '/management',
          tag: 'Manage, จัดการ',
          icon: <RiListSettingsLine size={20} />
        },
        {
          text: 'sideRepair',
          path: '/repair',
          tag: 'Repairs, แจ้งซ่อม',
          icon: <RiFileSettingsLine size={20} />
        },
        {
          text: 'sideWarranty',
          path: '/warranty',
          tag: 'Warranties, การรับประกัน',
          icon: <RiShieldCheckLine size={20} />
        },
        {
          text: 'sideSetting',
          path: '/settings',
          tag: 'Settings, การตั้งค่า',
          icon: <RiSettings3Line size={20} />
        }
      ]
    case 'ADMIN':
      return tmsMode
        ? [
            {
              text: 'sideShowAllBox',
              path: '/',
              tag: 'Show all Devices, แสดงกล่องทั้งหมด',
              icon: <RiHome3Line size={20} />
            },
            {
              text: 'sideDashboard',
              path: '/dashboard',
              tag: 'Dashboard, แดชบอร์ด',
              icon: <RiDashboardLine size={20} />
            },
            {
              text: 'sidePermission',
              path: '/users',
              tag: 'Manage Users, จัดการผู้ใช้',
              icon: <RiUser6Line size={20} />
            }
          ]
        : [
            {
              text: 'sideShowAllBox',
              path: '/',
              tag: 'Show all Devices, แสดงกล่องทั้งหมด',
              icon: <RiHome3Line size={20} />
            },
            {
              text: 'sideDashboard',
              path: '/dashboard',
              tag: 'Dashboard, แดชบอร์ด',
              icon: <RiDashboardLine size={20} />
            },
            {
              text: 'sidePermission',
              path: '/users',
              tag: 'Manage Users, จัดการผู้ใช้',
              icon: <RiUser6Line size={20} />
            },
            {
              text: 'sideManage',
              path: '/management',
              tag: 'Manage, จัดการ',
              icon: <RiListSettingsLine size={20} />
            },
            {
              text: 'sideRepair',
              path: '/repair',
              tag: 'Repairs, แจ้งซ่อม',
              icon: <RiFileSettingsLine size={20} />
            },
            {
              text: 'sideWarranty',
              path: '/warranty',
              tag: 'Warranties, การรับประกัน',
              icon: <RiShieldCheckLine size={20} />
            },
            {
              text: 'sideSetting',
              path: '/settings',
              tag: 'Settings, การตั้งค่า',
              icon: <RiSettings3Line size={20} />
            }
          ]
    case 'USER':
      return [
        {
          text: 'sideShowAllBox',
          path: '/',
          tag: 'Show all Devices, แสดงกล่องทั้งหมด',
          icon: <RiHome3Line size={20} />
        },
        {
          text: 'sideDashboard',
          path: '/dashboard',
          tag: 'Dashboard, แดชบอร์ด',
          icon: <RiDashboardLine size={20} />
        },
        {
          text: 'sideRepair',
          path: '/repair',
          tag: 'Repairs, แจ้งซ่อม',
          icon: <RiFileSettingsLine size={20} />
        },
        {
          text: 'sideWarranty',
          path: '/warranty',
          tag: 'Warranties, การรับประกัน',
          icon: <RiShieldCheckLine size={20} />
        },
        {
          text: 'sideSetting',
          path: '/settings',
          tag: 'Settings, การตั้งค่า',
          icon: <RiSettings3Line size={20} />
        }
      ]
    case 'LEGACY_ADMIN':
      return [
        {
          text: 'sideShowAllBox',
          path: '/',
          tag: 'Show all Devices, แสดงกล่องทั้งหมด',
          icon: <RiHome3Line size={20} />
        },
        {
          text: 'sideDashboard',
          path: '/dashboard',
          tag: 'Dashboard, แดชบอร์ด',
          icon: <RiDashboardLine size={20} />
        },
        {
          text: 'sidePermission',
          path: '/users',
          tag: 'Manage Users, จัดการผู้ใช้',
          icon: <RiUser6Line size={20} />
        },
        ...(tmsMode
          ? [
              {
                text: 'sideManage',
                path: '/management',
                tag: 'Manage, จัดการ',
                icon: <RiListSettingsLine size={20} />
              },
              {
                text: 'sideRepair',
                path: '/repair',
                tag: 'Repairs, แจ้งซ่อม',
                icon: <RiFileSettingsLine size={20} />
              },
              {
                text: 'sideWarranty',
                path: '/warranty',
                tag: 'Warranties, การรับประกัน',
                icon: <RiShieldCheckLine size={20} />
              },
              {
                text: 'sideSetting',
                path: '/settings',
                tag: 'Settings, การตั้งค่า',
                icon: <RiSettings3Line size={20} />
              }
            ]
          : [])
      ]
    case 'LEGACY_USER':
      return [
        {
          text: 'sideShowAllBox',
          path: '/',
          tag: 'Show all Devices, แสดงกล่องทั้งหมด',
          icon: <RiHome3Line size={20} />
        },
        {
          text: 'sideDashboard',
          path: '/dashboard',
          tag: 'Dashboard, แดชบอร์ด',
          icon: <RiDashboardLine size={20} />
        },
        {
          text: 'sideSetting',
          path: '/settings',
          tag: 'Settings, การตั้งค่า',
          icon: <RiSettings3Line size={20} />
        }
      ]
    default:
      return [
        {
          text: 'sideShowAllBox',
          path: '/',
          tag: 'Show all Devices, แสดงกล่องทั้งหมด',
          icon: <RiHome3Line size={20} />
        },
        {
          text: 'sideDashboard',
          path: '/dashboard',
          tag: 'Dashboard, แดชบอร์ด',
          icon: <RiDashboardLine size={20} />
        },
        {
          text: 'sidePermission',
          path: '/users',
          tag: 'Manage Users, จัดการผู้ใช้',
          icon: <RiUser6Line size={20} />
        },
        {
          text: 'sideManage',
          path: '/management',
          tag: 'Manage, จัดการ',
          icon: <RiListSettingsLine size={20} />
        },
        {
          text: 'sideRepair',
          path: '/repair',
          tag: 'Repairs, แจ้งซ่อม',
          icon: <RiFileSettingsLine size={20} />
        },
        {
          text: 'sideWarranty',
          path: '/warranty',
          tag: 'Warranties, การรับประกัน',
          icon: <RiShieldCheckLine size={20} />
        },
        {
          text: 'sideSetting',
          path: '/settings',
          tag: 'Settings, การตั้งค่า',
          icon: <RiSettings3Line size={20} />
        }
      ]
  }
}

export { menuDataArraySmtrack }
