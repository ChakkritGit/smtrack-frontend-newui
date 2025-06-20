type WarrantiesType = {
  createAt: string
  customerAddress: string
  customerName: string
  devName: string
  device: {
    id: string
    location: string
    name:string
    position: string
    probe: [
      {
        name: string
      }
    ]
  }
  expire: string
  id: string
  installDate: string
  invoice: string
  model: string
  product: string
  saleDepartment: string
  status: boolean
  comment: string
  updateAt: string
}

export type { WarrantiesType }
