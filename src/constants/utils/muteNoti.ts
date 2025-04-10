import { UserRole } from "../../types/global/users/usersType"

const generateOptionsOne = (userLevel: UserRole | undefined) => {
  let option = []
  for (let i = 5; i <= 120; i += 5) {
    option.push({
      value: String(i),
      label: String(i)
    })
  }
  if (userLevel === 'SUPER' || userLevel === 'SERVICE') {
    option.push({
      value: 'off',
      label: 'OFF'
    })
  }
  return option
}

const generateOptionsTwo = () => {
  let option = []
  for (let i = 5; i <= 30; i += 5) {
    option.push({
      value: String(i),
      label: String(i)
    })
  }
  return option
}


const generateOptions = (role: UserRole | undefined) => {
  let option = []
  for (let i = 5; i <= 120; i += 5) {
    option.push({
      value: String(i),
      label: String(i)
    })
  }
  if (role === 'SUPER' || role === 'SERVICE') {
    option.push({
      value: 'off',
      label: 'OFF'
    })
  }
  return option
}

export { generateOptionsOne, generateOptionsTwo, generateOptions }
