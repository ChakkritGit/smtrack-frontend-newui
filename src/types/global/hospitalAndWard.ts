interface Hospital {
  id: string
  hosName: string
}

interface Ward {
  id: string
  wardName: string
}

interface Role {
  key: string
  value: string
}

interface Status {
  key: string
  value: string
}

type Option = {
  value: string
  label: string
}

export type { Hospital, Ward, Option, Role, Status }
