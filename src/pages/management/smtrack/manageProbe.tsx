import { AxiosError } from 'axios'
import {
  ChangeEvent,
  FormEvent,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { useTranslation } from 'react-i18next'
import axiosInstance from '../../../constants/axios/axiosInstance'
import { ProbeListType } from '../../../types/tms/devices/probeType'
import { responseType } from '../../../types/smtrack/utilsRedux/utilsReduxType'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers/rootReducer'
import DataTable, { TableColumn } from 'react-data-table-component'
import Loading from '../../../components/skeleton/table/loading'
import DataTableNoData from '../../../components/skeleton/table/noData'
import { RiDeleteBin7Line, RiEditLine } from 'react-icons/ri'
import {
  scheduleDayArray,
  scheduleMinuteArray,
  scheduleTimeArray
} from '../../../constants/utils/utilsConstants'
import {
  setSubmitLoading,
  setTokenExpire
} from '../../../redux/actions/utilsActions'
import Swal from 'sweetalert2'
import Select, { SingleValue } from 'react-select'
import { Option } from '../../../types/global/hospitalAndWard'
import { DeviceListType } from '../../../types/smtrack/devices/deviceType'
import ReactSlider from 'react-slider'
import { client } from '../../../services/mqtt'

type OptionData = {
  value: string
  name: string
}

type Schedule = {
  scheduleKey: string
  scheduleLabel: string
}

type ScheduleHour = {
  scheduleHourKey: string
  scheduleHourLabel: string
}

type ScheduleMinute = {
  scheduleMinuteKey: string
  scheduleMinuteLabel: string
}

const ManageProbe = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { globalSearch, tokenDecode } = useSelector(
    (state: RootState) => state.utils
  )
  const addModalRef = useRef<HTMLDialogElement>(null)
  const editModalRef = useRef<HTMLDialogElement>(null)
  const [loading, setLoading] = useState(false)
  const [probeList, setProbeList] = useState<ProbeListType[]>([])
  const [probeListFilter, setProbeListFilter] = useState<ProbeListType[]>([])
  const [deviceList, setDeviceList] = useState<DeviceListType[]>([])
  const [formData, setFormData] = useState<ProbeListType>({
    channel: '',
    doorAlarmTime: '',
    doorQty: 0,
    doorSound: false,
    firstDay: '',
    firstTime: '',
    humiAdj: 0,
    humiMax: 25,
    humiMin: 0,
    id: '',
    muteAlarmDuration: '',
    muteDoorAlarmDuration: '',
    name: '',
    notiDelay: 0,
    notiMobile: false,
    notiRepeat: 0,
    notiToNormal: false,
    position: '',
    secondDay: '',
    secondTime: '',
    sn: '',
    stampTime: '',
    tempAdj: 0,
    tempMax: 30,
    tempMin: -10,
    thirdDay: '',
    thirdTime: '',
    type: ''
  })
  const [muteMode, setMuteMode] = useState({
    choichOne: 'immediately',
    choichtwo: 'send',
    choichthree: 'onetime',
    choichfour: 'on'
  })
  const [sendTime, setSendTime] = useState({
    after: 5,
    every: 5
  })
  const [scheduleDay, setScheduleDay] = useState({
    firstDay: '',
    seccondDay: '',
    thirdDay: ''
  })
  const [scheduleTime, setScheduleTime] = useState({
    firstTime: '',
    secondTime: '',
    thirdTime: '',
    firstMinute: '',
    seccondMinute: '',
    thirdMinute: ''
  })
  const { role } = tokenDecode ?? {}
  const deviceModel =
    formData?.id?.substring(0, 3) === 'eTP' ? 'etemp' : 'items'
  const version = formData?.id?.substring(3, 5).toLowerCase()

  const mapOptions = <T, K extends keyof T>(
    data: T[],
    valueKey: K,
    labelKey: K
  ): Option[] =>
    data?.map(item => ({
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
      ?.filter(item => item[valueKey] === id)
      .map(item => ({
        value: item[valueKey] as unknown as string,
        label: item[labelKey] as unknown as string
      }))[0]

  const fetchDeviceList = useCallback(async () => {
    try {
      const response = await axiosInstance.get<responseType<DeviceListType[]>>(
        '/devices/dashboard/device'
      )
      setDeviceList(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true))
        }
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    }
  }, [])

  const fetchProbe = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get<responseType<ProbeListType[]>>(
        `/devices/probe`
      )
      setProbeList(response.data.data)
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
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    if (
      formData.sn !== '' &&
      formData.name !== '' &&
      formData.type !== '' &&
      formData.position !== '' &&
      formData.stampTime !== '' &&
      formData.doorQty !== 0 &&
      formData.channel !== ''
    ) {
      const body = {
        sn: formData.sn,
        name: formData.name,
        type: formData.type,
        position: formData.position,
        stampTime: formData.stampTime,
        tempMin: formData.tempMin,
        tempMax: formData.tempMax,
        humiMin: formData.humiMin,
        humiMax: formData.humiMax,
        doorQty: formData.doorQty,
        channel: formData.channel
      }
      try {
        await axiosInstance.post<responseType<ProbeListType>>(
          '/devices/probe',
          body
        )
        addModalRef.current?.close()
        resetForm()
        await fetchProbe()
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: t('submitSuccess'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2500
        }).finally(() =>
          client.publish(
            `siamatic/${deviceModel}/${version}/${formData.id}/adj`,
            'on'
          )
        )
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

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    if (
      formData.sn !== '' &&
      formData.name !== '' &&
      formData.type !== '' &&
      formData.position !== '' &&
      formData.stampTime !== '' &&
      formData.doorQty !== 0 &&
      formData.channel !== '' &&
      formData.channel !== '' &&
      scheduleDay.firstDay !== '' &&
      scheduleDay.seccondDay !== '' &&
      scheduleDay.thirdDay !== '' &&
      scheduleTime.firstTime !== '' &&
      scheduleTime.secondTime !== '' &&
      scheduleTime.thirdTime !== '' &&
      scheduleTime.firstMinute !== '' &&
      scheduleTime.seccondMinute !== '' &&
      scheduleTime.thirdMinute !== ''
    ) {
      const body = {
        sn: formData.sn,
        name: formData.name,
        type: formData.type,
        position: formData.position,
        stampTime: formData.stampTime,
        tempMin: formData.tempMin,
        tempMax: formData.tempMax,
        humiMin: formData.humiMin,
        humiMax: formData.humiMax,
        doorQty: formData.doorQty,
        channel: formData.channel,
        firstDay: scheduleDay.firstDay,
        secondDay: scheduleDay.seccondDay,
        thirdDay: scheduleDay.thirdDay,
        firstTime:
          scheduleTime.firstTime !== 'OFF'
            ? `${scheduleTime.firstTime}${scheduleTime.firstMinute}`
            : 'OFF',
        secondTime:
          scheduleTime.secondTime !== 'OFF'
            ? `${scheduleTime.secondTime}${scheduleTime.seccondMinute}`
            : 'OFF',
        thirdTime:
          scheduleTime.thirdTime !== 'OFF'
            ? `${scheduleTime.thirdTime}${scheduleTime.thirdMinute}`
            : 'OFF',
        notiDelay: muteMode.choichOne === 'immediately' ? 0 : sendTime.after,
        notiMobile: muteMode.choichfour === 'on' ? true : false,
        notiRepeat: muteMode.choichthree === 'onetime' ? 0 : sendTime.every,
        notiToNormal: muteMode.choichtwo === 'send' ? true : false
      }
      try {
        await axiosInstance.put<responseType<ProbeListType>>(
          `/devices/probe/${formData.id}`,
          body
        )
        editModalRef.current?.close()
        resetForm()
        await fetchProbe()
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const resetForm = () => {
    setFormData({
      channel: '',
      doorAlarmTime: '',
      doorQty: 0,
      doorSound: false,
      firstDay: '',
      firstTime: '',
      humiAdj: 0,
      humiMax: 25,
      humiMin: 0,
      id: '',
      muteAlarmDuration: '',
      muteDoorAlarmDuration: '',
      name: '',
      notiDelay: 0,
      notiMobile: false,
      notiRepeat: 0,
      notiToNormal: false,
      position: '',
      secondDay: '',
      secondTime: '',
      sn: '',
      stampTime: '',
      tempAdj: 0,
      tempMax: 30,
      tempMin: -10,
      thirdDay: '',
      thirdTime: '',
      type: ''
    })
    setMuteMode({
      choichOne: 'immediately',
      choichtwo: 'send',
      choichthree: 'onetime',
      choichfour: 'on'
    })
    setSendTime({
      after: 5,
      every: 5
    })
    setScheduleDay({
      firstDay: '',
      seccondDay: '',
      thirdDay: ''
    })
    setScheduleTime({
      firstTime: '',
      secondTime: '',
      thirdTime: '',
      firstMinute: '',
      seccondMinute: '',
      thirdMinute: ''
    })
  }

  const openEditModal = (probe: ProbeListType) => {
    setFormData({
      channel: probe.channel,
      doorAlarmTime: probe.doorAlarmTime,
      doorQty: probe.doorQty,
      doorSound: probe.doorSound,
      firstDay: probe.firstDay,
      firstTime: probe.firstTime,
      humiAdj: probe.humiAdj,
      humiMax: probe.humiMax,
      humiMin: probe.humiMin,
      id: probe.id,
      muteAlarmDuration: probe.muteAlarmDuration,
      muteDoorAlarmDuration: probe.muteDoorAlarmDuration,
      name: probe.name,
      notiDelay: probe.notiDelay,
      notiMobile: probe.notiMobile,
      notiRepeat: probe.notiRepeat,
      notiToNormal: probe.notiToNormal,
      position: probe.position,
      secondDay: probe.secondDay,
      secondTime: probe.secondTime,
      sn: probe.sn,
      stampTime: probe.stampTime,
      tempAdj: probe.tempAdj,
      tempMax: probe.tempMax,
      tempMin: probe.tempMin,
      thirdDay: probe.thirdDay,
      thirdTime: probe.thirdTime,
      type: probe.type
    })
    setMuteMode({
      choichOne: probe.notiDelay < 5 ? 'immediately' : 'after',
      choichtwo: probe.notiToNormal ? 'send' : 'donotsend',
      choichthree: probe.notiRepeat < 5 ? 'onetime' : 'every',
      choichfour: probe.notiMobile ? 'on' : 'off'
    })
    setSendTime({
      after: probe.notiDelay < 5 ? 5 : probe.notiDelay,
      every: probe.notiRepeat < 5 ? 5 : probe.notiRepeat
    })
    setScheduleDay({
      firstDay: probe.firstDay,
      seccondDay: probe.secondDay,
      thirdDay: probe.thirdDay
    })
    setScheduleTime({
      firstTime:
        probe.firstTime !== 'OFF'
          ? probe.firstTime.substring(0, 2)
          : probe.firstTime,
      secondTime:
        probe.secondTime !== 'OFF'
          ? probe.secondTime.substring(0, 2)
          : probe.secondTime,
      thirdTime:
        probe.thirdTime !== 'OFF'
          ? probe.thirdTime.substring(0, 2)
          : probe.thirdTime,
      firstMinute:
        probe.firstTime !== 'OFF'
          ? probe.firstTime.substring(2, 4)
          : probe.firstTime,
      seccondMinute:
        probe.secondTime !== 'OFF'
          ? probe.secondTime.substring(2, 4)
          : probe.secondTime,
      thirdMinute:
        probe.thirdTime !== 'OFF'
          ? probe.thirdTime.substring(2, 4)
          : probe.thirdTime
    })
    editModalRef.current?.showModal()
  }

  const deleteDevices = async (id: string) => {
    dispatch(setSubmitLoading())
    try {
      const response = await axiosInstance.delete<responseType<ProbeListType>>(
        `/devices/probe/${id}`
      )
      await fetchProbe()
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

  const selectProbeName = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    setFormData({ ...formData, name: selectedValue })
  }

  const selectProbeType = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    setFormData({ ...formData, type: selectedValue })
  }

  const delayTime = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    setFormData({ ...formData, stampTime: selectedValue })
  }

  const doorSelected = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    setFormData({ ...formData, doorQty: Number(selectedValue) })
  }

  const channelSelected = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    setFormData({ ...formData, channel: selectedValue })
  }

  const filterOptions = (options: Option[], selectedValues: string[]) => {
    return options.filter(
      option => option.value === 'OFF' || !selectedValues.includes(option.value)
    )
  }

  const getScheduleDay = (e: SingleValue<Option>, key: string) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    switch (key) {
      case 'firstDay':
        setScheduleDay({ ...scheduleDay, firstDay: selectedValue })
        break
      case 'seccondDay':
        setScheduleDay({ ...scheduleDay, seccondDay: selectedValue })
        break
      case 'thirdDay':
        setScheduleDay({ ...scheduleDay, thirdDay: selectedValue })
        break
    }
  }

  const getScheduleTime = (e: SingleValue<Option>, key: string) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    switch (key) {
      case 'firstTime':
        setScheduleTime({ ...scheduleTime, firstTime: selectedValue })
        break
      case 'seccondTime':
        setScheduleTime({ ...scheduleTime, secondTime: selectedValue })
        break
      case 'thirdTime':
        setScheduleTime({ ...scheduleTime, thirdTime: selectedValue })
        break
    }
  }

  const getScheduleTimeMinute = (e: SingleValue<Option>, key: string) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    switch (key) {
      case 'firstTimeMinute':
        setScheduleTime({ ...scheduleTime, firstMinute: selectedValue })
        break
      case 'seccondTimeMinute':
        setScheduleTime({ ...scheduleTime, seccondMinute: selectedValue })
        break
      case 'thirdTimeMinute':
        setScheduleTime({ ...scheduleTime, thirdMinute: selectedValue })
        break
    }
  }

  useEffect(() => {
    fetchProbe()
    fetchDeviceList()
  }, [])

  useEffect(() => {
    const filter = probeList?.filter(f => {
      const matchesSearch =
        f.sn?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        f.name?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        f.channel?.toLowerCase().includes(globalSearch.toLowerCase())

      return matchesSearch
    })

    setProbeListFilter(filter)
  }, [probeList, globalSearch])

  const columns: TableColumn<ProbeListType>[] = [
    {
      name: t('probeName'),
      cell: item => item.name ?? '—',
      sortable: false,
      center: true
    },
    {
      name: t('probeType'),
      cell: item => item.type ?? '—',
      sortable: false,
      center: true
    },
    {
      name: t('probeChanel'),
      cell: item => (
        <span className='badge badge-primary font-bold'>
          {item.channel ?? '—'}
        </span>
      ),
      sortable: false,
      center: true
    },
    {
      name: t('probeLocation'),
      cell: item => (
        <div
          className='flex justify-center tooltip w-[180px]'
          data-tip={item.position ?? '—'}
        >
          <div className='truncate max-w-[150px]'>
            <span>{item.position ?? '—'}</span>
          </div>
        </div>
      ),
      sortable: false,
      center: true
    },
    {
      name: t('deviceSerialTb'),
      cell: item => item.sn ?? '—',
      sortable: false,
      center: true
    },
    {
      name: t('lastModified'),
      cell: item => (
        <div className='flex items-center gap-2'>
          <span>
            {new Date(String(item.updateAt))?.toLocaleString('th-TH', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
              timeZone: 'UTC'
            })}
          </span>
          <span>
            {new Date(String(item.updateAt))?.toLocaleString('th-TH', {
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
          <button
            className='btn btn-ghost flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-primary'
            onClick={() => openEditModal(item)}
          >
            <RiEditLine size={20} />
          </button>
          {role === 'SUPER' && (
            <button
              className='btn btn-ghost flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-red-500'
              onClick={() =>
                Swal.fire({
                  title: t('deleteProbe'),
                  text: t('notReverseText'),
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

  const delayTimeArray = [
    { value: '5', name: t('probe5Minute') },
    { value: '15', name: t('probe15Minute') },
    { value: '30', name: t('probe30Minute') },
    { value: '60', name: t('probe1Hour') },
    { value: '120', name: t('probe2Hour') },
    { value: '240', name: t('probe4Hour') }
  ]

  const doorArray = [
    { value: 'OFF', name: t('doorInacctive') },
    { value: '1', name: t('probeDoor1') },
    { value: '2', name: t('probeDoor2') },
    { value: '3', name: t('probeDoor3') }
  ]

  const channelArray = [
    { value: '1', name: t('probeChanel1') },
    { value: '2', name: t('probeChanel2') }
    // { value: '3', name: t('probeChanel3') },
    // { value: '4', name: t('probeChanel4') }
  ]

  const ProbeName = [
    { value: 'SHT-31', name: 'SHT-31' },
    { value: 'PT100', name: 'PT100' }
  ]

  const ProbeType = [
    { value: 'Digital Sensor', name: 'Digital Sensor' },
    { value: 'Analog Sensor', name: 'Analog Sensor' }
  ]

  return (
    <div>
      <div className='flex flex-col lg:flex-row lg:items-center justify-between mt-3'>
        <span className='text-[20px] font-medium'></span>
        <div className='flex flex-col lg:flex-row mt-3 lg:mt-0 lg:items-center items-end lg:gap-3'>
          <button
            className='btn btn-neutral max-w-[130px]'
            onClick={() => addModalRef.current?.showModal()}
          >
            {t('addProbe')}
          </button>
        </div>
      </div>

      <div className='dataTableWrapper bg-base-100 rounded-field p-3 mt-5 duration-300 ease-linear'>
        <DataTable
          responsive
          fixedHeader
          pagination
          columns={columns}
          data={probeListFilter}
          progressPending={loading}
          progressComponent={<Loading />}
          noDataComponent={<DataTableNoData />}
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 50, 100]}
          className='md:!max-h-[calc(100dvh-410px)]'
        />
      </div>

      <dialog ref={addModalRef} className='modal overflow-y-scroll py-10'>
        <form
          onSubmit={handleSubmit}
          className='modal-box max-w-[55rem] h-max max-h-max'
        >
          <h3 className='font-bold text-lg'>{t('addProbe')}</h3>
          <div className='flex flex-col lg:flex-col xl:flex-row gap-4 mt-4 w-full'>
            <div className='w-full'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full'>
                {/* Right Column - 3 of the grid (100%) */}
                <div className='col-span-2 grid grid-cols-1'>
                  {/* Deivce */}
                  <div className='form-control w-full'>
                    <label className='label flex-col items-start w-full mb-3'>
                      <span className='label-text text-wrap mb-2'>
                        <span className='font-medium text-red-500 mr-1'>*</span>
                        {t('deviceSerialTb')}
                      </span>
                      <Select
                        options={mapOptions<
                          DeviceListType,
                          keyof DeviceListType
                        >(deviceList, 'id', 'id')}
                        value={mapDefaultValue<
                          DeviceListType,
                          keyof DeviceListType
                        >(deviceList, formData.sn, 'id', 'id')}
                        onChange={e =>
                          setFormData({ ...formData, sn: e?.value as string })
                        }
                        autoFocus={false}
                        className='react-select-container custom-menu-select z-[75] min-w-full'
                        classNamePrefix='react-select'
                      />
                    </label>
                  </div>
                </div>
                {/* Right Column - 2/3 of the grid (70%) */}
                <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
                  {/* name */}
                  <div className='form-control w-full'>
                    <label className='label flex-col items-start w-full mb-3'>
                      <span className='label-text text-wrap mb-2'>
                        <span className='font-medium text-red-500 mr-1'>*</span>
                        {t('probeName')}
                      </span>
                      <Select
                        options={mapOptions<OptionData, keyof OptionData>(
                          ProbeName,
                          'value',
                          'name'
                        )}
                        value={mapDefaultValue<OptionData, keyof OptionData>(
                          ProbeName,
                          String(formData.name),
                          'value',
                          'name'
                        )}
                        onChange={selectProbeName}
                        autoFocus={false}
                        menuPlacement='top'
                        className='react-select-container custom-menu-select z-[75] min-w-full'
                        classNamePrefix='react-select'
                      />
                    </label>
                  </div>

                  {/* probe type */}
                  <div className='form-control w-full'>
                    <label className='label flex-col items-start w-full mb-3'>
                      <span className='label-text text-wrap mb-2'>
                        <span className='font-medium text-red-500 mr-1'>*</span>
                        {t('probeType')}
                      </span>
                      <Select
                        options={mapOptions<OptionData, keyof OptionData>(
                          ProbeType,
                          'value',
                          'name'
                        )}
                        value={mapDefaultValue<OptionData, keyof OptionData>(
                          ProbeType,
                          String(formData.type),
                          'value',
                          'name'
                        )}
                        onChange={selectProbeType}
                        autoFocus={false}
                        menuPlacement='top'
                        className='react-select-container custom-menu-select z-[75] min-w-full'
                        classNamePrefix='react-select'
                      />
                    </label>
                  </div>
                </div>

                <div className='col-span-2 grid grid-cols-1'>
                  {/* probe location */}
                  <div className='form-control w-full'>
                    <label className='label flex-col items-start w-full mb-3'>
                      <span className='label-text text-wrap mb-2'>
                        <span className='font-medium text-red-500 mr-1'>*</span>
                        {t('probeLocation')}
                      </span>
                      <input
                        name='position'
                        type='text'
                        value={formData.position}
                        onChange={handleChange}
                        className='input  w-full'
                        maxLength={23}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 w-full'>
                {/* Deivce */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      <span className='font-medium text-red-500 mr-1'>*</span>
                      {t('delay')}
                    </span>
                    <Select
                      options={mapOptions<OptionData, keyof OptionData>(
                        delayTimeArray,
                        'value',
                        'name'
                      )}
                      value={mapDefaultValue<OptionData, keyof OptionData>(
                        delayTimeArray,
                        formData.stampTime || '0',
                        'value',
                        'name'
                      )}
                      onChange={delayTime}
                      autoFocus={false}
                      menuPlacement='top'
                      className='react-select-container custom-menu-select z-[75] min-w-full'
                      classNamePrefix='react-select'
                    />
                  </label>
                </div>
                {/* Deivce */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      <span className='font-medium text-red-500 mr-1'>*</span>
                      {t('door')}
                    </span>
                    <Select
                      options={mapOptions<OptionData, keyof OptionData>(
                        doorArray,
                        'value',
                        'name'
                      )}
                      value={mapDefaultValue<OptionData, keyof OptionData>(
                        doorArray,
                        String(formData.doorQty) || '0',
                        'value',
                        'name'
                      )}
                      onChange={doorSelected}
                      autoFocus={false}
                      menuPlacement='top'
                      className='react-select-container custom-menu-select z-[75] min-w-full'
                      classNamePrefix='react-select'
                    />
                  </label>
                </div>
                {/* Deivce */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      <span className='font-medium text-red-500 mr-1'>*</span>
                      {t('probeChanel')}
                    </span>
                    <Select
                      options={mapOptions<OptionData, keyof OptionData>(
                        channelArray,
                        'value',
                        'name'
                      )}
                      value={mapDefaultValue<OptionData, keyof OptionData>(
                        channelArray,
                        String(formData.channel) || '0',
                        'value',
                        'name'
                      )}
                      onChange={channelSelected}
                      autoFocus={false}
                      menuPlacement='top'
                      className='react-select-container custom-menu-select z-[75] min-w-full'
                      classNamePrefix='react-select'
                    />
                  </label>
                </div>
              </div>

              <div className='flex md:hidden flex-col items-center justify-center gap-3 mt-4 w-full'>
                <span>{t('tempMin')}</span>
                <div className='flex items-center justify-center gap-2 w-full'>
                  <button
                    className='btn btn-ghost bg-orange-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (formData.tempMin > -40) {
                        setFormData({
                          ...formData,
                          tempMin: parseFloat(
                            (formData.tempMin - 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    -
                  </button>
                  <input
                    autoFocus={false}
                    className='input  text-center w-full'
                    type='number'
                    step={0.01}
                    min={-40}
                    max={120}
                    value={formData.tempMin}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setFormData({
                          ...formData,
                          tempMin: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setFormData({ ...formData, tempMin: num })
                      }
                    }}
                  />
                  <button
                    className='btn btn-ghost bg-orange-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (formData.tempMin < 120) {
                        setFormData({
                          ...formData,
                          tempMin: parseFloat(
                            (formData.tempMin + 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className='flex md:hidden flex-col items-center justify-center gap-3 mt-4 w-full'>
                <span>{t('tempMax')}</span>
                <div className='flex items-center justify-center gap-2 w-full'>
                  <button
                    className='btn btn-ghost bg-orange-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (formData.tempMax > -40) {
                        setFormData({
                          ...formData,
                          tempMax: parseFloat(
                            (formData.tempMax - 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    -
                  </button>
                  <input
                    autoFocus={false}
                    className='input  text-center w-full'
                    type='number'
                    step={0.01}
                    value={formData.tempMax}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setFormData({
                          ...formData,
                          tempMax: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setFormData({ ...formData, tempMax: num })
                      }
                    }}
                  />
                  <button
                    className='btn btn-ghost bg-orange-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (formData.tempMax < 120) {
                        setFormData({
                          ...formData,
                          tempMax: parseFloat(
                            (formData.tempMax + 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className='flex md:hidden flex-col items-center justify-center gap-3 mt-4 w-full'>
                <span>{t('humiMin')}</span>
                <div className='flex items-center justify-center gap-2 w-full'>
                  <button
                    className='btn btn-ghost bg-blue-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (formData.humiMin > 0) {
                        setFormData({
                          ...formData,
                          humiMin: parseFloat(
                            (formData.humiMin - 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    -
                  </button>
                  <input
                    autoFocus={false}
                    className='input  text-center w-full'
                    type='number'
                    step={0.01}
                    value={formData.humiMin}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setFormData({
                          ...formData,
                          humiMin: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setFormData({ ...formData, humiMin: num })
                      }
                    }}
                  />
                  <button
                    className='btn btn-ghost bg-blue-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (formData.humiMin < 100) {
                        setFormData({
                          ...formData,
                          humiMin: parseFloat(
                            (formData.humiMin + 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className='flex md:hidden flex-col items-center justify-center gap-3 mt-4 w-full'>
                <span>{t('humiMax')}</span>
                <div className='flex items-center justify-center gap-2 w-full'>
                  <button
                    className='btn btn-ghost bg-blue-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (formData.humiMax > 0) {
                        setFormData({
                          ...formData,
                          humiMax: parseFloat(
                            (formData.humiMax - 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    -
                  </button>
                  <input
                    autoFocus={false}
                    className='input  text-center w-full'
                    type='number'
                    step={0.01}
                    value={formData.humiMax}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setFormData({
                          ...formData,
                          humiMax: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setFormData({ ...formData, humiMax: num })
                      }
                    }}
                  />
                  <button
                    className='btn btn-ghost bg-blue-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (formData.humiMax < 100) {
                        setFormData({
                          ...formData,
                          humiMax: parseFloat(
                            (formData.humiMax + 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className='md:grid grid-cols-1 hidden md:grid-cols-2 gap-4 mt-4 w-full'>
                {/* Temperature */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      {t('probeTempSubTb')}
                    </span>
                    <ReactSlider
                      className='relative flex items-center w-full h-2 bg-gray-300 rounded-field my-3'
                      thumbClassName='flex items-center justify-center'
                      trackClassName='bg-orange-500/20 h-2 rounded-field'
                      value={[formData.tempMin, formData.tempMax]}
                      onChange={values =>
                        setFormData({
                          ...formData,
                          tempMin: values[0],
                          tempMax: values[1]
                        })
                      }
                      pearling
                      minDistance={1}
                      step={0.01}
                      min={-40}
                      max={120}
                      renderThumb={(props, state) => {
                        const { key, ref, ...validProps } = props
                        return (
                          <div
                            {...validProps}
                            ref={ref as Ref<HTMLDivElement> | undefined}
                            key={key}
                            className='flex items-center justify-center w-[42px] h-[32px] bg-orange-500 text-white font-bold text-[12px] shadow-md rounded-field p-1 cursor-pointer outline-orange-500/50'
                          >
                            {state.valueNow}
                          </div>
                        )
                      }}
                    />
                  </label>
                </div>

                {/* Humidity */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      {t('probeHumiSubTb')}
                    </span>
                    <ReactSlider
                      className='relative flex items-center w-full h-2 bg-gray-300 rounded-field my-3'
                      thumbClassName='flex items-center justify-center'
                      trackClassName='bg-blue-500/20 h-2 rounded-field'
                      value={[formData.humiMin, formData.humiMax]}
                      onChange={values =>
                        setFormData({
                          ...formData,
                          humiMin: values[0],
                          humiMax: values[1]
                        })
                      }
                      pearling
                      minDistance={1}
                      step={0.01}
                      min={0}
                      max={100}
                      renderThumb={(props, state) => {
                        const { key, ref, ...validProps } = props
                        return (
                          <div
                            {...validProps}
                            ref={ref as Ref<HTMLDivElement> | undefined}
                            key={key}
                            className='flex items-center justify-center w-[42px] h-[32px] bg-blue-500 text-white font-bold text-[12px] shadow-md rounded-field p-1 cursor-pointer outline-blue-500/50'
                          >
                            {state.valueNow}
                          </div>
                        )
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className='md:grid grid-cols-1 hidden md:grid-cols-2 gap-4 mt-4 w-full'>
                {/* Temperature */}
                <div className='flex justify-between gap-2 w-full'>
                  <input
                    autoFocus={false}
                    className='input  text-center w-full'
                    type='number'
                    step={0.01}
                    min={-40}
                    max={120}
                    value={formData.tempMin}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setFormData({
                          ...formData,
                          tempMin: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setFormData({ ...formData, tempMin: num })
                      }
                    }}
                  />
                  <input
                    autoFocus={false}
                    className='input  text-center w-full'
                    type='number'
                    step={0.01}
                    value={formData.tempMax}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setFormData({
                          ...formData,
                          tempMax: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setFormData({ ...formData, tempMax: num })
                      }
                    }}
                  />
                </div>

                {/* Humidity */}
                <div className='flex justify-between gap-2 w-full'>
                  <input
                    autoFocus={false}
                    className='input  text-center w-full'
                    type='number'
                    step={0.01}
                    value={formData.humiMin}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setFormData({
                          ...formData,
                          humiMin: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setFormData({ ...formData, humiMin: num })
                      }
                    }}
                  />
                  <input
                    autoFocus={false}
                    className='input  text-center w-full'
                    type='number'
                    step={0.01}
                    value={formData.humiMax}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setFormData({
                          ...formData,
                          humiMax: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setFormData({ ...formData, humiMax: num })
                      }
                    }}
                  />
                </div>
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

      <dialog ref={editModalRef} className='modal overflow-y-scroll py-10'>
        <form
          onSubmit={handleUpdate}
          className='modal-box max-w-[85rem] h-max max-h-max'
        >
          <h3 className='font-bold text-lg'>{t('editProbe')}</h3>
          <div className='flex flex-col lg:flex-col xl:flex-row gap-4 mt-4 w-full'>
            <div className='w-full'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full'>
                {/* Right Column - 3 of the grid (100%) */}
                <div className='col-span-2 grid grid-cols-1'>
                  {/* Deivce */}
                  <div className='form-control w-full'>
                    <label className='label flex-col items-start w-full mb-3'>
                      <span className='label-text text-wrap mb-2'>
                        <span className='font-medium text-red-500 mr-1'>*</span>
                        {t('deviceSerialTb')}
                      </span>
                      <Select
                        options={mapOptions<
                          DeviceListType,
                          keyof DeviceListType
                        >(deviceList, 'id', 'id')}
                        value={mapDefaultValue<
                          DeviceListType,
                          keyof DeviceListType
                        >(deviceList, formData.sn, 'id', 'id')}
                        onChange={e =>
                          setFormData({ ...formData, sn: e?.value as string })
                        }
                        autoFocus={false}
                        className='react-select-container custom-menu-select z-[75] min-w-full'
                        classNamePrefix='react-select'
                      />
                    </label>
                  </div>
                </div>
                {/* Right Column - 2/3 of the grid (70%) */}
                <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
                  {/* name */}
                  <div className='form-control w-full'>
                    <label className='label flex-col items-start w-full mb-3'>
                      <span className='label-text text-wrap mb-2'>
                        <span className='font-medium text-red-500 mr-1'>*</span>
                        {t('probeName')}
                      </span>
                      <Select
                        options={mapOptions<OptionData, keyof OptionData>(
                          ProbeName,
                          'value',
                          'name'
                        )}
                        value={mapDefaultValue<OptionData, keyof OptionData>(
                          ProbeName,
                          String(formData.name),
                          'value',
                          'name'
                        )}
                        onChange={selectProbeName}
                        autoFocus={false}
                        menuPlacement='top'
                        className='react-select-container custom-menu-select z-[75] min-w-full'
                        classNamePrefix='react-select'
                      />
                    </label>
                  </div>

                  {/* probe type */}
                  <div className='form-control w-full'>
                    <label className='label flex-col items-start w-full mb-3'>
                      <span className='label-text text-wrap mb-2'>
                        <span className='font-medium text-red-500 mr-1'>*</span>
                        {t('probeType')}
                      </span>
                      <Select
                        options={mapOptions<OptionData, keyof OptionData>(
                          ProbeType,
                          'value',
                          'name'
                        )}
                        value={mapDefaultValue<OptionData, keyof OptionData>(
                          ProbeType,
                          String(formData.type),
                          'value',
                          'name'
                        )}
                        onChange={selectProbeType}
                        autoFocus={false}
                        menuPlacement='top'
                        className='react-select-container custom-menu-select z-[75] min-w-full'
                        classNamePrefix='react-select'
                      />
                    </label>
                  </div>
                </div>

                <div className='col-span-2 grid grid-cols-1'>
                  {/* probe location */}
                  <div className='form-control w-full'>
                    <label className='label flex-col items-start w-full mb-3'>
                      <span className='label-text text-wrap mb-2'>
                        <span className='font-medium text-red-500 mr-1'>*</span>
                        {t('probeLocation')}
                      </span>
                      <input
                        name='position'
                        type='text'
                        value={formData.position}
                        onChange={handleChange}
                        className='input  w-full'
                        maxLength={23}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 w-full'>
                {/* Deivce */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      <span className='font-medium text-red-500 mr-1'>*</span>
                      {t('delay')}
                    </span>
                    <Select
                      options={mapOptions<OptionData, keyof OptionData>(
                        delayTimeArray,
                        'value',
                        'name'
                      )}
                      value={mapDefaultValue<OptionData, keyof OptionData>(
                        delayTimeArray,
                        formData.stampTime || '0',
                        'value',
                        'name'
                      )}
                      onChange={delayTime}
                      autoFocus={false}
                      menuPlacement='top'
                      className='react-select-container custom-menu-select z-[75] min-w-full'
                      classNamePrefix='react-select'
                    />
                  </label>
                </div>
                {/* Deivce */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      <span className='font-medium text-red-500 mr-1'>*</span>
                      {t('door')}
                    </span>
                    <Select
                      options={mapOptions<OptionData, keyof OptionData>(
                        doorArray,
                        'value',
                        'name'
                      )}
                      value={mapDefaultValue<OptionData, keyof OptionData>(
                        doorArray,
                        String(formData.doorQty) || '0',
                        'value',
                        'name'
                      )}
                      onChange={doorSelected}
                      autoFocus={false}
                      menuPlacement='top'
                      className='react-select-container custom-menu-select z-[75] min-w-full'
                      classNamePrefix='react-select'
                    />
                  </label>
                </div>
                {/* Deivce */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      <span className='font-medium text-red-500 mr-1'>*</span>
                      {t('probeChanel')}
                    </span>
                    <Select
                      options={mapOptions<OptionData, keyof OptionData>(
                        channelArray,
                        'value',
                        'name'
                      )}
                      value={mapDefaultValue<OptionData, keyof OptionData>(
                        channelArray,
                        String(formData.channel) || '0',
                        'value',
                        'name'
                      )}
                      onChange={channelSelected}
                      autoFocus={false}
                      menuPlacement='top'
                      className='react-select-container custom-menu-select z-[75] min-w-full'
                      classNamePrefix='react-select'
                    />
                  </label>
                </div>
              </div>

              <div className='flex md:hidden flex-col items-center justify-center gap-3 mt-4 w-full'>
                <span>{t('tempMin')}</span>
                <div className='flex items-center justify-center gap-2 w-full'>
                  <button
                    className='btn btn-ghost bg-orange-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (formData.tempMin > -40) {
                        setFormData({
                          ...formData,
                          tempMin: parseFloat(
                            (formData.tempMin - 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    -
                  </button>
                  <input
                    autoFocus={false}
                    className='input  text-center w-full'
                    type='number'
                    step={0.01}
                    min={-40}
                    max={120}
                    value={formData.tempMin}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setFormData({
                          ...formData,
                          tempMin: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setFormData({ ...formData, tempMin: num })
                      }
                    }}
                  />
                  <button
                    className='btn btn-ghost bg-orange-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (formData.tempMin < 120) {
                        setFormData({
                          ...formData,
                          tempMin: parseFloat(
                            (formData.tempMin + 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className='flex md:hidden flex-col items-center justify-center gap-3 mt-4 w-full'>
                <span>{t('tempMax')}</span>
                <div className='flex items-center justify-center gap-2 w-full'>
                  <button
                    className='btn btn-ghost bg-orange-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (formData.tempMax > -40) {
                        setFormData({
                          ...formData,
                          tempMax: parseFloat(
                            (formData.tempMax - 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    -
                  </button>
                  <input
                    autoFocus={false}
                    className='input  text-center w-full'
                    type='number'
                    step={0.01}
                    value={formData.tempMax}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setFormData({
                          ...formData,
                          tempMax: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setFormData({ ...formData, tempMax: num })
                      }
                    }}
                  />
                  <button
                    className='btn btn-ghost bg-orange-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (formData.tempMax < 120) {
                        setFormData({
                          ...formData,
                          tempMax: parseFloat(
                            (formData.tempMax + 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className='flex md:hidden flex-col items-center justify-center gap-3 mt-4 w-full'>
                <span>{t('humiMin')}</span>
                <div className='flex items-center justify-center gap-2 w-full'>
                  <button
                    className='btn btn-ghost bg-blue-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (formData.humiMin > 0) {
                        setFormData({
                          ...formData,
                          humiMin: parseFloat(
                            (formData.humiMin - 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    -
                  </button>
                  <input
                    autoFocus={false}
                    className='input  text-center w-full'
                    type='number'
                    step={0.01}
                    value={formData.humiMin}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setFormData({
                          ...formData,
                          humiMin: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setFormData({ ...formData, humiMin: num })
                      }
                    }}
                  />
                  <button
                    className='btn btn-ghost bg-blue-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (formData.humiMin < 100) {
                        setFormData({
                          ...formData,
                          humiMin: parseFloat(
                            (formData.humiMin + 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className='flex md:hidden flex-col items-center justify-center gap-3 mt-4 w-full'>
                <span>{t('humiMax')}</span>
                <div className='flex items-center justify-center gap-2 w-full'>
                  <button
                    className='btn btn-ghost bg-blue-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (formData.humiMax > 0) {
                        setFormData({
                          ...formData,
                          humiMax: parseFloat(
                            (formData.humiMax - 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    -
                  </button>
                  <input
                    autoFocus={false}
                    className='input  text-center w-full'
                    type='number'
                    step={0.01}
                    value={formData.humiMax}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setFormData({
                          ...formData,
                          humiMax: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setFormData({ ...formData, humiMax: num })
                      }
                    }}
                  />
                  <button
                    className='btn btn-ghost bg-blue-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (formData.humiMax < 100) {
                        setFormData({
                          ...formData,
                          humiMax: parseFloat(
                            (formData.humiMax + 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className='md:grid grid-cols-1 hidden md:grid-cols-2 gap-4 mt-4 w-full'>
                {/* Temperature */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      {t('probeTempSubTb')}
                    </span>
                    <ReactSlider
                      className='relative flex items-center w-full h-2 bg-gray-300 rounded-field my-3'
                      thumbClassName='flex items-center justify-center'
                      trackClassName='bg-orange-500/20 h-2 rounded-field'
                      value={[formData.tempMin, formData.tempMax]}
                      onChange={values =>
                        setFormData({
                          ...formData,
                          tempMin: values[0],
                          tempMax: values[1]
                        })
                      }
                      pearling
                      minDistance={1}
                      step={0.01}
                      min={-40}
                      max={120}
                      renderThumb={(props, state) => {
                        const { key, ref, ...validProps } = props
                        return (
                          <div
                            {...validProps}
                            ref={ref as Ref<HTMLDivElement> | undefined}
                            key={key}
                            className='flex items-center justify-center w-[42px] h-[32px] bg-orange-500 text-white font-bold text-[12px] shadow-md rounded-field p-1 cursor-pointer outline-orange-500/50'
                          >
                            {state.valueNow}
                          </div>
                        )
                      }}
                    />
                  </label>
                </div>

                {/* Humidity */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      {t('probeHumiSubTb')}
                    </span>
                    <ReactSlider
                      className='relative flex items-center w-full h-2 bg-gray-300 rounded-field my-3'
                      thumbClassName='flex items-center justify-center'
                      trackClassName='bg-blue-500/20 h-2 rounded-field'
                      value={[formData.humiMin, formData.humiMax]}
                      onChange={values =>
                        setFormData({
                          ...formData,
                          humiMin: values[0],
                          humiMax: values[1]
                        })
                      }
                      pearling
                      minDistance={1}
                      step={0.01}
                      min={0}
                      max={100}
                      renderThumb={(props, state) => {
                        const { key, ref, ...validProps } = props
                        return (
                          <div
                            {...validProps}
                            ref={ref as Ref<HTMLDivElement> | undefined}
                            key={key}
                            className='flex items-center justify-center w-[42px] h-[32px] bg-blue-500 text-white font-bold text-[12px] shadow-md rounded-field p-1 cursor-pointer outline-blue-500/50'
                          >
                            {state.valueNow}
                          </div>
                        )
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className='md:grid grid-cols-1 hidden md:grid-cols-2 gap-4 mt-4 w-full'>
                {/* Temperature */}
                <div className='flex justify-between gap-2 w-full'>
                  <input
                    autoFocus={false}
                    className='input  text-center w-full'
                    type='number'
                    step={0.01}
                    min={-40}
                    max={120}
                    value={formData.tempMin}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setFormData({
                          ...formData,
                          tempMin: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setFormData({ ...formData, tempMin: num })
                      }
                    }}
                  />
                  <input
                    autoFocus={false}
                    className='input  text-center w-full'
                    type='number'
                    step={0.01}
                    value={formData.tempMax}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setFormData({
                          ...formData,
                          tempMax: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setFormData({ ...formData, tempMax: num })
                      }
                    }}
                  />
                </div>

                {/* Humidity */}
                <div className='flex justify-between gap-2 w-full'>
                  <input
                    autoFocus={false}
                    className='input  text-center w-full'
                    type='number'
                    step={0.01}
                    value={formData.humiMin}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setFormData({
                          ...formData,
                          humiMin: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setFormData({ ...formData, humiMin: num })
                      }
                    }}
                  />
                  <input
                    autoFocus={false}
                    className='input  text-center w-full'
                    type='number'
                    step={0.01}
                    value={formData.humiMax}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setFormData({
                          ...formData,
                          humiMax: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setFormData({ ...formData, humiMax: num })
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='divider divider-vertical xl:divider-horizontal'></div>
            <div className='w-full'>
              <h3 className='font-bold text-base'>
                {t('notificationSettings')}
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full'>
                {/* Right Column - 2/3 of the grid (70%) */}
                <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
                  {/* 1 */}
                  <div className='form-control w-full'>
                    <label className='label flex-col items-start w-full mb-3'>
                      <span className='label-text text-wrap mb-2'>
                        {t('choiceOne')}
                      </span>
                      <div className='flex flex-col gap-3'>
                        <label className='flex items-center gap-2'>
                          <input
                            type='radio'
                            // name='radio-1'
                            className='radio radio-primary'
                            checked={muteMode.choichOne === 'immediately'}
                            onChange={() =>
                              setMuteMode({
                                ...muteMode,
                                choichOne: 'immediately'
                              })
                            }
                          />
                          <span>{t('messageimmediately')}</span>
                        </label>
                        <label className='flex items-center gap-2'>
                          <input
                            type='radio'
                            // name='radio-1'
                            className='radio radio-primary'
                            checked={muteMode.choichOne === 'after'}
                            onChange={() =>
                              setMuteMode({ ...muteMode, choichOne: 'after' })
                            }
                          />
                          <span>{t('messageAfter')}</span>
                        </label>
                        {muteMode.choichOne === 'after' && (
                          <div className='join'>
                            <button
                              type='button'
                              className='btn join-item rounded-l-box'
                              onClick={() => {
                                if (sendTime.after > 5) {
                                  setSendTime({
                                    ...sendTime,
                                    after: sendTime.after - 5
                                  })
                                }
                              }}
                            >
                              -
                            </button>
                            <input
                              className='input  join-item'
                              type='number'
                              min={5}
                              max={30}
                              step={5}
                              value={sendTime.after}
                            />
                            <button
                              type='button'
                              className='btn join-item rounded-r-box'
                              onClick={() => {
                                if (sendTime.after < 30) {
                                  setSendTime({
                                    ...sendTime,
                                    after: sendTime.after + 5
                                  })
                                }
                              }}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* 2 */}
                  <div className='form-control w-full'>
                    <label className='label flex-col items-start w-full mb-3'>
                      <span className='label-text text-wrap mb-2'>
                        {t('choiceTwo')}
                      </span>
                      <div className='flex flex-col gap-3'>
                        <label className='flex items-center gap-2'>
                          <input
                            type='radio'
                            // name='radio-1'
                            className='radio radio-primary'
                            checked={muteMode.choichtwo === 'send'}
                            onChange={() =>
                              setMuteMode({ ...muteMode, choichtwo: 'send' })
                            }
                          />
                          <span>{t('messageSend')}</span>
                        </label>
                        <label className='flex items-center gap-2'>
                          <input
                            type='radio'
                            // name='radio-1'
                            className='radio radio-primary'
                            checked={muteMode.choichtwo === 'donotsend'}
                            onChange={() =>
                              setMuteMode({
                                ...muteMode,
                                choichtwo: 'donotsend'
                              })
                            }
                          />
                          <span>{t('messageDonotSend')}</span>
                        </label>
                      </div>
                    </label>
                  </div>
                </div>
                {/* Right Column - 2/3 of the grid (70%) */}
                <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
                  {/* 3 */}
                  <div className='form-control w-full'>
                    <label className='label flex-col items-start w-full mb-3'>
                      <span className='label-text text-wrap mb-2'>
                        {t('choiceThree')}
                      </span>
                      <div className='flex flex-col gap-3'>
                        <label className='flex items-center gap-2'>
                          <input
                            type='radio'
                            // name='radio-1'
                            className='radio radio-primary'
                            checked={muteMode.choichthree === 'onetime'}
                            onChange={() =>
                              setMuteMode({
                                ...muteMode,
                                choichthree: 'onetime'
                              })
                            }
                          />
                          <span>{t('messageOneTime')}</span>
                        </label>
                        <label className='flex items-center gap-2'>
                          <input
                            type='radio'
                            // name='radio-1'
                            className='radio radio-primary'
                            checked={muteMode.choichthree === 'every'}
                            onChange={() =>
                              setMuteMode({ ...muteMode, choichthree: 'every' })
                            }
                          />
                          <span>{t('messageEvery')}</span>
                        </label>
                        {muteMode.choichthree === 'every' && (
                          <div className='join'>
                            <button
                              type='button'
                              className='btn join-item rounded-l-box'
                              onClick={() => {
                                if (sendTime.every > 5) {
                                  setSendTime({
                                    ...sendTime,
                                    every: sendTime.every - 5
                                  })
                                }
                              }}
                            >
                              -
                            </button>
                            <input
                              className='input  join-item'
                              type='number'
                              min={5}
                              max={30}
                              step={5}
                              value={sendTime.every}
                            />
                            <button
                              type='button'
                              className='btn join-item rounded-r-box'
                              onClick={() => {
                                if (sendTime.every < 30) {
                                  setSendTime({
                                    ...sendTime,
                                    every: sendTime.every + 5
                                  })
                                }
                              }}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* 4 */}
                  <div className='form-control w-full'>
                    <label className='label flex-col items-start w-full mb-3'>
                      <span className='label-text text-wrap mb-2'>
                        {t('choiceFour')}
                      </span>
                      <div className='flex flex-col gap-3'>
                        <label className='flex items-center gap-2'>
                          <input
                            type='radio'
                            // name='radio-1'
                            className='radio radio-primary'
                            checked={muteMode.choichfour === 'off'}
                            onChange={() =>
                              setMuteMode({ ...muteMode, choichfour: 'off' })
                            }
                          />
                          <span>{t('messageOff')}</span>
                        </label>
                        <label className='flex items-center gap-2'>
                          <input
                            type='radio'
                            // name='radio-1'
                            className='radio radio-primary'
                            checked={muteMode.choichfour === 'on'}
                            onChange={() =>
                              setMuteMode({ ...muteMode, choichfour: 'on' })
                            }
                          />
                          <span>{t('messageOn')}</span>
                        </label>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className='divider divider-vertical opacity-50'>
                {t('scheduleTile')}
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 w-full'>
                <div className='form-control w-full items-center justify-center'>
                  <label className='label flex-col items-center justify-center w-full'>
                    <span className='label-text text-wrap mb-2'>
                      {t('firstDay')}
                    </span>
                    <Select
                      isDisabled={scheduleDay.firstDay === 'ALL'}
                      key={String(scheduleDay.firstDay)}
                      options={filterOptions(
                        mapOptions<Schedule, keyof Schedule>(
                          scheduleDayArray,
                          'scheduleKey',
                          'scheduleLabel'
                        ),
                        [
                          String(scheduleDay.seccondDay),
                          String(scheduleDay.thirdDay)
                        ]
                      )}
                      value={mapDefaultValue<Schedule, keyof Schedule>(
                        scheduleDayArray,
                        String(scheduleDay.firstDay),
                        'scheduleKey',
                        'scheduleLabel'
                      )}
                      onChange={e => getScheduleDay(e, 'firstDay')}
                      autoFocus={false}
                      menuPlacement='top'
                      className='react-select-container custom-menu-select z-[75] min-w-full'
                      classNamePrefix='react-select'
                    />
                  </label>
                </div>
                <div className='form-control w-full items-center justify-center'>
                  <label className='label flex-col items-center justify-center w-full'>
                    <span className='label-text text-wrap mb-2'>
                      {t('seccondDay')}
                    </span>
                    <Select
                      isDisabled={scheduleDay.seccondDay === 'ALL'}
                      key={String(scheduleDay.seccondDay)}
                      options={filterOptions(
                        mapOptions<Schedule, keyof Schedule>(
                          scheduleDayArray,
                          'scheduleKey',
                          'scheduleLabel'
                        ),
                        [
                          String(scheduleDay.firstDay),
                          String(scheduleDay.thirdDay)
                        ]
                      )}
                      value={mapDefaultValue<Schedule, keyof Schedule>(
                        scheduleDayArray,
                        String(scheduleDay.seccondDay),
                        'scheduleKey',
                        'scheduleLabel'
                      )}
                      onChange={e => getScheduleDay(e, 'seccondDay')}
                      autoFocus={false}
                      menuPlacement='top'
                      className='react-select-container custom-menu-select z-[75] min-w-full'
                      classNamePrefix='react-select'
                    />
                  </label>
                </div>
                <div className='form-control w-full items-center justify-center'>
                  <label className='label flex-col items-center justify-center w-full'>
                    <span className='label-text text-wrap mb-2'>
                      {t('thirdDay')}
                    </span>
                    <Select
                      isDisabled={scheduleDay.thirdDay === 'ALL'}
                      key={String(scheduleDay.thirdDay)}
                      options={filterOptions(
                        mapOptions<Schedule, keyof Schedule>(
                          scheduleDayArray,
                          'scheduleKey',
                          'scheduleLabel'
                        ),
                        [
                          String(scheduleDay.firstDay),
                          String(scheduleDay.seccondDay)
                        ]
                      )}
                      value={mapDefaultValue<Schedule, keyof Schedule>(
                        scheduleDayArray,
                        String(scheduleDay.thirdDay),
                        'scheduleKey',
                        'scheduleLabel'
                      )}
                      onChange={e => getScheduleDay(e, 'thirdDay')}
                      autoFocus={false}
                      menuPlacement='top'
                      className='react-select-container custom-menu-select z-[75] min-w-full'
                      classNamePrefix='react-select'
                    />
                  </label>
                </div>
                <div className='form-control w-full items-center justify-center'>
                  <label className='label flex-col items-center justify-center'>
                    <span className='label-text text-wrap mb-2'>
                      {t('everyDays')}
                    </span>
                    <input
                      type='checkbox'
                      className='toggle toggle-md'
                      checked={
                        scheduleDay.firstDay === 'ALL' &&
                        scheduleDay.seccondDay === 'ALL' &&
                        scheduleDay.thirdDay === 'ALL'
                      }
                      onClick={() => {
                        if (
                          scheduleDay.firstDay === 'ALL' &&
                          scheduleDay.seccondDay === 'ALL' &&
                          scheduleDay.thirdDay === 'ALL'
                        ) {
                          setScheduleDay({
                            firstDay: '',
                            seccondDay: '',
                            thirdDay: ''
                          })
                        } else {
                          setScheduleDay({
                            firstDay: 'ALL',
                            seccondDay: 'ALL',
                            thirdDay: 'ALL'
                          })
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5 w-full'>
                <span className='label-text text-wrap mb-2'>
                  {t('firstTime')}
                </span>
                <Select
                  // key={String(scheduleTime.firstTime)}
                  options={filterOptions(
                    mapOptions<ScheduleHour, keyof ScheduleHour>(
                      scheduleTimeArray,
                      'scheduleHourKey',
                      'scheduleHourLabel'
                    ),
                    [
                      String(scheduleTime.secondTime),
                      String(scheduleTime.thirdTime)
                    ]
                  )}
                  value={mapDefaultValue<ScheduleHour, keyof ScheduleHour>(
                    scheduleTimeArray,
                    String(scheduleTime.firstTime),
                    'scheduleHourKey',
                    'scheduleHourLabel'
                  )}
                  onChange={e => getScheduleTime(e, 'firstTime')}
                  autoFocus={false}
                  menuPlacement='top'
                  className='react-select-container custom-menu-select z-[75] min-w-full'
                  classNamePrefix='react-select'
                />
                <Select
                  isDisabled={scheduleTime.firstTime === 'OFF'}
                  // key={String(scheduleTime.firstMinute)}
                  options={mapOptions<ScheduleMinute, keyof ScheduleMinute>(
                    scheduleMinuteArray,
                    'scheduleMinuteKey',
                    'scheduleMinuteLabel'
                  )}
                  value={mapDefaultValue<ScheduleMinute, keyof ScheduleMinute>(
                    scheduleMinuteArray,
                    String(scheduleTime.firstMinute),
                    'scheduleMinuteKey',
                    'scheduleMinuteLabel'
                  )}
                  onChange={e => getScheduleTimeMinute(e, 'firstTimeMinute')}
                  autoFocus={false}
                  menuPlacement='top'
                  className='react-select-container custom-menu-select z-[75] min-w-full'
                  classNamePrefix='react-select'
                />
              </div>

              <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 w-full'>
                <span className='label-text text-wrap mb-2'>
                  {t('seccondTime')}
                </span>
                <Select
                  options={filterOptions(
                    mapOptions<ScheduleHour, keyof ScheduleHour>(
                      scheduleTimeArray,
                      'scheduleHourKey',
                      'scheduleHourLabel'
                    ),
                    [
                      String(scheduleTime.firstTime),
                      String(scheduleTime.thirdTime)
                    ]
                  )}
                  value={mapDefaultValue<ScheduleHour, keyof ScheduleHour>(
                    scheduleTimeArray,
                    String(scheduleTime.secondTime),
                    'scheduleHourKey',
                    'scheduleHourLabel'
                  )}
                  onChange={e => getScheduleTime(e, 'seccondTime')}
                  autoFocus={false}
                  menuPlacement='top'
                  className='react-select-container custom-menu-select z-[75] min-w-full'
                  classNamePrefix='react-select'
                />
                <Select
                  isDisabled={scheduleTime.secondTime === 'OFF'}
                  // key={String(scheduleTime.firstMinute)}
                  options={mapOptions<ScheduleMinute, keyof ScheduleMinute>(
                    scheduleMinuteArray,
                    'scheduleMinuteKey',
                    'scheduleMinuteLabel'
                  )}
                  value={mapDefaultValue<ScheduleMinute, keyof ScheduleMinute>(
                    scheduleMinuteArray,
                    String(scheduleTime.seccondMinute),
                    'scheduleMinuteKey',
                    'scheduleMinuteLabel'
                  )}
                  onChange={e => getScheduleTimeMinute(e, 'seccondTimeMinute')}
                  autoFocus={false}
                  menuPlacement='top'
                  className='react-select-container custom-menu-select z-[75] min-w-full'
                  classNamePrefix='react-select'
                />
              </div>

              <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 w-full'>
                <span className='label-text text-wrap mb-2'>
                  {t('thirdTime')}
                </span>
                <Select
                  // key={String(scheduleTime.firstTime)}
                  options={filterOptions(
                    mapOptions<ScheduleHour, keyof ScheduleHour>(
                      scheduleTimeArray,
                      'scheduleHourKey',
                      'scheduleHourLabel'
                    ),
                    [
                      String(scheduleTime.firstTime),
                      String(scheduleTime.secondTime)
                    ]
                  )}
                  value={mapDefaultValue<ScheduleHour, keyof ScheduleHour>(
                    scheduleTimeArray,
                    String(scheduleTime.thirdTime),
                    'scheduleHourKey',
                    'scheduleHourLabel'
                  )}
                  onChange={e => getScheduleTime(e, 'thirdTime')}
                  autoFocus={false}
                  menuPlacement='top'
                  className='react-select-container custom-menu-select z-[75] min-w-full'
                  classNamePrefix='react-select'
                />
                <Select
                  isDisabled={scheduleTime.thirdTime === 'OFF'}
                  // key={String(scheduleTime.firstMinute)}
                  options={mapOptions<ScheduleMinute, keyof ScheduleMinute>(
                    scheduleMinuteArray,
                    'scheduleMinuteKey',
                    'scheduleMinuteLabel'
                  )}
                  value={mapDefaultValue<ScheduleMinute, keyof ScheduleMinute>(
                    scheduleMinuteArray,
                    String(scheduleTime.thirdMinute),
                    'scheduleMinuteKey',
                    'scheduleMinuteLabel'
                  )}
                  onChange={e => getScheduleTimeMinute(e, 'thirdTimeMinute')}
                  autoFocus={false}
                  menuPlacement='top'
                  className='react-select-container custom-menu-select z-[75] min-w-full'
                  classNamePrefix='react-select'
                />
              </div>
            </div>
            {/* <div className='divider divider-vertical xl:divider-horizontal'></div>
            <div className='w-full'>
              <h3 className='font-bold text-base'>{t('muteSettings')}</h3>
            </div> */}
          </div>

          {/* Modal Actions */}
          <div className='modal-action mt-6'>
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
            <button type='submit' className='btn btn-neutral'>
              {t('submitButton')}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  )
}

export default ManageProbe
