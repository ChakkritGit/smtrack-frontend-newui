import { useTranslation } from 'react-i18next'
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers/rootReducer'
import { AxiosError } from 'axios'
import {
  DeviceType,
  FirmwareListType
} from '../../../types/smtrack/devices/deviceType'
import axiosInstance from '../../../constants/axios/axiosInstance'
import {
  RiDeleteBin7Line,
  RiEditLine,
  RiFileCopyLine,
  RiSettings4Line,
  RiShutDownLine,
  RiSignalWifi2Fill,
  RiSignalWifi2Line,
  RiSimCard2Fill,
  RiSimCard2Line,
  RiTimeLine
} from 'react-icons/ri'
import { IoSwapVertical } from 'react-icons/io5'
import {
  setSholdFetch,
  setSubmitLoading,
  setTokenExpire
} from '../../../redux/actions/utilsActions'
import toast from 'react-hot-toast'
import { socket } from '../../../services/websocket'
import {
  AddDeviceForm,
  NetworkFormInit
} from '../../../types/tms/devices/deviceType'
import { responseType } from '../../../types/smtrack/utilsRedux/utilsReduxType'
import {
  delay,
  hoursOptions,
  minutesOptions,
  swalMoveDevice
} from '../../../constants/utils/utilsConstants'
import { isSafeImageUrl, resizeImage } from '../../../constants/utils/image'
import Swal from 'sweetalert2'
import defaultPic from '../../../assets/images/default-pic.png'
import WardSelectDevice from '../../../components/selects/wardSelectDevice'
import HopitalSelect from '../../../components/selects/hopitalSelect'
import HospitalAndWard from '../../../components/filter/hospitalAndWard'
import Loading from '../../../components/skeleton/table/loading'
import DataTableNoData from '../../../components/skeleton/table/noData'
import { ConfigType } from '../../../types/smtrack/configs/configType'
import { client } from '../../../services/mqtt'
import Select from 'react-select'
import { Option } from '../../../types/global/hospitalAndWard'
import { TbTransfer } from 'react-icons/tb'
import { GlobalContextType } from '../../../types/global/globalContext'
import { GlobalContext } from '../../../contexts/globalContext'
import { DeviceResponseType } from '../../../types/global/deviceResponseType'
import DeviceListWithSetState from '../../../components/filter/deviceListState'
import { CgEthernet } from 'react-icons/cg'
import { BsEthernet } from 'react-icons/bs'

type selectOption = {
  value: string
  label: string
}

type selectFirmwareOption = {
  fileName: string
  filePath: string
  fileSize: string
  createDate: string
}

