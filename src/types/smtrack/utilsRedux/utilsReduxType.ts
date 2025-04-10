import { UserRole } from "../../global/users/usersType"

type responseType<T> = {
  message: string,
  success: boolean,
  data: T
}

type TokenType = {
  id: string;
  role: UserRole;
  hosId: string;
  wardId: string;
  iat: number;
  exp: number;
}

type UserProfileType = {
  display?: string,
  id: string,
  pic: string,
  role: UserRole,
  status: boolean,
  username: string,
  ward: {
    hospital: {
      hosName: string,
      hosPic?: string,
      id: string
    },
    id: string,
    wardName: string
  }
}

export type { responseType, TokenType, UserProfileType }