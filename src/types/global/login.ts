import { UserRole } from "./users/usersType"

type LoginType = {
  token: string
  refreshToken: string
  id: string
  name: string
  hosId: string
  wardId: string
  role: UserRole
  pic: string
}

export type { LoginType }