const ManageDevice = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const {
    wardId,
    globalSearch,
    tokenDecode,
    hosId,
    shouldFetch,
    loadingStyle
  } = useSelector((state: RootState) => state.utils)
  const { searchRef, isFocused, setIsFocused, isCleared, setIsCleared } =
    useContext(GlobalContext) as GlobalContextType
  const [devices, setDevices] = useState<DeviceType[]>([])
  const [firmwareList, setFirmwareList] = useState<FirmwareListType[]>([])
  const [selectedFirmware, setSelectedFirmware] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentTab, setCurrentTab] = useState(1)
  const [imageProcessing, setImageProcessing] = useState(false)
  const [onNetwork, setOnNetwork] = useState(false)
  const [moveDevice, setMoveDevice] = useState({
    id: '',
    name: ''
  })
  const [deviceId, setDeviceId] = useState('')
  const addModalRef = useRef<HTMLDialogElement>(null)
  const editModalRef = useRef<HTMLDialogElement>(null)
  const moveModalRef = useRef<HTMLDialogElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { role } = tokenDecode || {}
  const [formData, setFormData] = useState<AddDeviceForm>({
    id: '',
    name: '',
    hospital: '',
    hospitalName: '',
    ward: '',
    wardName: '',
    location: '',
    position: '',
    remark: '',
    tag: '',
    image: null,
    imagePreview: null,
    config: null
  })
  const [networkObject, setNetworkObject] = useState({
    selectWifi: true,
    selectLan: true
  })
  const [networkForm, setNetworkForm] = useState<NetworkFormInit>({
    wifi: {
      ssid: '',
      password: '',
      macAddress: '',
      ip: '',
      subnet: '',
      gateway: '',
      dns: ''
    },
    lan: {
      ip: '',
      subnet: '',
      gateway: '',
      dns: ''
    },
    sim: {
      simSp: ''
    }
  })
  const deviceModel =
    formData?.id?.substring(0, 3) === 'eTP' ? 'etemp' : 'items'
  const version = formData?.id?.substring(3, 5).toLowerCase()
  const [hardReset, setHardReset] = useState({
    hour: '',
    minute: ''
  })
  const [hosIdforManageDev, setHosIdforManageDev] = useState<string>('')

  const fetchFirmware = useCallback(async () => {
    try {
      const response = await axiosInstance.get<
        responseType<FirmwareListType[]>
      >('https://drive.siamatic.co.th/api/drive')

      const versionCompare = (
        a: selectFirmwareOption,
        b: selectFirmwareOption
      ) => {
        const versionA = a.fileName.match(/(\d+)\.(\d+)\.(\d+)/)
        const versionB = b.fileName.match(/(\d+)\.(\d+)\.(\d+)/)

        if (a.fileName.startsWith('i-TeM') && !b.fileName.startsWith('i-TeM'))
          return 1
        if (b.fileName.startsWith('i-TeM') && !a.fileName.startsWith('i-TeM'))
          return -1

        if (versionA && versionB) {
          const majorA = parseInt(versionA[1], 10)
          const minorA = parseInt(versionA[2], 10)
          const patchA = parseInt(versionA[3], 10)

          const majorB = parseInt(versionB[1], 10)
          const minorB = parseInt(versionB[2], 10)
          const patchB = parseInt(versionB[3], 10)

          return majorA - majorB || minorA - minorB || patchA - patchB
        }
        return 0
      }

      const combinedList = response.data.data
        .filter(
          filter =>
            !filter.fileName.startsWith('bootloader') &&
            !filter.fileName.startsWith('partition')
        )
        .sort(versionCompare)

      setFirmwareList(combinedList)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true))
        }
        console.error(error.message)
      } else {
        console.error(error)
      }
    }
  }, [])

  const fetchDevices = useCallback(
    async (page: number, size = perPage, search?: string) => {
      try {
        setLoading(true)
        const response = await axiosInstance.get<
          responseType<DeviceResponseType>
        >(
          `/devices/device?${
            wardId ? `ward=${wardId}&` : hosId ? `ward=${hosId}&` : ''
          }page=${page}&perpage=${size}${search ? `&filter=${search}` : ''}`
        )
        setDevices(response.data.data?.devices)
        setTotalRows(response.data.data?.total)
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            dispatch(setTokenExpire(true))
          }
          console.error(error.message)
        } else {
          console.error(error)
        }
      } finally {
        setLoading(false)
      }
    },
    [perPage, wardId, hosId]
  )

  const handlePageChange = (page: number) => {
    fetchDevices(page)
    setCurrentPage(page)
  }

  const handlePerRowsChange = async (newPerPage: number, page: number) => {
    setPerPage(newPerPage)
    fetchDevices(page, newPerPage)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    if (formData.id !== '' && formData.name !== '') {
      const body = {
        id: formData.id,
        name: formData.name
      }
      try {
        await axiosInstance.post<responseType<DeviceType>>(
          '/devices/device',
          body
        )
        addModalRef.current?.close()
        resetForm()
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: t('submitSuccess'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2500
        }).finally(async () => {
          await fetchDevices(currentPage, perPage)
        })
      } catch (error) {
        addModalRef.current?.close()
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            dispatch(setTokenExpire(true))
          }
          Swal.fire({
            title: t('alertHeaderError'),
            text: error.response?.data.message,
            icon: 'error',
            showConfirmButton: false,
            timer: 2500
          }).finally(() => addModalRef.current?.showModal())
        } else {
          console.error(error)
        }
      } finally {
        dispatch(setSubmitLoading())
      }
    } else {
      addModalRef.current?.close()
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: 'warning',
        showConfirmButton: false,
        timer: 2500
      }).finally(() => addModalRef.current?.showModal())
      dispatch(setSubmitLoading())
    }
  }

  const createFormData = () => {
    const formDataObj = new FormData()

    Object.entries(formData).forEach(([key, value]) => {
      if (value === null || value === undefined || key === 'imagePreview')
        return

      if (value instanceof File) {
        formDataObj.append(key, value)
      } else {
        if (key === 'remark' || key === 'tag') {
          formDataObj.append(key, value as string)
        } else if (key === 'hospital') {
          formDataObj.append(key, hosIdforManageDev)
        } else if (key === 'config') {
          return
        } else {
          formDataObj.append(key, value as string)
        }
      }
    })

    return formDataObj
  }

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())
    if (formData.name && formData.location && formData.position) {
      try {
        const formDataObj = createFormData()
        formDataObj.delete('id')
        await axiosInstance.put<responseType<DeviceType>>(
          `/devices/device/${formData.id}`,
          formDataObj,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        )
        editModalRef.current?.close()
        resetForm()
        await fetchDevices(currentPage, perPage)
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: t('submitSuccess'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2500
        }).finally(async () => {
          await delay(3000)
          client.publish(
            `siamatic/${deviceModel}/${version}/${formData.id}/adj`,
            'on'
          )
        })
      } catch (error) {
        editModalRef.current?.close()
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            dispatch(setTokenExpire(true))
          }
          Swal.fire({
            title: t('alertHeaderError'),
            text: error.response?.data.message,
            icon: 'error',
            showConfirmButton: false,
            timer: 2500
          }).finally(() => editModalRef.current?.showModal())
        } else {
          console.error(error)
        }
      } finally {
        dispatch(setSubmitLoading())
      }
    } else {
      editModalRef.current?.close()
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: 'warning',
        showConfirmButton: false,
        timer: 2500
      }).finally(() => editModalRef.current?.showModal())
      dispatch(setSubmitLoading())
    }
  }

  const hardResetFun = async () => {
    dispatch(setSubmitLoading())

    try {
      await axiosInstance.put<responseType<DeviceType>>(
        `/devices/configs/${formData.id}`,
        {
          hardReset: `${hardReset.hour}${hardReset.minute}`
        }
      )
      editModalRef.current?.close()
      resetForm()
      await fetchDevices(1)
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: t('submitSuccess'),
        icon: 'success',
        showConfirmButton: false,
        timer: 2500
      })
    } catch (error) {
      editModalRef.current?.close()
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true))
        }
        Swal.fire({
          title: t('alertHeaderError'),
          text: error.response?.data.message,
          icon: 'error',
          showConfirmButton: false,
          timer: 2500
        }).finally(() => editModalRef.current?.showModal())
      } else {
        console.error(error)
      }
    } finally {
      dispatch(setSubmitLoading())
    }
  }

  const formatId = (value: string) => {
    value = value.replace(/[^a-zA-Z0-9]/g, '')

    const part1 = value.slice(0, 5)
    const part2 = value.slice(5, 7)
    const part3 = value.slice(7, 12)
    const part4 = value.slice(12, 16)
    const part5 = value.slice(16, 19)

    let formatted = ''
    if (part1) formatted += part1
    if (part2) formatted += `-${part2}`
    if (part3) formatted += `-${part3}`
    if (part4) formatted += `-${part4}`
    if (part5) formatted += `-${part5}`

    return formatted
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'id') {
      const formattedValue = formatId(value)
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        editModalRef.current?.close()
        Swal.fire({
          title: t('alertHeaderWarning'),
          text: t('imageSizeLimit'),
          icon: 'warning',
          showConfirmButton: false,
          timer: 2500
        }).finally(() => {
          editModalRef.current?.showModal()
          setFormData({
            ...formData,
            image: null
          })
          if (fileInputRef.current) fileInputRef.current.value = ''
        })
        return
      }

      setImageProcessing(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      const reSized = await resizeImage(file)
      setFormData(prev => ({
        ...prev,
        image: reSized,
        imagePreview: URL.createObjectURL(file)
      }))
      setImageProcessing(false)
    }
  }

  const handleFileDrop: React.DragEventHandler<HTMLLabelElement> = async e => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      await processImage(file)
    }
  }

  const processImage = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      addModalRef.current?.close()
      editModalRef.current?.close()
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('imageSizeLimit'),
        icon: 'warning',
        showConfirmButton: false,
        timer: 2500
      }).finally(() => {
        if (addModalRef.current?.open) {
          addModalRef.current?.showModal()
        } else {
          editModalRef.current?.showModal()
        }
        setFormData(prev => ({
          ...prev,
          imageFile: null
        }))
        if (fileInputRef.current) fileInputRef.current.value = ''
      })
      return
    }

    setImageProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    const reSized = await resizeImage(file)
    setFormData(prev => ({
      ...prev,
      imageFile: reSized,
      imagePreview: URL.createObjectURL(file)
    }))
    setImageProcessing(false)
  }

  const resetForm = () => {
    setHosIdforManageDev('')
    setFormData({
      id: '',
      name: '',
      hospital: '',
      ward: '',
      location: '',
      position: '',
      image: null,
      remark: '',
      tag: ''
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const openEditModal = (device: DeviceType) => {
    fetchFirmware()
    setHosIdforManageDev(device.hospital)
    setFormData({
      id: device.id,
      name: device.name,
      hospital: device.hospital,
      hospitalName: device.hospitalName,
      ward: device.ward,
      wardName: device.wardName,
      location: device.location,
      position: device.position,
      remark: device.remark,
      tag: device.tag,
      image: null,
      imagePreview: device.positionPic || null,
      config: device.config
    })
    setHardReset({
      ...hardReset,
      hour: device?.config?.hardReset?.substring(0, 2),
      minute: device?.config?.hardReset?.substring(2, 4)
    })
    editModalRef.current?.showModal()
  }

  const deactiveDevices = async (id: string, status: boolean) => {
    dispatch(setSubmitLoading())
    try {
      const response = await axiosInstance.put<responseType<DeviceType>>(
        `/devices/device/${id}`,
        { status }
      )
      await fetchDevices(currentPage, perPage)
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: response.data.message,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true))
        }
        Swal.fire({
          title: t('alertHeaderError'),
          text: error.response?.data.message,
          icon: 'error',
          timer: 2000,
          showConfirmButton: false
        })
      } else {
        Swal.fire({
          title: t('alertHeaderError'),
          text: 'Uknown Error',
          icon: 'error',
          timer: 2000,
          showConfirmButton: false
        })
      }
    } finally {
      dispatch(setSubmitLoading())
    }
  }

  const deleteDevices = async (id: string) => {
    dispatch(setSubmitLoading())
    try {
      const response = await axiosInstance.delete<responseType<DeviceType>>(
        `/devices/device/${id}`
      )
      await fetchDevices(currentPage, perPage)
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: response.data.message,
        icon: 'success',
        showConfirmButton: false,
        timer: 2500
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true))
        }
        Swal.fire({
          title: t('alertHeaderError'),
          text: error.response?.data.message,
          icon: 'error',
          showConfirmButton: false,
          timer: 2500
        })
      } else {
        console.error(error)
      }
    } finally {
      dispatch(setSubmitLoading())
    }
  }

  const handleWifi = async (e: FormEvent) => {
    e.preventDefault()
    let body = null
    if (networkObject.selectWifi) {
      body = {
        dhcp: true,
        ssid: networkForm?.wifi?.ssid,
        password: networkForm?.wifi?.password
          ? networkForm?.wifi?.password
          : '',
        ip: '',
        subnet: '',
        gateway: '',
        dns: '',
        mac: ''
      }
    } else {
      body = {
        dhcp: false,
        ssid: networkForm?.wifi?.ssid,
        password: networkForm?.wifi?.password
          ? networkForm?.wifi?.password
          : '',
        ip: networkForm?.wifi?.ip,
        subnet: networkForm?.wifi?.subnet,
        gateway: networkForm?.wifi?.gateway,
        dns: networkForm?.wifi?.dns,
        mac: networkForm?.wifi?.macAddress
      }
    }

    try {
      await axiosInstance.put<responseType<DeviceType>>(
        `/devices/configs/${formData.id}`,
        body
      )
      editModalRef.current?.close()
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: t('submitSuccess'),
        icon: 'success',
        showConfirmButton: false,
        timer: 2500
      }).finally(async () => {
        await fetchDevices(1)
        setOnNetwork(false)
        setCurrentTab(1)
        await delay(3000)

        client.publish(
          `siamatic/${deviceModel}/${version}/${formData.id}/adj`,
          'on'
        )
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        editModalRef.current?.close()
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true))
        }
        Swal.fire({
          title: t('alertHeaderError'),
          text: error.response?.data.message,
          icon: 'error',
          showConfirmButton: false,
          timer: 2500
        }).finally(() => editModalRef.current?.showModal())
      }
      console.error(error)
    }
  }

  const handleLan = async (e: FormEvent) => {
    e.preventDefault()
    let body = null
    if (networkObject.selectLan) {
      body = {
        dhcpEth: true,
        ip: '',
        subnet: '',
        gateway: '',
        dns: ''
      }
    } else {
      body = {
        dhcpEth: false,
        ip: networkForm?.lan?.ip,
        subnet: networkForm?.lan?.subnet,
        gateway: networkForm?.lan?.gateway,
        dns: networkForm?.lan?.dns
      }
    }

    try {
      await axiosInstance.put<responseType<DeviceType>>(
        `/devices/configs/${formData.id}`,
        body
      )
      editModalRef.current?.close()
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: t('submitSuccess'),
        icon: 'success',
        showConfirmButton: false,
        timer: 2500
      }).finally(async () => {
        await fetchDevices(1)
        setOnNetwork(false)
        setCurrentTab(1)

        await delay(3000)
        client.publish(
          `siamatic/${deviceModel}/${version}/${formData.id}/adj`,
          'on'
        )
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        editModalRef.current?.close()
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true))
        }
        Swal.fire({
          title: t('alertHeaderError'),
          text: error.response?.data.message,
          icon: 'error',
          showConfirmButton: false,
          timer: 2500
        }).finally(() => editModalRef.current?.showModal())
      }
      console.error(error)
    }
  }

  const handleSim = async (e: FormEvent) => {
    e.preventDefault()
    let body = {
      simSP: networkForm?.sim?.simSp
    }

    try {
      await axiosInstance.put<responseType<DeviceType>>(
        `/devices/configs/${formData.id}`,
        body
      )
      editModalRef.current?.close()
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: t('submitSuccess'),
        icon: 'success',
        showConfirmButton: false,
        timer: 2500
      }).finally(async () => {
        await fetchDevices(1)
        setOnNetwork(false)
        setCurrentTab(1)

        await delay(3000)
        client.publish(
          `siamatic/${deviceModel}/${version}/${formData.id}/adj`,
          'on'
        )
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        editModalRef.current?.close()
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true))
        }
        Swal.fire({
          title: t('alertHeaderError'),
          text: error.response?.data.message,
          icon: 'error',
          showConfirmButton: false,
          timer: 2500
        }).finally(() => editModalRef.current?.showModal())
      }
      console.error(error)
    }
  }

  const openEdit = (config: ConfigType | null | undefined) => {
    setNetworkObject({
      selectWifi: config?.dhcp ?? true,
      selectLan: config?.dhcpEth ?? true
    })
    setNetworkForm({
      wifi: {
        ssid: config?.ssid,
        password: config?.password,
        macAddress: config?.mac,
        ip: config?.ip,
        subnet: config?.subnet,
        gateway: config?.gateway,
        dns: config?.dns
      },
      lan: {
        ip: config?.ipEth,
        subnet: config?.subnetEth,
        gateway: config?.gatewayEth,
        dns: config?.dnsEth
      },
      sim: {
        simSp: config?.simSP
      }
    })
    setOnNetwork(true)
  }

  const handleMoveDevice = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    if (deviceId !== '') {
      try {
        await axiosInstance.patch<responseType<DeviceType>>(
          `/devices/device/${moveDevice.id}`,
          {
            id: deviceId
          }
        )
        moveModalRef.current?.close()
        resetForm()
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: t('submitSuccess'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2500
        }).finally(async () => {
          await fetchDevices(currentPage, perPage)
        })
      } catch (error) {
        moveModalRef.current?.close()
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            dispatch(setTokenExpire(true))
          }
          Swal.fire({
            title: t('alertHeaderError'),
            text: error.response?.data.message,
            icon: 'error',
            showConfirmButton: false,
            timer: 2500
          }).finally(() => moveModalRef.current?.showModal())
        } else {
          console.error(error)
        }
      } finally {
        dispatch(setSubmitLoading())
        setDeviceId('')
        setMoveDevice({
          id: '',
          name: ''
        })
      }
    } else {
      moveModalRef.current?.close()
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: 'warning',
        showConfirmButton: false,
        timer: 2500
      }).finally(() => moveModalRef.current?.showModal())
      dispatch(setSubmitLoading())
    }
  }

  const handleUpdateFirmware = async () => {
    if (selectedFirmware !== '' && formData?.id !== '') {
      if (deviceModel === 'etemp') {
        client.publish(
          `siamatic/${deviceModel}/${version}/${formData?.id}/firmware`,
          selectedFirmware
        )
      } else {
        client.publish(
          `siamatic/${deviceModel}/${version}/${formData?.id}/firmware`,
          selectedFirmware
        )
      }
      editModalRef.current?.close()
      setSelectedFirmware('')
      await fetchDevices(currentPage, perPage)
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: t('sendFm'),
        icon: 'success',
        showConfirmButton: false,
        timer: 2500
      }).finally(() => {
        setSelectedFirmware('')
        editModalRef.current?.showModal()
      })
    } else {
      editModalRef.current?.close()
      Swal.fire({
        title: t('alertHeaderError'),
        text: t('descriptionErrorWrong'),
        icon: 'error',
        showConfirmButton: false,
        timer: 2500
      }).finally(() => {
        setSelectedFirmware('')
        editModalRef.current?.showModal()
      })
    }
  }

  useEffect(() => {
    fetchDevices(1)
  }, [hosId])

  useEffect(() => {
    fetchDevices(1)
  }, [wardId, hosId])

  const shouldFetchFunc = async () => {
    await fetchDevices(1, 10, globalSearch)
    dispatch(setSholdFetch())
  }

  useEffect(() => {
    if (globalSearch === '') return
    if (shouldFetch) {
      shouldFetchFunc()
    }
  }, [shouldFetch, globalSearch])

  const columns: TableColumn<DeviceType>[] = [
    {
      name: t('deviceSerialTb'),
      cell: item => (
        <>
          {role === 'SUPER' ? (
            <div
              className='flex items-center gap-1 cursor-pointer hover:opacity-50 duration-300 ease-linear'
              onClick={() => {
                try {
                  navigator.clipboard.writeText(item.id)
                  toast.success(t('copyToClip'))
                } catch (error) {
                  console.error('Failed to copy: ', error)
                  toast.error(t('copyToClipFaile'))
                }
              }}
            >
              <span>{item.id}</span>
              <RiFileCopyLine size={18} className='text-base-content/70' />
            </div>
          ) : (
            <span>{item.id}</span>
          )}
        </>
      ),
      sortable: false,
      center: true,
      width: '225px'
    },
    {
      name: t('deviceNameBox'),
      cell: item => (
        <div className='tooltip w-[130px]' data-tip={item.name ?? '—'}>
          <div className='truncate max-w-[120px]'>
            <span
              className='max-w-[80px] block truncate text-left'
              style={{ direction: 'rtl' }}
            >
              {item.name ? item.name : '—'}
            </span>
          </div>
        </div>
      ),
      sortable: false,
      center: true,
      width: '130px'
    },
    {
      name: t('deviceLocationTb'),
      cell: item => (
        <div className='tooltip w-[140px]' data-tip={item.location ?? '—'}>
          <div className='truncate max-w-[130px]'>
            <span>{item.location ?? '—'}</span>
          </div>
        </div>
      ),
      sortable: false,
      center: true,
      width: '140px'
    },
    {
      name: t('hospitals'),
      cell: item => (
        <div className='tooltip w-[145px]' data-tip={item.hospitalName ?? '—'}>
          <div className='truncate max-w-[130px]'>
            <span>{item.hospitalName ?? '—'}</span>
          </div>
        </div>
      ),
      sortable: false,
      center: true,
      width: '145px'
    },
    {
      name: t('ward'),
      cell: item => (
        <div className='tooltip w-[140px]' data-tip={item.wardName ?? '—'}>
          <div className='truncate max-w-[130px]'>
            <span>{item.wardName ?? '—'}</span>
          </div>
        </div>
      ),
      sortable: false,
      center: true,
      width: '140px'
    },
    {
      name: t('firmWareVer'),
      selector: item => (item.firmware ? item.firmware : '—'),
      sortable: false,
      center: true,
      width: '100px'
    },
    {
      name: t('status'),
      cell: item => {
        if (!item.status) {
          return (
            <span className='badge bg-red-500 border-none px-2 badge-outline text-white'>
              {t('userInactive')}
            </span>
          )
        } else {
          return (
            <span className='badge bg-green-500 border-none px-2 badge-outline text-white'>
              {t('userActive')}
            </span>
          )
        }
      },
      sortable: false,
      center: true
    },
    ...(role === 'SUPER'
      ? [
          {
            name: t('token'),
            cell: (item: DeviceType) => (
              <div
                className='flex items-center gap-1 cursor-pointer hover:opacity-50 duration-300 ease-linear'
                onClick={() => {
                  try {
                    navigator.clipboard.writeText(item.token)
                    toast.success(t('copyToClip'))
                  } catch (error) {
                    console.error('Failed to copy: ', error)
                    toast.error(t('copyToClipFaile'))
                  }
                }}
              >
                <span className='truncate max-w-[80px]'>
                  {item.token ?? '—'}
                </span>
                {item.token && (
                  <RiFileCopyLine size={18} className='text-base-content/70' />
                )}
              </div>
            ),
            sortable: false,
            center: true,
            width: '125px'
          }
        ]
      : []),
    {
      name: t('lastModified'),
      cell: (item: DeviceType) => (
        <div className='flex items-center gap-2'>
          <span>
            {new Date(item.updateAt).toLocaleString('th-TH', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
              timeZone: 'UTC'
            })}
          </span>
          <span>
            {new Date(item.updateAt).toLocaleString('th-TH', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'UTC'
            })}
          </span>
        </div>
      ),
      sortable: false,
      center: true,
      width: '150px'
    },
    {
      name: t('action'),
      cell: item => (
        <div className='flex items-center justify-center gap-3 p-3'>
          {role === 'SUPER' && (
            <>
              <button
                data-tip={t('moveDevice')}
                className='btn btn-primary tooltip tooltip-left flex text-primary-content min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0'
                onClick={() => {
                  if (item.status) {
                    swalMoveDevice.fire({
                      title: t('alertHeaderWarning'),
                      text: t('moveDeviceActive'),
                      icon: 'warning',
                      confirmButtonText: t('confirmButton')
                    })
                  } else {
                    setMoveDevice({
                      id: item.id,
                      name: item.name ?? ''
                    })
                    if (moveModalRef.current) {
                      moveModalRef.current.showModal()
                    }
                  }
                }}
              >
                <TbTransfer size={20} />
              </button>
              <div className='divider divider-horizontal mx-0'></div>
            </>
          )}
          {role === 'SUPER' &&
            (item.status ? (
              <button
                data-tip={t('deviceInactive')}
                className='btn btn-ghost tooltip tooltip-left flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-red-500'
                onClick={() =>
                  Swal.fire({
                    title: t('deactivateDevice'),
                    text: t('deactivateDeviceText'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: t('confirmButton'),
                    cancelButtonText: t('cancelButton'),
                    reverseButtons: false,
                    customClass: {
                      actions: 'custom-action',
                      confirmButton: 'custom-confirmButton',
                      cancelButton: 'custom-cancelButton'
                    }
                  }).then(result => {
                    if (result.isConfirmed) {
                      deactiveDevices(item.id, false)
                    }
                  })
                }
              >
                <RiShutDownLine size={20} />
              </button>
            ) : (
              <button
                data-tip={t('deviceActive')}
                className='btn btn-primary tooltip tooltip-left flex text-primary-content min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0'
                onClick={() =>
                  Swal.fire({
                    title: t('activateDevice'),
                    text: t('activateDeviceText'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: t('confirmButton'),
                    cancelButtonText: t('cancelButton'),
                    reverseButtons: false,
                    customClass: {
                      actions: 'custom-action',
                      confirmButton: 'custom-confirmButton',
                      cancelButton: 'custom-cancelButton'
                    }
                  }).then(result => {
                    if (result.isConfirmed) {
                      deactiveDevices(item.id, true)
                    }
                  })
                }
              >
                <RiShutDownLine size={20} />
              </button>
            ))}
          <button
            className='btn btn-ghost flex text-primary-content min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-primary'
            onClick={() => openEditModal(item)}
          >
            <RiEditLine size={20} />
          </button>
          {role === 'SUPER' && (
            <button
              className='btn btn-ghost flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-red-500'
              onClick={() =>
                Swal.fire({
                  title: t('deleteDeviceTitle'),
                  text: t('notReverseText'),
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: t('confirmButton'),
                  cancelButtonText: t('cancelButton'),
                  customClass: {
                    actions: 'custom-action',
                    confirmButton: 'custom-confirmButton',
                    cancelButton: 'custom-cancelButton'
                  },
                  reverseButtons: false
                }).then(result => {
                  if (result.isConfirmed) {
                    deleteDevices(item.id)
                  }
                })
              }
            >
              <RiDeleteBin7Line size={20} />
            </button>
          )}
        </div>
      ),
      sortable: false,
      center: true
    }
  ]

  useEffect(() => {
    const handleCk = (e: KeyboardEvent) => {
      if (
        globalSearch !== '' &&
        e.key?.toLowerCase() === 'enter' &&
        isFocused
      ) {
        e.preventDefault()
        if (isFocused) {
          searchRef.current?.blur()
          setIsFocused(false)
        }
        fetchDevices(currentPage, perPage, globalSearch)
      }
    }

    window.addEventListener('keydown', handleCk)

    if (isCleared) {
      fetchDevices(currentPage, perPage)
      setIsCleared(false)
    }

    return () => {
      window.removeEventListener('keydown', handleCk)
    }
  }, [globalSearch, currentPage, perPage, isCleared, isFocused])

  const mapOptions = <T, K extends keyof T>(
    data: T[],
    valueKey: K,
    labelKey: K
  ): Option[] =>
    data.map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))

  const mapDefaultValue = <T, K extends keyof T>(
    data: T[],
    id: string,
    valueKey: K,
    labelKey: K
  ): Option | undefined =>
    data
      .filter(item => item[valueKey] === id)
      .map(item => ({
        value: item[valueKey] as unknown as string,
        label: item[labelKey] as unknown as string
      }))[0]

  return (
    <div>
      <div className='flex flex-col lg:flex-row lg:items-center justify-between mt-3'>
        <span className='text-[20px] font-medium'></span>
        <div className='flex flex-col lg:flex-row mt-3 lg:mt-0 lg:items-center items-end lg:gap-3'>
          <HospitalAndWard />
          {(role === 'SUPER' || role === 'SERVICE') && (
            <button
              className='btn btn-neutral max-w-[130px]'
              onClick={() => addModalRef.current?.showModal()}
            >
              {t('addDeviceButton')}
            </button>
          )}
          {role === 'SUPER' && (
            <>
              <div className='divider divider-horizontal mx-0 py-1'></div>
              <button
                className='btn flex btn-neutral p-0 w-[48px] h-[48px] min-w-[48px] min-h-[48px] tooltip tooltip-left'
                data-tip={'Sync Device Time'}
                onClick={() => {
                  socket.emit('send_schedule', 'time', (val: string) => {
                    if (val === 'OK') {
                      Swal.fire({
                        title: t('alertHeaderSuccess'),
                        text: val,
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                      })
                    }
                  })

                  socket.on(
                    'exception',
                    (message: { message: string; status: string }) => {
                      if (message.status === 'error') {
                        Swal.fire({
                          title: t('alertHeaderError'),
                          text: message.message,
                          icon: 'error',
                          timer: 2000,
                          showConfirmButton: false
                        })
                      }
                    }
                  )
                }}
              >
                <RiTimeLine size={24} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className='dataTableWrapper bg-base-100 rounded-field p-3 mt-5 duration-300 ease-linear'>
        <DataTable
          responsive
          fixedHeader
          pagination
          paginationServer
          columns={columns}
          data={devices}
          paginationTotalRows={totalRows}
          paginationDefaultPage={currentPage}
          progressPending={loading}
          progressComponent={<Loading />}
          noDataComponent={<DataTableNoData />}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          paginationRowsPerPageOptions={[10, 20, 50, 100, 150, 200]}
          className='md:!max-h-[calc(100dvh-420px)]'
        />
      </div>

      <dialog ref={addModalRef} className='modal overflow-y-scroll py-10'>
        <form
          onSubmit={handleSubmit}
          className='modal-box w-5/6 max-w-2xl h-max max-h-max'
        >
          <h3 className='font-bold text-lg'>{t('addDeviceButton')}</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full'>
            {/* Right Column - 2/3 of the grid (70%) */}
            <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
              {/* sn */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('deviceSerialTb')}
                  </span>
                  <input
                    name='id'
                    type='text'
                    value={formData.id}
                    onChange={handleChange}
                    className='input  w-full'
                    maxLength={23}
                  />
                </label>
              </div>

              {/* name */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('deviceNameTb')}
                  </span>
                  <input
                    name='name'
                    type='text'
                    value={formData.name}
                    onChange={handleChange}
                    className='input  w-full'
                    maxLength={80}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className='modal-action mt-6'>
            <button
              type='button'
              className='btn'
              onClick={() => {
                addModalRef.current?.close()
                resetForm()
              }}
            >
              {t('cancelButton')}
            </button>
            <button type='submit' className='btn btn-neutral'>
              {t('submitButton')}
            </button>
          </div>
        </form>
      </dialog>

      {/* Edit device Modal */}
      <dialog ref={editModalRef} className='modal overflow-y-scroll py-10'>
        <form
          onSubmit={
            !onNetwork
              ? handleUpdate
              : currentTab === 1
              ? handleWifi
              : currentTab === 2
              ? handleLan
              : handleSim
          }
          className='modal-box w-11/12 max-w-5xl h-max max-h-max'
        >
          <h3 className='font-bold text-lg'>{t('editDeviceButton')}</h3>
          {!onNetwork ? (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 w-full'>
              {/* Image Upload - Left Column (30%) */}
              <div className='col-span-1 flex justify-center'>
                <div className='form-control'>
                  <label
                    className='label cursor-pointer image-hover flex flex-col justify-center'
                    onDrop={handleFileDrop}
                    onDragOver={e => e.preventDefault()}
                  >
                    <span className='label-text text-wrap'>
                      {t('userPicture')}
                    </span>
                    <input
                      key={formData.imagePreview}
                      ref={fileInputRef}
                      type='file'
                      accept='image/*'
                      onChange={handleImageChange}
                      className='hidden'
                    />
                    {imageProcessing ? (
                      <div className='mt-4 flex justify-center w-32 h-32 md:w-48 md:h-48'>
                        <span
                          className={`loading ${loadingStyle} loading-md`}
                        ></span>
                      </div>
                    ) : (
                      <div className='mt-4 relative'>
                        <img
                          src={
                            isSafeImageUrl(String(formData.imagePreview))
                              ? String(formData.imagePreview)
                              : defaultPic
                          }
                          alt='Preview'
                          className={`w-32 h-32 md:w-48 md:h-48 rounded-field object-cover border border-dashed border-base-300 ${
                            formData.imagePreview || defaultPic
                              ? 'border-none'
                              : ''
                          }`}
                        />
                        <div className='absolute edit-icon bottom-1 right-1 bg-base-100/50 backdrop-blur rounded-full p-2 shadow-sm'>
                          <RiEditLine size={20} />
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Right Column - Form Fields (70%) */}
              <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
                {/* Hospital */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      <span className='font-medium text-red-500 mr-1'>*</span>
                      {t('hospitalsName')}
                    </span>
                    <HopitalSelect
                      hosIdforManageDev={hosIdforManageDev}
                      formData={formData}
                      setHosIdforManageDev={setHosIdforManageDev}
                      setFormData={setFormData}
                    />
                  </label>
                </div>

                {/* Ward */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      <span className='font-medium text-red-500 mr-1'>*</span>
                      {t('ward')}
                    </span>
                    <WardSelectDevice
                      hosIdforManageDev={hosIdforManageDev}
                      formData={formData}
                      setFormData={setFormData}
                    />
                  </label>
                </div>

                {/* name */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      <span className='font-medium text-red-500 mr-1'>*</span>
                      {t('deviceNameTb')}
                    </span>
                    <input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      className='input  w-full'
                      maxLength={50}
                    />
                  </label>
                </div>

                {/* location */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      <span className='font-medium text-red-500 mr-1'>*</span>
                      {t('deviceLocationTb')}
                    </span>
                    <input
                      type='text'
                      name='location'
                      value={formData.location}
                      onChange={handleChange}
                      className='input  w-full'
                      maxLength={80}
                    />
                  </label>
                </div>

                {/* position */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      <span className='font-medium text-red-500 mr-1'>*</span>
                      {t('deviceLocationDeviceTb')}
                    </span>
                    <input
                      type='text'
                      name='position'
                      value={formData.position}
                      onChange={handleChange}
                      className='input  w-full'
                      maxLength={80}
                    />
                  </label>
                </div>

                {/* remark */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      {t('remmark')}
                    </span>
                    <input
                      type='text'
                      name='remark'
                      value={formData.remark}
                      onChange={handleChange}
                      className='input  w-full'
                      maxLength={80}
                    />
                  </label>
                </div>

                {/* tag */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      {t('tag')}
                    </span>
                    <input
                      type='text'
                      name='tag'
                      value={formData.tag}
                      onChange={handleChange}
                      className='input  w-full'
                      maxLength={80}
                    />
                  </label>
                </div>

                {/* network */}
                {(role === 'SUPER' || role === 'SERVICE') && <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      {t('deviceNetwork')}
                    </span>
                    <button
                      type='button'
                      className='btn btn-neutral w-full'
                      onClick={() => openEdit(formData.config)}
                    >
                      <RiSettings4Line size={20} />
                      {t('deviceNetwork')}
                    </button>
                  </label>
                </div>}

                {/* hard reset */}
                {role === 'SUPER' && (
                  <>
                    <div className='form-control w-full md:col-span-2'>
                      <div className='label flex-col items-start w-full mb-3'>
                        <span className='label-text text-wrap mb-2'>
                          {t('hardReset')}
                        </span>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-2 w-full'>
                          <Select
                            id='hours'
                            options={mapOptions<
                              selectOption,
                              keyof selectOption
                            >(hoursOptions, 'value', 'label')}
                            value={mapDefaultValue<
                              selectOption,
                              keyof selectOption
                            >(hoursOptions, hardReset.hour, 'value', 'label')}
                            onChange={e =>
                              setHardReset({
                                ...hardReset,
                                hour: String(e?.value)
                              })
                            }
                            menuPlacement='top'
                            autoFocus={false}
                            className='react-select-container z-[150] custom-menu-select w-full'
                            classNamePrefix='react-select'
                          />
                          <Select
                            id='minute'
                            options={mapOptions<
                              selectOption,
                              keyof selectOption
                            >(minutesOptions, 'value', 'label')}
                            value={mapDefaultValue<
                              selectOption,
                              keyof selectOption
                            >(
                              minutesOptions,
                              hardReset.minute,
                              'value',
                              'label'
                            )}
                            onChange={e =>
                              setHardReset({
                                ...hardReset,
                                minute: String(e?.value)
                              })
                            }
                            menuPlacement='top'
                            autoFocus={false}
                            className='react-select-container z-[150] custom-menu-select w-full'
                            classNamePrefix='react-select'
                          />
                          <button
                            className='btn btn-neutral'
                            type='button'
                            onClick={() => hardResetFun()}
                          >
                            {t('messageSend')}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`form-control w-full md:col-span-2 ${
                        firmwareList.length === 0
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      <div className='label flex-col items-start w-full mb-3'>
                        <span className='label-text text-wrap mb-2'>
                          {t('firmWareVer')}
                        </span>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 w-full'>
                          <Select
                            key={selectedFirmware}
                            isDisabled={firmwareList.length === 0}
                            id='firmware'
                            options={mapOptions<
                              selectFirmwareOption,
                              keyof selectFirmwareOption
                            >(firmwareList, 'fileName', 'fileName')}
                            value={mapDefaultValue<
                              selectFirmwareOption,
                              keyof selectFirmwareOption
                            >(
                              firmwareList,
                              selectedFirmware,
                              'fileName',
                              'fileName'
                            )}
                            onChange={e =>
                              setSelectedFirmware(String(e?.value))
                            }
                            menuPlacement='top'
                            autoFocus={false}
                            className='react-select-container z-[150] custom-menu-select w-full'
                            classNamePrefix='react-select'
                          />
                          <button
                            className='btn btn-neutral'
                            type='button'
                            disabled={selectedFirmware === ''}
                            onClick={() => handleUpdateFirmware()}
                          >
                            {t('updateButton')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div
                role='tablist'
                className='tabs tabs-border justify-evenly mt-4'
              >
                <a
                  role='tab'
                  className={`tab ${
                    currentTab === 1 ? 'tab-active font-medium' : ''
                  }`}
                  onClick={() => setCurrentTab(1)}
                >
                  {currentTab === 1 ? (
                    <RiSignalWifi2Fill size={24} />
                  ) : (
                    <RiSignalWifi2Line size={24} />
                  )}
                  <span className='hidden md:block md:ml-2'>Wi-Fi</span>
                </a>
                <a
                  role='tab'
                  className={`tab ${
                    currentTab === 2 ? 'tab-active font-medium' : ''
                  }`}
                  onClick={() => setCurrentTab(2)}
                >
                  {currentTab === 2 ? (
                    <BsEthernet size={24} />
                  ) : (
                    <CgEthernet size={24} />
                  )}
                  <span className='hidden md:block md:ml-2'>Lan</span>
                </a>
                <a
                  role='tab'
                  className={`tab ${
                    currentTab === 3 ? 'tab-active font-medium' : ''
                  }`}
                  onClick={() => setCurrentTab(3)}
                >
                  {currentTab === 3 ? (
                    <RiSimCard2Fill size={24} />
                  ) : (
                    <RiSimCard2Line size={24} />
                  )}
                  <span className='hidden md:block md:ml-2'>Sim</span>
                </a>
              </div>
              {currentTab === 1 ? (
                <div className='mt-5'>
                  <div>
                    <div className='flex items-center justify-center gap-4'>
                      <label
                        htmlFor='radio-1'
                        className='flex items-center gap-2'
                      >
                        <input
                          type='radio'
                          name='radio-1'
                          className='radio'
                          checked={networkObject.selectWifi}
                          onClick={() => {
                            setNetworkForm({
                              ...networkForm,
                              wifi: {
                                ...networkForm.wifi,
                                ip: '',
                                subnet: '',
                                macAddress: '',
                                gateway: '',
                                dns: ''
                              }
                            })
                            setNetworkObject({
                              ...networkObject,
                              selectWifi: true
                            })
                          }}
                        />
                        <span>DHCP</span>
                      </label>
                      <label
                        htmlFor='radio-1'
                        className='flex items-center gap-2'
                      >
                        <input
                          type='radio'
                          name='radio-1'
                          className='radio'
                          checked={!networkObject.selectWifi}
                          onClick={() =>
                            setNetworkObject({
                              ...networkObject,
                              selectWifi: false
                            })
                          }
                        />
                        <span>Manual</span>
                      </label>
                    </div>

                    <div className='mt-3'>
                      <div className='form-control w-full'>
                        <div className='grid grid-cols-1 md:grid-cols-2 md:gap-3'>
                          <label className='label flex-col items-start w-full mb-3'>
                            <span className='label-text text-wrap mb-2'>
                              <span className='font-medium text-red-500 mr-1'>
                                *
                              </span>
                              SSID
                            </span>
                            <input
                              type='text'
                              name='ssid'
                              required
                              value={networkForm?.wifi?.ssid ?? '—'}
                              onChange={e =>
                                setNetworkForm({
                                  ...networkForm,
                                  wifi: {
                                    ...networkForm.wifi,
                                    ssid: e.target.value
                                  }
                                })
                              }
                              className='input  w-full'
                              maxLength={50}
                            />
                          </label>
                          <label className='label flex-col items-start w-full mb-3'>
                            <span className='label-text text-wrap mb-2'>
                              {/* <span className='font-medium text-red-500 mr-1'>
                                *
                              </span> */}
                              Password
                            </span>
                            <input
                              type='text'
                              name='password'
                              value={networkForm?.wifi?.password ?? '—'}
                              onChange={e =>
                                setNetworkForm({
                                  ...networkForm,
                                  wifi: {
                                    ...networkForm.wifi,
                                    password: e.target.value
                                  }
                                })
                              }
                              className='input  w-full'
                              maxLength={50}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`mt-3 ${
                        networkObject.selectWifi ? 'opacity-70' : ''
                      }`}
                    >
                      <div className='form-control w-full'>
                        <div className='grid grid-cols-1 md:grid-cols-2 md:gap-3'>
                          <label className='label flex-col items-start w-full mb-3'>
                            <span className='label-text text-wrap mb-2'>
                              {!networkObject.selectWifi && (
                                <span className='font-medium text-red-500 mr-1'>
                                  *
                                </span>
                              )}
                              IP
                            </span>
                            <input
                              type='text'
                              name='ip'
                              required
                              disabled={networkObject.selectWifi}
                              value={networkForm?.wifi?.ip ?? '—'}
                              onChange={e =>
                                setNetworkForm({
                                  ...networkForm,
                                  wifi: {
                                    ...networkForm.wifi,
                                    ip: e.target.value
                                  }
                                })
                              }
                              className='input  w-full'
                              maxLength={50}
                            />
                          </label>
                          <label className='label flex-col items-start w-full mb-3'>
                            <span className='label-text text-wrap mb-2'>
                              {!networkObject.selectWifi && (
                                <span className='font-medium text-red-500 mr-1'>
                                  *
                                </span>
                              )}
                              Subnet
                            </span>
                            <input
                              type='text'
                              name='subnet'
                              required
                              disabled={networkObject.selectWifi}
                              value={networkForm?.wifi?.subnet ?? '—'}
                              onChange={e =>
                                setNetworkForm({
                                  ...networkForm,
                                  wifi: {
                                    ...networkForm.wifi,
                                    subnet: e.target.value
                                  }
                                })
                              }
                              className='input  w-full'
                              maxLength={50}
                            />
                          </label>
                          <label className='label flex-col items-start w-full mb-3'>
                            <span className='label-text text-wrap mb-2'>
                              {!networkObject.selectWifi && (
                                <span className='font-medium text-red-500 mr-1'>
                                  *
                                </span>
                              )}
                              MAC address
                            </span>
                            <input
                              type='text'
                              name='name'
                              required
                              disabled={networkObject.selectWifi}
                              value={networkForm?.wifi?.macAddress ?? '—'}
                              onChange={e =>
                                setNetworkForm({
                                  ...networkForm,
                                  wifi: {
                                    ...networkForm.wifi,
                                    macAddress: e.target.value
                                  }
                                })
                              }
                              className='input  w-full'
                              maxLength={50}
                            />
                          </label>

                          <label className='label flex-col items-start w-full mb-3'>
                            <span className='label-text text-wrap mb-2'>
                              {!networkObject.selectWifi && (
                                <span className='font-medium text-red-500 mr-1'>
                                  *
                                </span>
                              )}
                              Gateway
                            </span>
                            <input
                              type='text'
                              name='gatway'
                              required
                              disabled={networkObject.selectWifi}
                              value={networkForm?.wifi?.gateway ?? '—'}
                              onChange={e =>
                                setNetworkForm({
                                  ...networkForm,
                                  wifi: {
                                    ...networkForm.wifi,
                                    gateway: e.target.value
                                  }
                                })
                              }
                              className='input  w-full'
                              maxLength={50}
                            />
                          </label>
                          <label className='label flex-col items-start w-full mb-3'>
                            <span className='label-text text-wrap mb-2'>
                              {!networkObject.selectWifi && (
                                <span className='font-medium text-red-500 mr-1'>
                                  *
                                </span>
                              )}
                              DNS
                            </span>
                            <input
                              type='text'
                              name='gatway'
                              required
                              disabled={networkObject.selectWifi}
                              value={networkForm?.wifi?.dns ?? '—'}
                              onChange={e =>
                                setNetworkForm({
                                  ...networkForm,
                                  wifi: {
                                    ...networkForm.wifi,
                                    dns: e.target.value
                                  }
                                })
                              }
                              className='input  w-full'
                              maxLength={50}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : currentTab === 2 ? (
                <div className='mt-5'>
                  <div>
                    <div className='flex items-center justify-center gap-4'>
                      <label
                        htmlFor='radio-1'
                        className='flex items-center gap-2'
                      >
                        <input
                          type='radio'
                          name='radio-1'
                          className='radio'
                          checked={networkObject.selectLan}
                          onClick={() => {
                            setNetworkForm({
                              ...networkForm,
                              lan: {
                                ...networkForm.lan,
                                dns: '',
                                gateway: '',
                                ip: '',
                                subnet: ''
                              }
                            })
                            setNetworkObject({
                              ...networkObject,
                              selectLan: true
                            })
                          }}
                        />
                        <span>Auto</span>
                      </label>
                      <label
                        htmlFor='radio-1'
                        className='flex items-center gap-2'
                      >
                        <input
                          type='radio'
                          name='radio-1'
                          className='radio'
                          checked={!networkObject.selectLan}
                          onClick={() =>
                            setNetworkObject({
                              ...networkObject,
                              selectLan: false
                            })
                          }
                        />
                        <span>Manual</span>
                      </label>
                    </div>
                    {!networkObject.selectLan && (
                      <div className='mt-3'>
                        <div className='form-control w-full'>
                          <div className='grid grid-cols-1 md:grid-cols-2 md:gap-3'>
                            <label className='label flex-col items-start w-full mb-3'>
                              <span className='label-text text-wrap mb-2'>
                                <span className='font-medium text-red-500 mr-1'>
                                  *
                                </span>
                                IP
                              </span>
                              <input
                                type='text'
                                name='ip'
                                required
                                value={networkForm?.lan?.ip ?? '—'}
                                onChange={e =>
                                  setNetworkForm({
                                    ...networkForm,
                                    lan: {
                                      ...networkForm.lan,
                                      ip: e.target.value
                                    }
                                  })
                                }
                                className='input  w-full'
                                maxLength={50}
                              />
                            </label>
                            <label className='label flex-col items-start w-full mb-3'>
                              <span className='label-text text-wrap mb-2'>
                                <span className='font-medium text-red-500 mr-1'>
                                  *
                                </span>
                                Subnet
                              </span>
                              <input
                                type='text'
                                name='subnet'
                                required
                                value={networkForm?.lan?.subnet ?? '—'}
                                onChange={e =>
                                  setNetworkForm({
                                    ...networkForm,
                                    lan: {
                                      ...networkForm.lan,
                                      subnet: e.target.value
                                    }
                                  })
                                }
                                className='input  w-full'
                                maxLength={50}
                              />
                            </label>
                          </div>
                          <div className='grid grid-cols-1 md:grid-cols-2 md:gap-3'>
                            <label className='label flex-col items-start w-full mb-3'>
                              <span className='label-text text-wrap mb-2'>
                                Gateway
                              </span>
                              <input
                                type='text'
                                name='gatway'
                                value={networkForm?.lan?.gateway ?? '—'}
                                onChange={e =>
                                  setNetworkForm({
                                    ...networkForm,
                                    lan: {
                                      ...networkForm.lan,
                                      gateway: e.target.value
                                    }
                                  })
                                }
                                className='input  w-full'
                                maxLength={50}
                              />
                            </label>
                            <label className='label flex-col items-start w-full mb-3'>
                              <span className='label-text text-wrap mb-2'>
                                Dns
                              </span>
                              <input
                                type='text'
                                name='gatway'
                                value={networkForm?.lan?.dns ?? '—'}
                                onChange={e =>
                                  setNetworkForm({
                                    ...networkForm,
                                    lan: {
                                      ...networkForm.lan,
                                      dns: e.target.value
                                    }
                                  })
                                }
                                className='input  w-full'
                                maxLength={50}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className='mt-5'>
                  <div>
                    <div className='flex items-center justify-center gap-4'>
                      <label
                        htmlFor='radio-1'
                        className='flex items-center gap-2'
                      >
                        <input
                          type='radio'
                          name='radio-1'
                          className='radio'
                          checked={networkForm?.sim?.simSp === 'AIS'}
                          onClick={() => {
                            setNetworkForm({
                              ...networkForm,
                              sim: {
                                ...networkForm.sim,
                                simSp: 'AIS'
                              }
                            })
                          }}
                        />
                        <span>AIS</span>
                      </label>
                      <label
                        htmlFor='radio-1'
                        className='flex items-center gap-2'
                      >
                        <input
                          type='radio'
                          name='radio-1'
                          className='radio'
                          checked={networkForm?.sim?.simSp === 'DTAC'}
                          onClick={() =>
                            setNetworkForm({
                              ...networkForm,
                              sim: {
                                ...networkForm.sim,
                                simSp: 'DTAC'
                              }
                            })
                          }
                        />
                        <span>DTAC</span>
                      </label>
                      <label
                        htmlFor='radio-1'
                        className='flex items-center gap-2'
                      >
                        <input
                          type='radio'
                          name='radio-1'
                          className='radio'
                          checked={networkForm?.sim?.simSp === 'TRUE'}
                          onClick={() =>
                            setNetworkForm({
                              ...networkForm,
                              sim: {
                                ...networkForm.sim,
                                simSp: 'TRUE'
                              }
                            })
                          }
                        />
                        <span>TRUE</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Modal Actions */}
          <div className='modal-action mt-4 md:mt-6'>
            {!onNetwork ? (
              <button
                type='button'
                className='btn'
                onClick={() => {
                  editModalRef.current?.close()
                  resetForm()
                }}
              >
                {t('cancelButton')}
              </button>
            ) : (
              <button
                type='button'
                className='btn'
                onClick={() => {
                  setCurrentTab(1)
                  setOnNetwork(false)
                }}
              >
                {t('buttonErrorBack')}
              </button>
            )}
            <button type='submit' className='btn btn-neutral'>
              {t('submitButton')}
            </button>
          </div>
        </form>
      </dialog>

      {/* move Modal */}
      <dialog ref={moveModalRef} className='modal overflow-y-scroll py-10'>
        <form
          onSubmit={handleMoveDevice}
          className='flex flex-col justify-between modal-box md:w-5/6 md:max-w-2xl min-h-[550px] max-h-max'
        >
          <div>
            <h3 className='font-bold text-lg mb-3'>{t('moveDevice')}</h3>
            <DeviceListWithSetState
              deviceId={deviceId}
              setDeviceId={setDeviceId}
            />
            <div className='bg-base-200 rounded-field p-3 mt-3'>
              {/* <RiCpuLine size={24} /> */}
              <div className='flex flex-col gap-1'>
                <span>S/N: {moveDevice.id}</span>
                <span>Name: {moveDevice.name}</span>
              </div>
            </div>
            <div className='my-10 w-full flex items-center justify-center'>
              <IoSwapVertical size={36} className='text-base-content/70' />
            </div>
            <div className='bg-base-200 rounded-field p-3 mt-3'>
              {/* <RiCpuLine size={24} /> */}
              <div className='flex flex-col gap-1'>
                <span>S/N: {deviceId !== '' ? deviceId : '—'}</span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className='modal-action mt-4 md:mt-6'>
            <button
              type='button'
              className='btn'
              onClick={() => {
                setDeviceId('')
                setMoveDevice({
                  id: '',
                  name: ''
                })
                moveModalRef.current?.close()
              }}
            >
              {t('cancelButton')}
            </button>
            <button
              type='submit'
              className='btn btn-neutral'
              disabled={deviceId === ''}
            >
              {t('submitButton')}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  )
}

export default ManageDevice
