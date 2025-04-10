import { UserRole } from '../../global/users/usersType'

type UsersType = {
  display: string
  id: string
  pic: string
  role: string
  status: boolean
  username: string
  ward: {
    hosId: string
    id: string
    wardName: string
  }
}

type FormState = {
  id?: string
  username: string
  password?: string
  display: string
  role: UserRole | undefined
  status: boolean
  wardId: string
  imageFile: File | null
  imagePreview: string | null
}

type FormAddHospitalState = {
  id?: string
  hosAddress?: string
  hosLatitude?: string
  hosLongitude?: string
  hosName: string
  hosPic: File | null
  hosTel?: string
  userContact?: string
  userTel?: string
  imagePreview?: string | null
}

type FormAddWardType = {
  id?: string
  wardName: string,
  hosId: string
  type: string
}

export type { UsersType, FormState, FormAddHospitalState, FormAddWardType }
