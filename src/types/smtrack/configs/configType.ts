type ConfigType = {
  createAt: string
  dhcp: boolean
  dhcpEth: boolean
  dns?: string
  dnsEth?: string
  email1?: string
  email2?: string
  email3?: string
  gateway?: string
  gatewayEth?: string
  hardReset: string
  id: string
  ip?: string
  ipEth?: string
  mac?: string
  macEth?: string
  password: string
  simSP?: string
  sn: string
  ssid: string
  subnet?: string
  subnetEth?: string
  updateAt: string
}

export type { ConfigType }
