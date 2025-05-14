import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { useTranslation } from 'react-i18next'
import Loading from '../../components/skeleton/table/loading'
import DataTableNoData from '../../components/skeleton/table/noData'
import axiosInstance from '../../constants/axios/axiosInstance'
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import { handleApiError } from '../../constants/utils/utilsConstants'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { RepairType } from '../../types/smtrack/repair/repairType'
import { RiDeleteBin7Line, RiEditLine, RiPrinterLine } from 'react-icons/ri'
import { Option, Ward } from '../../types/global/hospitalAndWard'
import Select from 'react-select'
import { GlobalContextType } from '../../types/global/globalContext'
import { GlobalContext } from '../../contexts/globalContext'
import { DeviceListType } from '../../types/smtrack/devices/deviceType'
import { AxiosError } from 'axios'
import {
  setSubmitLoading,
  setTokenExpire
} from '../../redux/actions/utilsActions'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const Repair = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { globalSearch, userProfile, tokenDecode } = useSelector(
    (state: RootState) => state.utils
  )
  const { ward } = useContext(GlobalContext) as GlobalContextType
  const addModalRef = useRef<HTMLDialogElement>(null)
  const editModalRef = useRef<HTMLDialogElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [repairData, setRepairData] = useState<RepairType[]>([])
  const [repairFilter, setRepairFilter] = useState<RepairType[]>([])
  const [deviceList, setDeviceList] = useState<DeviceListType[]>([])
  const [repairForm, setRepairForm] = useState({
    id: '',
    devName: '',
    info: '',
    info1: '',
    info2: '',
    address: '',
    ward: '',
    detail: '',
    phone: '',
    status: '',
    warrantyStatus: '',
    remark: ''
  })
  const { role } = tokenDecode || {}

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

  const fetchRepairData = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get<responseType<RepairType[]>>(
        '/devices/repair'
      )
      setRepairData(response.data.data)
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')

    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/)

    if (match) {
      const [, part1, part2, part3] = match
      return [part1, part2, part3].filter(Boolean).join('-')
    }

    return value
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    if (
      repairForm.devName !== '' &&
      repairForm.info !== '' &&
      repairForm.info1 !== '' &&
      repairForm.info2 !== '' &&
      repairForm.address !== '' &&
      repairForm.ward !== '' &&
      repairForm.detail !== '' &&
      repairForm.phone !== '' &&
      repairForm.warrantyStatus !== ''
    ) {
      const body = {
        devName: repairForm.devName,
        info: repairForm.info,
        info1: repairForm.info1,
        info2: repairForm.info2,
        address: repairForm.address,
        ward: repairForm.ward,
        detail: repairForm.detail,
        phone: repairForm.phone,
        warrantyStatus: repairForm.warrantyStatus,
        remark: repairForm.remark
      }
      try {
        await axiosInstance.post<responseType<RepairType>>(
          '/devices/repair',
          body
        )
        addModalRef.current?.close()
        resetForm()
        await fetchRepairData()
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: t('submitSuccess'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2500
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

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    if (
      repairForm.devName !== '' &&
      repairForm.info !== '' &&
      repairForm.info1 !== '' &&
      repairForm.info2 !== '' &&
      repairForm.address !== '' &&
      repairForm.ward !== '' &&
      repairForm.detail !== '' &&
      repairForm.phone !== '' &&
      repairForm.warrantyStatus !== ''
    ) {
      const body = {
        devName: repairForm.devName,
        info: repairForm.info,
        info1: repairForm.info1,
        info2: repairForm.info2,
        address: repairForm.address,
        ward: repairForm.ward,
        detail: repairForm.detail,
        phone: repairForm.phone,
        warrantyStatus: repairForm.warrantyStatus,
        remark: repairForm.remark
      }
      try {
        await axiosInstance.put<responseType<RepairType>>(
          `/devices/repair/${repairForm.id}`,
          body
        )
        editModalRef.current?.close()
        resetForm()
        await fetchRepairData()
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

    let formattedValue = value

    formattedValue = name === 'phone' ? formatPhoneNumber(value) : value

    setRepairForm(prev => ({
      ...prev,
      [name]: formattedValue
    }))
  }

  const openEditModal = (repair: RepairType) => {
    setRepairForm({
      id: repair.id,
      devName: repair.devName,
      info: repair.info,
      info1: repair.info1,
      info2: repair.info2,
      address: repair.address,
      ward: repair.ward,
      detail: repair.detail,
      phone: repair.phone,
      status: repair.status,
      warrantyStatus: repair.warrantyStatus,
      remark: repair.remark
    })
    editModalRef.current?.showModal()
  }

  const resetForm = () => {
    setRepairForm({
      id: '',
      devName: '',
      info: '',
      info1: '',
      info2: '',
      address: '',
      ward: '',
      detail: '',
      phone: '',
      status: '',
      warrantyStatus: '',
      remark: ''
    })
  }

  const deleteRepair = async (id: string) => {
    dispatch(setSubmitLoading())
    try {
      const response = await axiosInstance.delete<responseType<RepairType>>(
        `/devices/repair/${id}`
      )
      await fetchRepairData()
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

  const getWard = (wardID: string | undefined) => {
    if (wardID !== '') {
      setRepairForm({ ...repairForm, ward: String(wardID) })
    }
  }

  useEffect(() => {
    fetchRepairData()
    fetchDeviceList()
  }, [])

  useEffect(() => {
    const filterData = repairData.filter(f => f)
    setRepairFilter(filterData)
  }, [repairData, globalSearch])

  const columns: TableColumn<RepairType>[] = [
    {
      name: t('deviceSerialTb'),
      selector: item => item.device.id ?? '- -',
      sortable: false,
      center: true
    },
    {
      name: t('userNameForm'),
      selector: item => item.info ?? '- -',
      sortable: false,
      center: true
    },
    {
      name: t('hisDetail'),
      selector: item => item.detail ?? '- -',
      sortable: false,
      center: true
    },
    {
      name: t('hosAddress'),
      selector: item => item.address ?? '- -',
      sortable: false,
      center: true
    },
    {
      name: t('hosTel'),
      selector: item => item.phone ?? '- -',
      sortable: false,
      center: true
    },
    {
      name: t('sideWarranty'),
      cell: item => {
        if (item.warrantyStatus === '1') {
          return <span>{t('tabWarrantyaftersale')}</span>
        } else if (item.warrantyStatus === '2') {
          return <span>{t('tabWarrantyExpired')}</span>
        } else if (item.warrantyStatus === '3') {
          return <span>{t('warrantyMa')}</span>
        } else {
          return <span>{t('warrantyEtc')}</span>
        }
      },
      sortable: false,
      center: true
    },
    {
      name: t('lastModified'),
      cell: item => (
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
      cell: (item, index) => (
        <div key={index} className='flex items-center justify-center gap-3 p-3'>
          <button
            className='btn btn-ghost flex !text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-primary'
            key={item.id}
            onClick={() => navigate('/repair/preview', { state: item })}
          >
            <RiPrinterLine size={20} />
          </button>
          {(role === 'SUPER' || role === 'SERVICE') && (
            <>
              <div className='divider divider-horizontal mx-0'></div>
              <button
                className='btn btn-ghost flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-primary'
                onClick={() => openEditModal(item)}
              >
                <RiEditLine size={20} />
              </button>
              <button
                className='btn btn-ghost flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-red-500'
                onClick={() =>
                  Swal.fire({
                    title: t('deleteRepairTitle'),
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
                      deleteRepair(item.id)
                    }
                  })
                }
              >
                <RiDeleteBin7Line size={20} />
              </button>
            </>
          )}
        </div>
      ),
      sortable: false,
      center: true
    }
  ]

  const DataTableComponent = useMemo(() => {
    return (
      <div className='dataTableWrapper bg-base-100 rounded-field p-3 mt-5 duration-300 ease-linear'>
        <DataTable
          responsive
          fixedHeader
          pagination
          paginationServer
          columns={columns}
          data={repairFilter}
          progressPending={isLoading}
          progressComponent={<Loading />}
          noDataComponent={<DataTableNoData />}
          paginationRowsPerPageOptions={[10, 20, 50, 100, 150, 200]}
          className='md:!max-h-[calc(100dvh-300px)]'
        />
      </div>
    )
  }, [repairFilter, isLoading, t])

  return (
    <div className='p-3 px-[16px]'>
      <div className='flex flex-col lg:flex-row lg:items-center justify-between mt-3'>
        <span className='text-[20px] font-medium'></span>
        <div className='flex flex-col lg:flex-row mt-3 lg:mt-0 lg:items-center items-end lg:gap-3'>
          <button
            className='btn btn-neutral max-w-[150px]'
            onClick={() => {
              addModalRef.current?.showModal()
              setRepairForm({
                ...repairForm,
                info: userProfile?.display ?? '-'
              })
            }}
          >
            {t('addRepair')}
          </button>
        </div>
      </div>
      {DataTableComponent}

      <dialog ref={addModalRef} className='modal overflow-y-scroll py-10'>
        <form
          onSubmit={handleSubmit}
          className='modal-box w-5/6 max-w-[50rem] h-max max-h-max'
        >
          <h3 className='font-bold text-lg'>{t('addRepair')}</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4 mt-4 w-full'>
            <div>
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('hisUsername')}
                  </span>
                  <input
                    name='info'
                    type='text'
                    value={repairForm.info}
                    className='input input-bordered w-full'
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('hosAddress')}
                  </span>
                  <input
                    name='address'
                    type='text'
                    value={repairForm.address}
                    className='input input-bordered w-full'
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('hosTel')}
                  </span>
                  <input
                    name='phone'
                    type='tel'
                    value={repairForm.phone}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={12}
                  />
                </label>
              </div>
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('ward')}
                  </span>
                  <Select
                    options={mapOptions<Ward, keyof Ward>(
                      ward,
                      'id',
                      'wardName'
                    )}
                    value={mapDefaultValue<Ward, keyof Ward>(
                      ward,
                      repairForm.ward,
                      'id',
                      'wardName'
                    )}
                    onChange={e => getWard(e?.value)}
                    autoFocus={false}
                    className='react-select-container custom-menu-select w-full'
                    classNamePrefix='react-select'
                  />
                </label>
              </div>
            </div>
            <div>
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('deviceSerialTb')}
                  </span>
                  <Select
                    options={mapOptions<DeviceListType, keyof DeviceListType>(
                      deviceList,
                      'staticName',
                      'id'
                    )}
                    value={mapDefaultValue<
                      DeviceListType,
                      keyof DeviceListType
                    >(deviceList, repairForm.devName, 'staticName', 'id')}
                    onChange={e => {
                      setRepairForm({
                        ...repairForm,
                        devName: String(e?.value)
                      })
                    }}
                    autoFocus={false}
                    className='react-select-container custom-menu-select w-full'
                    classNamePrefix='react-select'
                  />
                </label>
              </div>
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <div className='flex flex-col gap-2'>
                    <label className='flex items-center gap-2'>
                      <input
                        type='radio'
                        name='radio-1'
                        className='radio'
                        checked={repairForm.warrantyStatus === '1'}
                        onClick={() =>
                          setRepairForm({ ...repairForm, warrantyStatus: '1' })
                        }
                      />
                      <span>{t('tabWarrantyExpired')}</span>
                    </label>
                    <label className='flex items-center gap-2'>
                      <input
                        type='radio'
                        name='radio-1'
                        className='radio'
                        checked={repairForm.warrantyStatus === '2'}
                        onClick={() =>
                          setRepairForm({ ...repairForm, warrantyStatus: '2' })
                        }
                      />
                      <span>{t('tabWarrantyAfterSale')}</span>
                    </label>
                    <label className='flex items-center gap-2'>
                      <input
                        type='radio'
                        name='radio-1'
                        className='radio'
                        checked={repairForm.warrantyStatus === '3'}
                        onClick={() =>
                          setRepairForm({ ...repairForm, warrantyStatus: '3' })
                        }
                      />
                      <span>{t('warrantyMa')}</span>
                    </label>
                    <label className='flex items-center gap-2'>
                      <input
                        type='radio'
                        name='radio-1'
                        className='radio'
                        checked={repairForm.warrantyStatus === '4'}
                        onClick={() =>
                          setRepairForm({ ...repairForm, warrantyStatus: '4' })
                        }
                      />
                      <span>{t('warrantyEtc')}</span>
                    </label>
                  </div>
                </label>
              </div>
              {repairForm.warrantyStatus === '4' && (
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      {t('hisDetail')}
                    </span>
                    <textarea
                      name='remark'
                      value={repairForm.remark}
                      onChange={e =>
                        setRepairForm({ ...repairForm, remark: e.target.value })
                      }
                      className='textarea textarea-bordered w-full'
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 w-full'>
            <div className='form-control w-full'>
              <label className='label flex-col items-start w-full mb-3'>
                <span className='label-text text-wrap mb-2'>
                  {t('hisDetail')}
                </span>
                <textarea
                  name='detail'
                  value={repairForm.detail}
                  onChange={e =>
                    setRepairForm({ ...repairForm, detail: e.target.value })
                  }
                  className='textarea textarea-bordered w-full'
                />
              </label>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4 w-full'>
            <div className='grid grid-cols-1 gap-4 mt-2 w-full'>
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    {t('deviceCondition')}
                  </span>
                  <textarea
                    name='info1'
                    value={repairForm.info1}
                    onChange={e =>
                      setRepairForm({ ...repairForm, info1: e.target.value })
                    }
                    className='textarea textarea-bordered w-full'
                  />
                </label>
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 mt-2 w-full'>
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    {t('deviceRepairInfo')}
                  </span>
                  <textarea
                    name='info2'
                    value={repairForm.info2}
                    onChange={e =>
                      setRepairForm({ ...repairForm, info2: e.target.value })
                    }
                    className='textarea textarea-bordered w-full'
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

      <dialog ref={editModalRef} className='modal overflow-y-scroll py-10'>
        <form
          onSubmit={handleUpdate}
          className='modal-box w-5/6 max-w-[50rem] h-max max-h-max'
        >
          <h3 className='font-bold text-lg'>{t('addRepair')}</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4 mt-4 w-full'>
            <div>
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('hisUsername')}
                  </span>
                  <input
                    name='info'
                    type='text'
                    value={repairForm.info}
                    className='input input-bordered w-full'
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('hosAddress')}
                  </span>
                  <input
                    name='address'
                    type='text'
                    value={repairForm.address}
                    className='input input-bordered w-full'
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('hosTel')}
                  </span>
                  <input
                    name='phone'
                    type='tel'
                    value={repairForm.phone}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={12}
                  />
                </label>
              </div>
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('ward')}
                  </span>
                  <Select
                    options={mapOptions<Ward, keyof Ward>(
                      ward,
                      'id',
                      'wardName'
                    )}
                    value={mapDefaultValue<Ward, keyof Ward>(
                      ward,
                      repairForm.ward,
                      'id',
                      'wardName'
                    )}
                    onChange={e => getWard(e?.value)}
                    autoFocus={false}
                    className='react-select-container custom-menu-select w-full'
                    classNamePrefix='react-select'
                  />
                </label>
              </div>
            </div>
            <div>
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('deviceSerialTb')}
                  </span>
                  <Select
                    options={mapOptions<DeviceListType, keyof DeviceListType>(
                      deviceList,
                      'staticName',
                      'id'
                    )}
                    value={mapDefaultValue<
                      DeviceListType,
                      keyof DeviceListType
                    >(deviceList, repairForm.devName, 'staticName', 'id')}
                    onChange={e => {
                      setRepairForm({
                        ...repairForm,
                        devName: String(e?.value)
                      })
                    }}
                    autoFocus={false}
                    className='react-select-container custom-menu-select w-full'
                    classNamePrefix='react-select'
                  />
                </label>
              </div>
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <div className='flex flex-col gap-2'>
                    <label className='flex items-center gap-2'>
                      <input
                        type='radio'
                        name='radio-1'
                        className='radio'
                        checked={repairForm.warrantyStatus === '1'}
                        onClick={() =>
                          setRepairForm({ ...repairForm, warrantyStatus: '1' })
                        }
                      />
                      <span>{t('tabWarrantyExpired')}</span>
                    </label>
                    <label className='flex items-center gap-2'>
                      <input
                        type='radio'
                        name='radio-1'
                        className='radio'
                        checked={repairForm.warrantyStatus === '2'}
                        onClick={() =>
                          setRepairForm({ ...repairForm, warrantyStatus: '2' })
                        }
                      />
                      <span>{t('tabWarrantyAfterSale')}</span>
                    </label>
                    <label className='flex items-center gap-2'>
                      <input
                        type='radio'
                        name='radio-1'
                        className='radio'
                        checked={repairForm.warrantyStatus === '3'}
                        onClick={() =>
                          setRepairForm({ ...repairForm, warrantyStatus: '3' })
                        }
                      />
                      <span>{t('warrantyMa')}</span>
                    </label>
                    <label className='flex items-center gap-2'>
                      <input
                        type='radio'
                        name='radio-1'
                        className='radio'
                        checked={repairForm.warrantyStatus === '4'}
                        onClick={() =>
                          setRepairForm({ ...repairForm, warrantyStatus: '4' })
                        }
                      />
                      <span>{t('warrantyEtc')}</span>
                    </label>
                  </div>
                </label>
              </div>
              {repairForm.warrantyStatus === '4' && (
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      {t('hisDetail')}
                    </span>
                    <textarea
                      name='remark'
                      value={repairForm.remark}
                      onChange={e =>
                        setRepairForm({ ...repairForm, remark: e.target.value })
                      }
                      className='textarea textarea-bordered w-full'
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 w-full'>
            <div className='form-control w-full'>
              <label className='label flex-col items-start w-full mb-3'>
                <span className='label-text text-wrap mb-2'>
                  {t('hisDetail')}
                </span>
                <textarea
                  name='detail'
                  value={repairForm.detail}
                  onChange={e =>
                    setRepairForm({ ...repairForm, detail: e.target.value })
                  }
                  className='textarea textarea-bordered w-full'
                />
              </label>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4 w-full'>
            <div className='grid grid-cols-1 gap-4 mt-2 w-full'>
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    {t('deviceCondition')}
                  </span>
                  <textarea
                    name='info1'
                    value={repairForm.info1}
                    onChange={e =>
                      setRepairForm({ ...repairForm, info1: e.target.value })
                    }
                    className='textarea textarea-bordered w-full'
                  />
                </label>
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 mt-2 w-full'>
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    {t('deviceRepairInfo')}
                  </span>
                  <textarea
                    name='info2'
                    value={repairForm.info2}
                    onChange={e =>
                      setRepairForm({ ...repairForm, info2: e.target.value })
                    }
                    className='textarea textarea-bordered w-full'
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

export default Repair
