import {
  FormEvent,
  Ref,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react'
import { ProbeType } from '../../types/smtrack/probe/probeType'
import {
  RiArrowDownLine,
  RiArrowRightLine,
  RiCloseLargeLine,
  RiSettings4Fill,
  RiSettings4Line,
  RiSmartphoneFill,
  RiSmartphoneLine,
  RiVolumeUpFill,
  RiVolumeUpLine
} from 'react-icons/ri'
import { useTranslation } from 'react-i18next'
import { Option } from '../../types/global/hospitalAndWard'
import Select from 'react-select'
import ReactSlider from 'react-slider'
import { client } from '../../services/mqtt'
import { useDispatch, useSelector } from 'react-redux'
import {
  setSubmitLoading,
  setTokenExpire
} from '../../redux/actions/utilsActions'
import Swal from 'sweetalert2'
import axiosInstance from '../../constants/axios/axiosInstance'
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import { ProbeListType } from '../../types/tms/devices/probeType'
import { AxiosError } from 'axios'
import AppMute from './appMute'
import Loading from '../skeleton/table/loading'
import {
  generateOptions,
  generateOptionsOne,
  generateOptionsTwo
} from '../../constants/utils/muteNoti'
import { RootState } from '../../redux/reducers/rootReducer'
import { cookies } from '../../constants/utils/utilsConstants'

type AdjustmentsProps = {
  setProbeData: (value: SetStateAction<ProbeType[]>) => void
  openAdjustModalRef: RefObject<HTMLDialogElement | null>
  probe: ProbeType[]
  serial: string
  fetchDevices: (page: number, size?: number) => Promise<void>
}

interface MqttType {
  tempAlarm: string
  tempTemporary: string | boolean
  tempDuration: string
  doorAlarm: string
  doorDuration: string
}

interface selectOption {
  value: string
  label: string
}

const Adjustments = (props: AdjustmentsProps) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { tokenDecode } = useSelector((state: RootState) => state.utils)
  const { openAdjustModalRef, probe, serial, setProbeData, fetchDevices } =
    props
  const [selectedProbe, setSelectedProbe] = useState<string>('')
  const [adjustmentsForm, setAdjustmentsForm] = useState({
    tempMin: 0,
    tempMax: 0,
    humiMin: 0,
    humiMax: 0,
    adjustTemp: 0,
    adjustHumi: 0
  })
  const [mqData, setMqData] = useState({ temp: 0, humi: 0 })
  const [muteDoor, setMuteDoor] = useState<MqttType>({
    tempAlarm: '',
    tempTemporary: '',
    tempDuration: '',
    doorAlarm: '',
    doorDuration: ''
  })
  const [muteDoorSelect, setMuteDoorSelect] = useState<MqttType>({
    tempAlarm: '',
    tempTemporary: false,
    tempDuration: '',
    doorAlarm: '',
    doorDuration: ''
  })
  const deviceModel = serial.substring(0, 3) === 'eTP' ? 'etemp' : 'items'
  const version = serial.substring(3, 5).toLowerCase()
  const [probeBefore, setProbeBefore] = useState<ProbeType | undefined>(
    undefined
  )
  const [beforeSelectProbe, setBeforeSelectProbe] = useState<string>('1')
  const [tab, setTab] = useState(1)
  const [muteEtemp, setMuteEtemp] = useState({
    duration: cookies.get(serial) === 'duration' || false,
    door: false
  })
  const [probeFiltered, setProbeFiltered] = useState<ProbeType | undefined>()
  const { role } = tokenDecode ?? {}
  const { doorAlarm, doorDuration, tempDuration, tempTemporary, tempAlarm } =
    muteDoor

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
  const [isLoadingMqtt, setIsLoadingMqtt] = useState(false)
  const [isLoadingMuteMqtt, setIsLoadingMuteMqtt] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    const body = {
      tempMin: adjustmentsForm.tempMin,
      tempMax: adjustmentsForm.tempMax,
      humiMin: adjustmentsForm.humiMin,
      humiMax: adjustmentsForm.humiMax,
      tempAdj: adjustmentsForm.adjustTemp,
      humiAdj: adjustmentsForm.adjustHumi
    }
    try {
      await axiosInstance.put<responseType<ProbeListType>>(
        `/devices/probe/${selectedProbe}`,
        body
      )
      openAdjustModalRef.current?.close()
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: t('submitSuccess'),
        icon: 'success',
        showConfirmButton: false,
        timer: 2500
      }).finally(async () => {
        await fetchDevices(1, 10)
        openAdjustModalRef.current?.showModal()
        client.publish(
          `siamatic/${deviceModel}/${version}/${serial}/adj`,
          'on'
        )
      })
    } catch (error) {
      openAdjustModalRef.current?.close()
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
        }).finally(() => openAdjustModalRef.current?.showModal())
      } else {
        console.error(error)
        Swal.fire({
          title: t('alertHeaderError'),
          text: t('descriptionErrorWrong'),
          icon: 'error',
          showConfirmButton: false,
          timer: 2500
        }).finally(() => openAdjustModalRef.current?.showModal())
      }
    } finally {
      dispatch(setSubmitLoading())
    }
  }

  const handleSubmitAppSetting = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    const body = {
      firstDay: scheduleDay.firstDay,
      secondDay: scheduleDay.seccondDay,
      thirdDay: scheduleDay.thirdDay,
      firstTime: `${scheduleTime.firstTime}${scheduleTime.firstMinute}`,
      secondTime: `${scheduleTime.secondTime}${scheduleTime.seccondMinute}`,
      thirdTime: `${scheduleTime.thirdTime}${scheduleTime.thirdMinute}`,
      notiDelay: muteMode.choichOne === 'immediately' ? 0 : sendTime.after,
      notiMobile: muteMode.choichfour === 'on' ? true : false,
      notiRepeat: muteMode.choichthree === 'onetime' ? 0 : sendTime.every,
      notiToNormal: muteMode.choichtwo === 'send' ? true : false
    }
    try {
      await axiosInstance.put<responseType<ProbeListType>>(
        `/devices/probe/${selectedProbe}`,
        body
      )
      openAdjustModalRef.current?.close()
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: t('submitSuccess'),
        icon: 'success',
        showConfirmButton: false,
        timer: 2500
      }).finally(async () => {
        await fetchDevices(1, 10)
        openAdjustModalRef.current?.showModal()
        client.publish(
          `siamatic/${deviceModel}/${version}/${serial}/adj`,
          'on'
        )
      })
    } catch (error) {
      openAdjustModalRef.current?.close()
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
        }).finally(() => openAdjustModalRef.current?.showModal())
      } else {
        console.error(error)
        Swal.fire({
          title: t('alertHeaderError'),
          text: t('descriptionErrorWrong'),
          icon: 'error',
          showConfirmButton: false,
          timer: 2500
        }).finally(() => openAdjustModalRef.current?.showModal())
      }
    } finally {
      dispatch(setSubmitLoading())
    }
  }

  const muteAlways = (status: boolean) => {
    const filter = probe
      .filter(item => item.id === selectedProbe)
      .find(item => item) as ProbeType
    if (status) {
      client.publish(
        `siamatic/${deviceModel}/${version}/${serial}/${filter.channel}/mute/temp/duration`,
        muteDoorSelect.tempDuration
      )
      resetSelct('tempDuration')
    } else {
      client.publish(
        `siamatic/${deviceModel}/${version}/${serial}/${filter.channel}/mute/temp/duration`,
        '0'
      )
    }
  }

  const muteAlarm = () => {
    const filter = probe
      .filter(item => item.id === selectedProbe)
      .find(item => item) as ProbeType
    setMuteEtemp({ ...muteEtemp, door: !muteEtemp.door })
    if (!muteEtemp.door) {
      client.publish(
        `siamatic/${deviceModel}/${version}/${serial}/${filter.channel}/mute/door/sound`,
        'on'
      )
      client.publish(`${serial}/mute/long`, 'on')
    } else {
      client.publish(
        `siamatic/${deviceModel}/${version}/${serial}/${filter.channel}/mute/door/sound`,
        'off'
      )
      client.publish(`${serial}/mute/long`, 'off')
    }
  }

  const muteAlert = (status: boolean) => {
    const filter = probe
      .filter(item => item.id === selectedProbe)
      .find(item => item) as ProbeType
    if (status) {
      client.publish(
        `siamatic/${deviceModel}/${version}/${serial}/${filter.channel}/mute/door/alarm`,
        muteDoorSelect.doorAlarm
      )
      resetSelct('doorAlarm')
    } else {
      client.publish(
        `siamatic/${deviceModel}/${version}/${serial}/${filter.channel}/mute/door/alarm`,
        '0'
      )
    }
  }

  const resetSelct = (text: string) => {
    text === 'tempDuration'
      ? setMuteDoorSelect({ ...muteDoorSelect, tempDuration: '' })
      : text === 'doorAlarm'
      ? setMuteDoorSelect({ ...muteDoorSelect, doorAlarm: '' })
      : setMuteDoorSelect({ ...muteDoorSelect, doorDuration: '' })
  }

  const muteTemporary = () => {
    const filter = probe
      .filter(item => item.id === selectedProbe)
      .find(item => item) as ProbeType
    setMuteDoorSelect({
      ...muteDoorSelect,
      tempTemporary: !muteDoorSelect.tempTemporary
    })
    if (!muteDoorSelect.tempTemporary) {
      client.publish(
        `siamatic/${deviceModel}/${version}/${serial}/${filter.channel}/mute/temp/temporary`,
        'on'
      )
      client.publish(`${serial}/mute/short`, 'on')
    } else {
      client.publish(
        `siamatic/${deviceModel}/${version}/${serial}/${filter.channel}/mute/temp/temporary`,
        'off'
      )
      client.publish(`${serial}/mute/short`, 'off')
    }
  }

  const muteDoorDuration = (status: boolean) => {
    const filter = probe
      .filter(item => item.id === selectedProbe)
      .find(item => item) as ProbeType
    if (status) {
      client.publish(
        `siamatic/${deviceModel}/${version}/${serial}/${filter.channel}/door/alarm/duration`,
        muteDoorSelect.doorDuration
      )
      resetSelct('doorDuration')
    }
  }

  const mapOptions = <T, K extends keyof T>(
    data: T[],
    valueKey: K,
    labelKey: K
  ): Option[] =>
    data.map(item => ({
      value: item[valueKey] as unknown as string,
      label: (item[labelKey] as unknown as string) ?? t('nameNotRegister')
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
        label: (item[labelKey] as unknown as string) ?? t('nameNotRegister')
      }))[0]

  const resetForm = useCallback(() => {
    const filter = probe
      .filter(item => item.id === selectedProbe)
      .find(item => item)
    client.publish(
      `siamatic/${deviceModel}/${version}/${serial}/${probeFiltered?.channel}/temp`,
      'off'
    )
    client.unsubscribe(
      `${serial}/${probeFiltered?.channel}/mute/status/receive`
    )
    client.unsubscribe(`${serial}/${filter?.channel}/temp/real`)
    client.unsubscribe(`${serial}/${filter?.channel}/mute/status/receive`)

    // รอลบ
    client.publish(`siamatic/${deviceModel}/${version}/${serial}/temp`, 'off')
    client.unsubscribe(`${serial}/mute/status/receive`)
    client.unsubscribe(`${serial}/temp/real`)
    client.unsubscribe(`${serial}/mute/status/receive`)
    client.publish(`${serial}/temp`, 'off')
    //

    setAdjustmentsForm({
      tempMin: 0,
      tempMax: 0,
      humiMin: 0,
      humiMax: 0,
      adjustTemp: 0,
      adjustHumi: 0
    })
    setSelectedProbe('')
    setMqData({ temp: 0, humi: 0 })
    setTab(1)
    setProbeData([])
    openAdjustModalRef.current?.close()
  }, [probeFiltered])

  useEffect(() => {
    const filter = probe
      .filter(item => item.id === selectedProbe)
      .find(item => item) as ProbeType
    setMuteEtemp({
      ...muteEtemp,
      door: filter?.doorSound,
      duration: filter?.muteDoorAlarmDuration === 'duration' || false
    })
  }, [probe, selectedProbe])

  useEffect(() => {
    if (tempTemporary === 'on') {
      setMuteDoorSelect({ ...muteDoorSelect, tempTemporary: !tempTemporary })
    }
  }, [tempTemporary])

  useEffect(() => {
    if (tab === 2) {
      const filter = probe
        .filter(item => item.id === selectedProbe)
        .find(item => item) as ProbeType
      setMuteMode({
        choichOne: filter?.notiDelay < 5 ? 'immediately' : 'after',
        choichtwo: filter?.notiToNormal ? 'send' : 'donotsend',
        choichthree: filter?.notiRepeat < 5 ? 'onetime' : 'every',
        choichfour: filter?.notiMobile ? 'on' : 'off'
      })
      setSendTime({
        after: filter?.notiDelay < 5 ? 5 : filter?.notiDelay,
        every: filter?.notiRepeat < 5 ? 5 : filter?.notiRepeat
      })
      setScheduleDay({
        firstDay: filter?.firstDay,
        seccondDay: filter?.secondDay,
        thirdDay: filter?.thirdDay
      })
      setScheduleTime({
        firstTime: filter?.firstTime.substring(0, 2),
        secondTime: filter?.secondTime.substring(0, 2),
        thirdTime: filter?.thirdTime.substring(0, 2),
        firstMinute: filter?.firstTime.substring(2, 4),
        seccondMinute: filter?.secondTime.substring(2, 4),
        thirdMinute: filter?.thirdTime.substring(2, 4)
      })
    }
  }, [tab, probe, selectedProbe])

  useEffect(() => {
    if (selectedProbe === '' && probe.length > 0) {
      setSelectedProbe(probe[0]?.id)
    }
  }, [probe])

  useEffect(() => {
    if (selectedProbe !== '' && probeFiltered) {
      if (tab === 1) {
        client.unsubscribe(
          `${serial}/${probeFiltered?.channel}/mute/status/receive`
        )

        // รอลบ
        client.unsubscribe(`${serial}/mute/status/receive`)
        //

        if (beforeSelectProbe && beforeSelectProbe !== probeFiltered?.channel) {
          client.publish(
            `siamatic/${deviceModel}/${version}/${serial}/${beforeSelectProbe}/temp`,
            'off'
          )

          // รอลบ
          client.publish(
            `siamatic/${deviceModel}/${version}/${serial}/temp`,
            'off'
          )
          client.publish(`${serial}/temp`, 'off')
          //

          client.unsubscribe(`${serial}/${beforeSelectProbe}/temp/real`)

          // รอลบ
          client.unsubscribe(`${serial}/temp/real`)
          //
        }

        setAdjustmentsForm({
          tempMin: probeFiltered?.tempMin ?? 0,
          tempMax: probeFiltered?.tempMax ?? 0,
          humiMin: probeFiltered?.humiMin ?? 0,
          humiMax: probeFiltered?.humiMax ?? 0,
          adjustTemp: probeFiltered?.tempAdj ?? 0,
          adjustHumi: probeFiltered?.humiAdj ?? 0
        })
        setProbeBefore(probeFiltered)

        client.subscribe(
          `${serial}/${probeFiltered?.channel}/temp/real`,
          err => {
            if (err) console.error('MQTT Subscribe Error', err)
          }
        )
        client.subscribe(`${serial}/temp/real`, err => {
          if (err) console.error('MQTT Subscribe Error', err)
        })

        setIsLoadingMqtt(true)

        client.publish(
          `siamatic/${deviceModel}/${version}/${serial}/${probeFiltered.channel}/temp`,
          'on'
        )

        // รอลบ
        client.publish(
          `siamatic/${deviceModel}/${version}/${serial}/temp`,
          'on'
        )
        client.publish(`${serial}/temp`, 'on')
        //

        setBeforeSelectProbe(probeFiltered?.channel)

        client.on('message', (_topic, message) => {
          setMqData(JSON.parse(message.toString()))
          setIsLoadingMqtt(false)
        })

        client.on('error', err => {
          console.error('MQTT Error: ', err)
          client.end()
        })

        client.on('reconnect', () => {
          console.error('MQTT Reconnecting...')
        })
      } else if (tab === 3) {
        client.publish(
          `siamatic/${deviceModel}/${version}/${serial}/${probeFiltered.channel}/temp`,
          'off'
        )
        client.unsubscribe(`${serial}/${probeFiltered?.channel}/temp/real`)

        client.subscribe(
          `${serial}/${probeFiltered?.channel}/mute/status/receive`,
          err => {
            if (err) console.error('MQTT Subscribe Error', err)
          }
        )

        client.publish(
          `siamatic/${deviceModel}/${version}/${serial}/${probeFiltered?.channel}/mute/status`,
          'on'
        )

        // รอลบ
        client.publish(
          `siamatic/${deviceModel}/${version}/${serial}/temp`,
          'off'
        )
        client.publish(`${serial}/temp`, 'off')
        client.unsubscribe(`${serial}/temp/real`)

        client.subscribe(`${serial}/mute/status/receive`, err => {
          if (err) console.error('MQTT Subscribe Error', err)
        })

        setIsLoadingMuteMqtt(true)
        client.publish(
          `siamatic/${deviceModel}/${version}/${serial}/mute/status`,
          'on'
        )
        //

        client.on('message', (_topic, message) => {
          setMuteDoor(JSON.parse(message.toString()))
          setIsLoadingMuteMqtt(false)
        })

        client.on('error', err => {
          console.error('MQTT Error: ', err)
          client.end()
        })

        client.on('reconnect', () => {
          console.error('MQTT Reconnecting...')
        })
      }
    }
  }, [probe, selectedProbe, serial, tab, probeFiltered, beforeSelectProbe])

  useEffect(() => {
    const filter = probe
      .filter(item => item.id === selectedProbe)
      .find(item => item)
    setProbeFiltered(filter)
  }, [probe, selectedProbe])

  return (
    <dialog ref={openAdjustModalRef} className='modal overflow-y-scroll py-10'>
      <form
        onSubmit={tab === 1 ? handleSubmit : handleSubmitAppSetting}
        className='modal-box md:w-5/6 max-w-[50rem] h-max max-h-max'
      >
        <div className='flex items-center justify-between gap-2'>
          <h3 className='font-bold text-base'>{serial}</h3>
          <button
            type='button'
            name='close-modal'
            aria-label={t('closeButton')}
            className='btn btn-ghost outline-none flex p-0 min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] duration-300 ease-linear'
            onClick={resetForm}
          >
            <RiCloseLargeLine size={20} />
          </button>
        </div>
        <div className='divider divider-vertical my-2'></div>

        <div className='form-control w-full'>
          <label className='label flex-col items-start'>
            <span className='label-text mb-2'>{t('selectProbe')}</span>
            <Select
              options={mapOptions<ProbeType, keyof ProbeType>(
                probe,
                'id',
                'name'
              )}
              value={mapDefaultValue<ProbeType, keyof ProbeType>(
                probe,
                selectedProbe,
                'id',
                'name'
              )}
              onChange={e => {
                setSelectedProbe(String(e?.value))
              }}
              autoFocus={false}
              className='react-select-container z-[150] custom-menu-select w-full'
              classNamePrefix='react-select'
            />
          </label>
        </div>

        <div role='tablist' className='tabs tabs-bordered mt-3'>
          <a
            role='tab'
            className={`tab ${
              tab === 1 ? 'tab-active' : ''
            } flex items-center gap-2`}
            onClick={() => setTab(1)}
          >
            {tab === 1 ? (
              <RiSettings4Fill size={24} />
            ) : (
              <RiSettings4Line size={24} />
            )}
            <span className='hidden md:block sm:text-sm lg:text-base font-bold'>
              {t('adjustMents')}
            </span>
          </a>
          <a
            role='tab'
            className={`tab ${
              tab === 2 ? 'tab-active' : ''
            } flex items-center gap-2`}
            onClick={() => setTab(2)}
          >
            {tab === 2 ? (
              <RiSmartphoneFill size={24} />
            ) : (
              <RiSmartphoneLine size={24} />
            )}
            <span className='hidden md:block sm:text-sm lg:text-base font-bold'>
              {t('notificationSettings')}
            </span>
          </a>
          <a
            role='tab'
            className={`tab ${
              tab === 3 ? 'tab-active' : ''
            } flex items-center gap-2`}
            onClick={() => setTab(3)}
          >
            {tab === 3 ? (
              <RiVolumeUpFill size={24} />
            ) : (
              <RiVolumeUpLine size={24} />
            )}
            <span className='hidden md:block sm:text-sm lg:text-base font-bold'>
              {t('muteSetting')}
            </span>
          </a>
        </div>

        {tab === 1 ? (
          <div>
            <div className='mt-3'>
              <h3 className='font-bold text-base'>{t('adjustMents')}</h3>
              <div className='flex md:hidden flex-col items-center justify-center gap-3 mt-4 w-full'>
                <span>{t('tempMin')}</span>
                <label className='flex items-center justify-center gap-2 w-full'>
                  <button
                    className='btn btn-ghost bg-orange-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (
                        adjustmentsForm.tempMin >
                        (probeFiltered?.name === 'PT100' ? -180 : -40)
                      ) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          tempMin: parseFloat(
                            (adjustmentsForm.tempMin - 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    -
                  </button>
                  <input
                    name='tempMin'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    min={probeFiltered?.name === 'PT100' ? -180 : -40}
                    max={probeFiltered?.name === 'PT100' ? 200 : 120}
                    value={adjustmentsForm.tempMin}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          tempMin: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({ ...adjustmentsForm, tempMin: num })
                      }
                    }}
                  />
                  <button
                    className='btn btn-ghost bg-orange-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (
                        adjustmentsForm.tempMin <
                        (probeFiltered?.name === 'PT100' ? 200 : 120)
                      ) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          tempMin: parseFloat(
                            (adjustmentsForm.tempMin + 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    +
                  </button>
                </label>
              </div>

              <div className='flex md:hidden flex-col items-center justify-center gap-3 mt-4 w-full'>
                <span>{t('tempMax')}</span>
                <label className='flex items-center justify-center gap-2 w-full'>
                  <button
                    className='btn btn-ghost bg-orange-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (
                        adjustmentsForm.tempMax >
                        (probeFiltered?.name === 'PT100' ? -180 : -40)
                      ) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          tempMax: parseFloat(
                            (adjustmentsForm.tempMax - 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    -
                  </button>
                  <input
                    name='tempMax'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    min={probeFiltered?.name === 'PT100' ? -180 : -40}
                    max={probeFiltered?.name === 'PT100' ? 200 : 120}
                    value={adjustmentsForm.tempMax}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          tempMax: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({ ...adjustmentsForm, tempMax: num })
                      }
                    }}
                  />
                  <button
                    className='btn btn-ghost bg-orange-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (
                        adjustmentsForm.tempMax <
                        (probeFiltered?.name === 'PT100' ? 200 : 120)
                      ) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          tempMax: parseFloat(
                            (adjustmentsForm.tempMax + 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    +
                  </button>
                </label>
              </div>

              <div className='flex md:hidden flex-col items-center justify-center gap-3 mt-4 w-full'>
                <span>{t('humiMin')}</span>
                <label className='flex items-center justify-center gap-2 w-full'>
                  <button
                    className='btn btn-ghost bg-blue-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (adjustmentsForm.humiMin > 0) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          humiMin: parseFloat(
                            (adjustmentsForm.humiMin - 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    -
                  </button>
                  <input
                    name='humiMin'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    min={0}
                    max={100}
                    value={adjustmentsForm.humiMin}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          humiMin: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({ ...adjustmentsForm, humiMin: num })
                      }
                    }}
                  />
                  <button
                    className='btn btn-ghost bg-blue-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (adjustmentsForm.humiMin < 100) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          humiMin: parseFloat(
                            (adjustmentsForm.humiMin + 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    +
                  </button>
                </label>
              </div>

              <div className='flex md:hidden flex-col items-center justify-center gap-3 mt-4 w-full'>
                <span>{t('humiMax')}</span>
                <label className='flex items-center justify-center gap-2 w-full'>
                  <button
                    className='btn btn-ghost bg-blue-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (adjustmentsForm.humiMax > 0) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          humiMax: parseFloat(
                            (adjustmentsForm.humiMax - 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    -
                  </button>
                  <input
                    name='humiMax'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    min={0}
                    max={100}
                    value={adjustmentsForm.humiMax}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          humiMax: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({ ...adjustmentsForm, humiMax: num })
                      }
                    }}
                  />
                  <button
                    className='btn btn-ghost bg-blue-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (adjustmentsForm.humiMax < 100) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          humiMax: parseFloat(
                            (adjustmentsForm.humiMax + 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    +
                  </button>
                </label>
              </div>

              <div className='md:grid grid-cols-1 hidden md:grid-cols-2 gap-4 mt-4 w-full'>
                {/* Temperature */}
                <div className='form-control w-full'>
                  <div className='label flex-col items-start'>
                    <span className='label-text mb-2'>
                      {t('probeTempSubTb')}
                    </span>
                    <ReactSlider
                      aria-label={t('Temperature-min-max')}
                      className='relative flex items-center w-full h-2 bg-gray-300 rounded-btn my-3'
                      thumbClassName='flex items-center justify-center'
                      trackClassName='bg-orange-500/20 h-2 rounded-btn'
                      value={[adjustmentsForm.tempMin, adjustmentsForm.tempMax]}
                      onChange={values =>
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          tempMin: values[0],
                          tempMax: values[1]
                        })
                      }
                      pearling
                      minDistance={1}
                      step={0.01}
                      min={probeFiltered?.name === 'PT100' ? -180 : -40}
                      max={probeFiltered?.name === 'PT100' ? 200 : 120}
                      renderThumb={(props, state) => {
                        const { key, ref, ...validProps } = props
                        return (
                          <div
                            {...validProps}
                            ref={ref as Ref<HTMLDivElement> | undefined}
                            key={key}
                            className='flex items-center justify-center w-[42px] h-[32px] bg-orange-500 text-white font-bold text-[12px] shadow-md rounded-btn p-1 cursor-pointer outline-orange-500/50'
                            aria-label={t('Temperature-min-max')}
                          >
                            {state.valueNow}
                          </div>
                        )
                      }}
                    />
                  </div>
                </div>

                {/* Humidity */}
                <div className='form-control w-full'>
                  <div className='label flex-col items-start'>
                    <span className='label-text mb-2'>
                      {t('probeHumiSubTb')}
                    </span>
                    <ReactSlider
                      aria-label={t('Humidity-min-max')}
                      className='relative flex items-center w-full h-2 bg-gray-300 rounded-btn my-3'
                      thumbClassName='flex items-center justify-center'
                      trackClassName='bg-blue-500/20 h-2 rounded-btn'
                      value={[adjustmentsForm.humiMin, adjustmentsForm.humiMax]}
                      onChange={values =>
                        setAdjustmentsForm({
                          ...adjustmentsForm,
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
                            className='flex items-center justify-center w-[42px] h-[32px] bg-blue-500 text-white font-bold text-[12px] shadow-md rounded-btn p-1 cursor-pointer outline-blue-500/50'
                            aria-label={t('Humidity-min-max')}
                          >
                            {state.valueNow}
                          </div>
                        )
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className='md:grid grid-cols-1 hidden md:grid-cols-2 gap-4 mt-4 w-full'>
                {/* Temperature */}
                <label
                  htmlFor='tempMin'
                  className='flex justify-between gap-2 w-full'
                >
                  <input
                    id='tempMin'
                    name='tempMin'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    min={probeFiltered?.name === 'PT100' ? -180 : -40}
                    max={probeFiltered?.name === 'PT100' ? 200 : 120}
                    value={adjustmentsForm.tempMin}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          tempMin: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({ ...adjustmentsForm, tempMin: num })
                      }
                    }}
                  />
                  <input
                    name='tempMax'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    min={probeFiltered?.name === 'PT100' ? -180 : -40}
                    max={probeFiltered?.name === 'PT100' ? 200 : 120}
                    value={adjustmentsForm.tempMax}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          tempMax: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({ ...adjustmentsForm, tempMax: num })
                      }
                    }}
                  />
                </label>

                {/* Humidity */}
                <label
                  htmlFor='humiMin'
                  className='flex justify-between gap-2 w-full'
                >
                  <input
                    id='humiMin'
                    name='humiMin'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    min={0}
                    max={100}
                    value={adjustmentsForm.humiMin}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          humiMin: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({ ...adjustmentsForm, humiMin: num })
                      }
                    }}
                  />
                  <input
                    name='humiMax'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    min={0}
                    max={100}
                    value={adjustmentsForm.humiMax}
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          humiMax: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({ ...adjustmentsForm, humiMax: num })
                      }
                    }}
                  />
                </label>
              </div>

              <div className='divider divider-vertical my-2'></div>

              <div className='md:grid grid-cols-1 hidden md:grid-cols-2 gap-4 mt-4 w-full'>
                {/* AdjustTemperature */}
                <div className='form-control w-full'>
                  <div className='label flex-col items-start'>
                    <span className='label-text mb-2'>{t('adjustTemp')}</span>
                    <ReactSlider
                      aria-label={t('Temperature-adjustment')}
                      className={`relative flex items-center w-full h-2 bg-gray-300 rounded-btn my-3 ${
                        isLoadingMqtt ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      thumbClassName='flex items-center justify-center'
                      trackClassName='bg-orange-500/20 h-2 rounded-btn'
                      value={adjustmentsForm.adjustTemp}
                      onChange={values =>
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustTemp: values
                        })
                      }
                      pearling
                      minDistance={1}
                      step={0.01}
                      min={probeFiltered?.name === 'PT100' ? -180 : -40}
                      max={probeFiltered?.name === 'PT100' ? 200 : 120}
                      disabled={
                        isLoadingMqtt ||
                        role === 'ADMIN' ||
                        role === 'USER' ||
                        role === 'LEGACY_ADMIN' ||
                        role === 'LEGACY_USER' ||
                        role === 'GUEST'
                      }
                      renderThumb={(props, state) => {
                        const { key, ref, ...validProps } = props
                        return (
                          <div
                            {...validProps}
                            ref={ref as Ref<HTMLDivElement> | undefined}
                            key={key}
                            className={`flex items-center justify-center w-[42px] h-[32px] bg-orange-500 text-white font-bold text-[12px] shadow-md rounded-btn p-1 cursor-pointer outline-orange-500/50 ${
                              isLoadingMqtt ? 'cursor-not-allowed' : ''
                            }`}
                            aria-label={t('Temperature-adjustment')}
                          >
                            {state.valueNow}
                          </div>
                        )
                      }}
                    />
                  </div>
                </div>

                {/* AdjustHumidity */}
                <div className='form-control w-full'>
                  <div className='label flex-col items-start'>
                    <span className='label-text mb-2'>{t('adjustHumi')}</span>
                    <ReactSlider
                      aria-label={t('Humidity-adjustment')}
                      className={`relative flex items-center w-full h-2 bg-gray-300 rounded-btn my-3 ${
                        isLoadingMqtt ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      thumbClassName='flex items-center justify-center'
                      trackClassName='bg-blue-500/20 h-2 rounded-btn'
                      value={adjustmentsForm.adjustHumi}
                      onChange={values =>
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustHumi: values
                        })
                      }
                      pearling
                      minDistance={1}
                      step={0.01}
                      min={0}
                      max={100}
                      disabled={
                        isLoadingMqtt ||
                        role === 'ADMIN' ||
                        role === 'USER' ||
                        role === 'LEGACY_ADMIN' ||
                        role === 'LEGACY_USER' ||
                        role === 'GUEST'
                      }
                      renderThumb={(props, state) => {
                        const { key, ref, ...validProps } = props
                        return (
                          <div
                            {...validProps}
                            ref={ref as Ref<HTMLDivElement> | undefined}
                            key={key}
                            className={`flex items-center justify-center w-[42px] h-[32px] bg-blue-500 text-white font-bold text-[12px] shadow-md rounded-btn p-1 cursor-pointer outline-blue-500/50 ${
                              isLoadingMqtt ? 'cursor-not-allowed' : ''
                            }`}
                            aria-label={t('Humidity-adjustment')}
                          >
                            {state.valueNow}
                          </div>
                        )
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className='md:grid grid-cols-1 hidden md:grid-cols-2 gap-4 mt-4 w-full'>
                {/* Temperature */}
                <label
                  htmlFor='adjustTemp'
                  className='flex justify-between gap-2 w-full'
                >
                  <input
                    id='adjustTemp'
                    name='adjustTemp'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    min={probeFiltered?.name === 'PT100' ? -180 : -40}
                    max={probeFiltered?.name === 'PT100' ? 200 : 120}
                    value={adjustmentsForm.adjustTemp}
                    disabled={
                      isLoadingMqtt ||
                      role === 'ADMIN' ||
                      role === 'USER' ||
                      role === 'LEGACY_ADMIN' ||
                      role === 'LEGACY_USER' ||
                      role === 'GUEST'
                    }
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustTemp: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustTemp: num
                        })
                      }
                    }}
                  />
                </label>

                {/* Humidity */}
                <label
                  htmlFor='adjustMumi'
                  className='flex justify-between gap-2 w-full'
                >
                  <input
                    id='adjustMumi'
                    name='adjustMumi'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    min={0}
                    max={100}
                    value={adjustmentsForm.adjustHumi}
                    disabled={
                      isLoadingMqtt ||
                      role === 'ADMIN' ||
                      role === 'USER' ||
                      role === 'LEGACY_ADMIN' ||
                      role === 'LEGACY_USER' ||
                      role === 'GUEST'
                    }
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustHumi: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustHumi: num
                        })
                      }
                    }}
                  />
                </label>
              </div>

              <div className='flex md:hidden flex-col items-center justify-center gap-3 mt-4 w-full'>
                <span>{t('adjustTemp')}</span>
                <label className='flex items-center justify-center gap-2 w-full'>
                  <button
                    disabled={
                      isLoadingMqtt ||
                      role === 'ADMIN' ||
                      role === 'USER' ||
                      role === 'LEGACY_ADMIN' ||
                      role === 'LEGACY_USER' ||
                      role === 'GUEST'
                    }
                    className='btn btn-ghost bg-orange-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (adjustmentsForm.adjustTemp > -40) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustTemp: parseFloat(
                            (adjustmentsForm.adjustTemp - 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    -
                  </button>
                  <input
                    name='adjustTemp'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    min={probeFiltered?.name === 'PT100' ? -180 : -40}
                    max={probeFiltered?.name === 'PT100' ? 200 : 120}
                    value={adjustmentsForm.adjustTemp}
                    disabled={
                      isLoadingMqtt ||
                      role === 'ADMIN' ||
                      role === 'USER' ||
                      role === 'LEGACY_ADMIN' ||
                      role === 'LEGACY_USER' ||
                      role === 'GUEST'
                    }
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustTemp: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustTemp: num
                        })
                      }
                    }}
                  />
                  <button
                    disabled={
                      isLoadingMqtt ||
                      role === 'ADMIN' ||
                      role === 'USER' ||
                      role === 'LEGACY_ADMIN' ||
                      role === 'LEGACY_USER' ||
                      role === 'GUEST'
                    }
                    className='btn btn-ghost bg-orange-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (adjustmentsForm.adjustTemp < 120) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustTemp: parseFloat(
                            (adjustmentsForm.adjustTemp + 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    +
                  </button>
                </label>
              </div>

              <div className='flex md:hidden flex-col items-center justify-center gap-3 mt-4 w-full'>
                <span>{t('adjustHumi')}</span>
                <label className='flex items-center justify-center gap-2 w-full'>
                  <button
                    disabled={
                      isLoadingMqtt ||
                      role === 'ADMIN' ||
                      role === 'USER' ||
                      role === 'LEGACY_ADMIN' ||
                      role === 'LEGACY_USER' ||
                      role === 'GUEST'
                    }
                    className='btn btn-ghost bg-blue-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (adjustmentsForm.adjustHumi > -40) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustHumi: parseFloat(
                            (adjustmentsForm.adjustHumi - 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    -
                  </button>
                  <input
                    name='adjustHumi'
                    autoFocus={false}
                    className='input input-bordered text-center w-full'
                    type='number'
                    step={0.01}
                    min={0}
                    max={100}
                    value={adjustmentsForm.adjustHumi}
                    disabled={
                      isLoadingMqtt ||
                      role === 'ADMIN' ||
                      role === 'USER' ||
                      role === 'LEGACY_ADMIN' ||
                      role === 'LEGACY_USER' ||
                      role === 'GUEST'
                    }
                    onChange={e => {
                      let value = e.target.value

                      if (value === '' || value === '-') {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustHumi: value as unknown as number
                        })
                        return
                      }

                      let num = parseFloat(value)
                      if (!isNaN(num)) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustHumi: num
                        })
                      }
                    }}
                  />
                  <button
                    disabled={
                      isLoadingMqtt ||
                      role === 'ADMIN' ||
                      role === 'USER' ||
                      role === 'LEGACY_ADMIN' ||
                      role === 'LEGACY_USER' ||
                      role === 'GUEST'
                    }
                    className='btn btn-ghost bg-blue-500 text-white text-lg'
                    type='button'
                    onClick={() => {
                      if (adjustmentsForm.adjustHumi < 120) {
                        setAdjustmentsForm({
                          ...adjustmentsForm,
                          adjustHumi: parseFloat(
                            (adjustmentsForm.adjustHumi + 0.01).toFixed(2)
                          )
                        })
                      }
                    }}
                  >
                    +
                  </button>
                </label>
              </div>
            </div>

            {!isLoadingMqtt ? (
              <>
                <div className='flex flex-col md:flex-row items-center justify-around gap-5 md:gap-2 mt-5'>
                  <div className='flex flex-col items-center gap-2'>
                    <span className='md:text-[14px]'>{t('currentTemp')}</span>
                    <div className='flex items-center justify-center h-[55px] px-2 min-w-[55px] w-max rounded-btn border-[2px] border-primary text-primary text-[18px] font-bold'>
                      {mqData.temp ? `${mqData.temp.toFixed(2)}°C` : '—'}
                    </div>
                  </div>
                  <RiArrowRightLine size={24} className='hidden md:flex mt-5' />
                  <RiArrowDownLine size={24} className='flex md:hidden' />
                  <div className='flex flex-col items-center gap-2'>
                    <span className='md:text-[14px]'>
                      {t('adjustAfterTemp')}
                    </span>
                    <div className='flex items-center justify-center h-[55px] px-2 min-w-[55px] w-max rounded-btn border-[2px] border-primary text-primary text-[18px] font-bold'>
                      {mqData.temp
                        ? `${(
                            mqData.temp +
                            adjustmentsForm.adjustTemp -
                            (probeBefore?.tempAdj ?? 0)
                          ).toFixed(2)}°C`
                        : '—'}
                    </div>
                  </div>
                </div>

                <div className='flex flex-col md:flex-row items-center justify-around gap-5 md:gap-2 mt-5'>
                  <div className='flex flex-col items-center gap-2'>
                    <span className='md:text-[14px]'>{t('currentHum')}</span>
                    <div className='flex items-center justify-center h-[55px] px-2 min-w-[55px] w-max rounded-btn border-[2px] border-primary text-primary text-[18px] font-bold'>
                      {mqData.humi ? `${mqData.humi.toFixed(2)}%` : '—'}
                    </div>
                  </div>
                  <RiArrowRightLine size={24} className='hidden md:flex mt-5' />
                  <RiArrowDownLine size={24} className='flex md:hidden' />
                  <div className='flex flex-col items-center gap-2'>
                    <span className='md:text-[14px]'>
                      {t('adjustAfterHum')}
                    </span>
                    <div className='flex items-center justify-center h-[55px] px-2 min-w-[55px] w-max rounded-btn border-[2px] border-primary text-primary text-[18px] font-bold'>
                      {mqData.humi
                        ? `${(
                            mqData.humi +
                            adjustmentsForm.adjustHumi -
                            (probeBefore?.humiAdj ?? 0)
                          ).toFixed(2)}%`
                        : '—'}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className='mt-5'>
                <Loading />
              </div>
            )}
          </div>
        ) : tab === 2 ? (
          <div className='mt-3'>
            <AppMute
              muteMode={muteMode}
              setMuteMode={setMuteMode}
              sendTime={sendTime}
              setSendTime={setSendTime}
              scheduleDay={scheduleDay}
              setScheduleDay={setScheduleDay}
              scheduleTime={scheduleTime}
              setScheduleTime={setScheduleTime}
            />
          </div>
        ) : !isLoadingMuteMqtt ? (
          <div className='mt-3'>
            <h3 className='font-bold text-base'>{t('countProbe')}</h3>
            <div className='flex flex-col gap-3 mt-3'>
              {deviceModel === 'etemp' && (
                <div className='flex items-center justify-between'>
                  <span>{t('mutsmtrackorary')}</span>
                  <input
                    type='checkbox'
                    className='toggle'
                    onClick={muteTemporary}
                    checked={muteDoorSelect.tempTemporary as boolean}
                    disabled={tempAlarm === 'normal'}
                  />
                </div>
              )}
              <div className='flex items-center justify-between mt-3'>
                <div className='flex flex-col gap-1'>
                  <span>{t('muteAlways')}</span>
                  <span className='text-primary text-[14px]'>
                    {tempDuration}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <div>
                    <Select
                      id='hours-one'
                      key={JSON.stringify(muteDoorSelect)}
                      options={mapOptions<selectOption, keyof selectOption>(
                        generateOptionsOne(role),
                        'value',
                        'label'
                      )}
                      value={mapDefaultValue<selectOption, keyof selectOption>(
                        generateOptionsOne(role),
                        muteDoorSelect.tempDuration,
                        'value',
                        'label'
                      )}
                      onChange={e => {
                        setMuteDoorSelect(prev => ({
                          ...prev,
                          tempDuration: String(e?.value)
                        }))
                        setMuteDoor(prev => ({
                          ...prev,
                          tempDuration: String(e?.value)
                        }))
                      }}
                      autoFocus={false}
                      menuPlacement='top'
                      className='react-select-container w-full custom-menu-select z-[155] '
                      classNamePrefix='react-select'
                    />
                  </div>
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={() => muteAlways(true)}
                  >
                    {t('messageSend')}
                  </button>
                  {tempDuration !== '- -' && (
                    <button
                      type='button'
                      className='btn btn-ghost bg-red-500 text-white hover:bg-red-600'
                      onClick={() => muteAlways(false)}
                    >
                      {t('cancelButton')}
                    </button>
                  )}
                </div>
              </div>
              <div className='divider divider-vertical before:h-[1px] after:h-[1px] my-2'></div>
              <h3 className='font-bold text-base'>{t('dashDoor')}</h3>
              <div className='flex items-center justify-between'>
                <span>{t('muteDoor')}</span>
                <input
                  type='checkbox'
                  className='toggle'
                  onClick={muteAlarm}
                  checked={muteEtemp.door}
                />
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex flex-col gap-1'>
                  <span>{t('muteDoorDuration')}</span>
                  <span className='text-primary text-[14px]'>
                    {doorDuration}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <div>
                    <Select
                      id='hours-two'
                      key={JSON.stringify(muteDoorSelect)}
                      options={mapOptions<selectOption, keyof selectOption>(
                        generateOptionsTwo(),
                        'value',
                        'label'
                      )}
                      value={mapDefaultValue<selectOption, keyof selectOption>(
                        generateOptionsTwo(),
                        muteDoorSelect.doorDuration,
                        'value',
                        'label'
                      )}
                      onChange={e => {
                        setMuteDoorSelect(prev => ({
                          ...prev,
                          doorDuration: String(e?.value)
                        }))
                        setMuteDoor(prev => ({
                          ...prev,
                          doorDuration: String(e?.value)
                        }))
                      }}
                      autoFocus={false}
                      menuPlacement='top'
                      className='react-select-container w-full custom-menu-select z-[155] '
                      classNamePrefix='react-select'
                    />
                  </div>
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={() => muteDoorDuration(true)}
                  >
                    {t('messageSend')}
                  </button>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex flex-col gap-1'>
                  <span>{t('muteAlert')}</span>
                  <span className='text-primary text-[14px]'>{doorAlarm}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div>
                    <Select
                      id='hours-three'
                      key={JSON.stringify(muteDoorSelect)}
                      options={mapOptions<selectOption, keyof selectOption>(
                        generateOptions(role),
                        'value',
                        'label'
                      )}
                      value={mapDefaultValue<selectOption, keyof selectOption>(
                        generateOptions(role),
                        muteDoorSelect.doorAlarm,
                        'value',
                        'label'
                      )}
                      onChange={e => {
                        setMuteDoorSelect(prev => ({
                          ...prev,
                          doorAlarm: String(e?.value)
                        }))
                        setMuteDoor(prev => ({
                          ...prev,
                          doorAlarm: String(e?.value)
                        }))
                      }}
                      autoFocus={false}
                      menuPlacement='top'
                      className='react-select-container w-full custom-menu-select z-[155] '
                      classNamePrefix='react-select'
                    />
                  </div>
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={() => muteAlert(true)}
                  >
                    {t('messageSend')}
                  </button>
                  {doorAlarm !== '- -' && (
                    <button
                      type='button'
                      className='btn btn-ghost bg-red-500 text-white hover:bg-red-600'
                      onClick={() => muteAlert(false)}
                    >
                      {t('cancelButton')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='mt-5'>
            <Loading />
          </div>
        )}

        {(tab === 1 || tab === 2) && (
          <div className={`modal-action ${isLoadingMqtt ? 'mt-0' : 'mt-6'}`}>
            <button type='submit' className='btn btn-primary'>
              {t('submitButton')}
            </button>
          </div>
        )}
      </form>
    </dialog>
  )
}

export default Adjustments
