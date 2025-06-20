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
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  setSearch,
  setSubmitLoading,
  setTokenExpire
} from '../../redux/actions/utilsActions'
import { handleApiError } from '../../constants/utils/utilsConstants'
import axiosInstance from '../../constants/axios/axiosInstance'
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import { WarrantiesType } from '../../types/smtrack/warranties/warranties'
import { RootState } from '../../redux/reducers/rootReducer'
import { RiDeleteBin7Line, RiEditLine, RiPrinterLine } from 'react-icons/ri'
import DataTable, { TableColumn } from 'react-data-table-component'
import Loading from '../../components/skeleton/table/loading'
import DataTableNoData from '../../components/skeleton/table/noData'
import { Option } from '../../types/global/hospitalAndWard'
import Select from 'react-select'
import { DeviceListType } from '../../types/smtrack/devices/deviceType'
import { AxiosError } from 'axios'
import { GlobalContext } from '../../contexts/globalContext'
import { GlobalContextType } from '../../types/global/globalContext'
import { HospitalsType } from '../../types/global/hospitals/hospitalType'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

type Company = {
  key: number
  value: string
}

const Warranty = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { globalSearch, tokenDecode } = useSelector(
    (state: RootState) => state.utils
  )
  const { hospital } = useContext(GlobalContext) as GlobalContextType
  const [tab, setTab] = useState(1)
  const [warrantyData, setWarrantyData] = useState<WarrantiesType[]>([])
  const [warrantyFilter, setWarrantyFilter] = useState<WarrantiesType[]>([])
  const [deviceList, setDeviceList] = useState<DeviceListType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { role } = tokenDecode || {}
  const addModalRef = useRef<HTMLDialogElement>(null)
  const editModalRef = useRef<HTMLDialogElement>(null)
  const [warrantyForm, setWarrantyForm] = useState({
    customerAddress: '',
    customerName: '',
    devName: '',
    expire: '',
    id: '',
    installDate: '',
    invoice: '',
    model: '',
    product: '',
    saleDepartment: '',
    comment: ''
  })

  const fetchWarranty = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get<responseType<WarrantiesType[]>>(
        '/devices/warranty'
      )
      setWarrantyData(response.data.data)
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    if (
      warrantyForm.customerAddress !== '' &&
      warrantyForm.customerName !== '' &&
      warrantyForm.devName !== '' &&
      warrantyForm.expire !== '' &&
      warrantyForm.installDate !== '' &&
      warrantyForm.invoice !== '' &&
      warrantyForm.model !== '' &&
      warrantyForm.product !== '' &&
      warrantyForm.saleDepartment !== ''
    ) {
      const body = warrantyForm.comment
        ? {
            devName: warrantyForm.devName,
            product: warrantyForm.product,
            model: warrantyForm.model,
            installDate: warrantyForm.installDate,
            customerName: warrantyForm.customerName,
            customerAddress: warrantyForm.customerAddress,
            saleDepartment: warrantyForm.saleDepartment,
            invoice: warrantyForm.invoice,
            expire: warrantyForm.expire,
            comment: warrantyForm.comment
          }
        : {
            devName: warrantyForm.devName,
            product: warrantyForm.product,
            model: warrantyForm.model,
            installDate: warrantyForm.installDate,
            customerName: warrantyForm.customerName,
            customerAddress: warrantyForm.customerAddress,
            saleDepartment: warrantyForm.saleDepartment,
            invoice: warrantyForm.invoice,
            expire: warrantyForm.expire
          }
      try {
        await axiosInstance.post<responseType<WarrantiesType>>(
          '/devices/warranty',
          body
        )
        addModalRef.current?.close()
        resetForm()
        await fetchWarranty()
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
      warrantyForm.customerAddress !== '' &&
      warrantyForm.customerName !== '' &&
      warrantyForm.devName !== '' &&
      warrantyForm.expire !== '' &&
      warrantyForm.installDate !== '' &&
      warrantyForm.invoice !== '' &&
      warrantyForm.model !== '' &&
      warrantyForm.product !== '' &&
      warrantyForm.saleDepartment !== ''
    ) {
      const body = warrantyForm.comment
        ? {
            devName: warrantyForm.devName,
            product: warrantyForm.product,
            model: warrantyForm.model,
            installDate: warrantyForm.installDate,
            customerName: warrantyForm.customerName,
            customerAddress: warrantyForm.customerAddress,
            saleDepartment: warrantyForm.saleDepartment,
            invoice: warrantyForm.invoice,
            expire: warrantyForm.expire,
            comment: warrantyForm.comment
          }
        : {
            devName: warrantyForm.devName,
            product: warrantyForm.product,
            model: warrantyForm.model,
            installDate: warrantyForm.installDate,
            customerName: warrantyForm.customerName,
            customerAddress: warrantyForm.customerAddress,
            saleDepartment: warrantyForm.saleDepartment,
            invoice: warrantyForm.invoice,
            expire: warrantyForm.expire
          }
      try {
        await axiosInstance.put<responseType<WarrantiesType>>(
          `/devices/warranty/${warrantyForm.id}`,
          body
        )
        editModalRef.current?.close()
        resetForm()
        await fetchWarranty()
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

  const resetForm = () => {
    setWarrantyForm({
      customerAddress: '',
      customerName: '',
      devName: '',
      expire: '',
      id: '',
      installDate: '',
      invoice: '',
      model: '',
      product: '',
      saleDepartment: '',
      comment: ''
    })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setWarrantyForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const deleteWarranty = async (id: string) => {
    dispatch(setSubmitLoading())
    try {
      const response = await axiosInstance.delete<responseType<WarrantiesType>>(
        `/devices/warranty/${id}`
      )
      await fetchWarranty()
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

  const openEditModal = (warranty: WarrantiesType) => {
    setWarrantyForm({
      customerAddress: warranty.customerAddress,
      customerName: warranty.customerName,
      devName: warranty.devName,
      expire: warranty.expire.substring(0, 10),
      id: warranty.id,
      installDate: warranty.installDate,
      invoice: warranty.invoice,
      model: warranty.model,
      product: warranty.product,
      saleDepartment: warranty.saleDepartment,
      comment: warranty.comment ?? '—'
    })
    editModalRef.current?.showModal()
  }

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

  const manageMenu = useMemo(
    () => (
      <div
        role='tablist'
        className='tabs tabs-border justify-evenly w-72 md:w-max mt-3'
      >
        <a
          role='tab'
          className={`tab text-sm md:text-base ${
            tab === 1 ? 'tab-active' : ''
          }`}
          onClick={() => setTab(1)}
        >
          {t('tabWarrantyAfterSale')}
        </a>
        <a
          role='tab'
          className={`tab text-sm md:text-base ${
            tab === 2 ? 'tab-active' : ''
          }`}
          onClick={() => setTab(2)}
        >
          {t('tabWarrantyExpired')}
        </a>
        <a
          role='tab'
          className={`tab text-sm md:text-base ${
            tab === 3 ? 'tab-active' : ''
          }`}
          onClick={() => setTab(3)}
        >
          {t('tabWarrantyAll')}
        </a>
      </div>
    ),
    [tab, t]
  )

  useEffect(() => {
    dispatch(setSearch(''))

    return () => {
      dispatch(setSearch(''))
    }
  }, [tab])

  useEffect(() => {
    fetchWarranty()
    fetchDeviceList()
  }, [])

  useEffect(() => {
    const devicesArray = warrantyData.filter(
      items =>
        items.device?.id?.toLowerCase().includes(globalSearch?.toLowerCase()) ||
        items.device?.name
          ?.toLowerCase()
          .includes(globalSearch?.toLowerCase()) ||
        items.device?.position
          ?.toLowerCase()
          .includes(globalSearch?.toLowerCase()) ||
        items.device?.location
          ?.toLowerCase()
          .includes(globalSearch?.toLowerCase())
    )
    if (tab === 1) {
      const onwarrantyArray = devicesArray.filter(items => {
        const today = new Date()
        const expiredDate = new Date(items.expire)
        const timeDifference = expiredDate.getTime() - today.getTime()
        const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
        return daysRemaining >= 0
      })

      setWarrantyFilter(onwarrantyArray)
    } else if (tab === 2) {
      const expiredArray = devicesArray.filter(items => {
        const today = new Date()
        const expiredDate = new Date(items.expire)
        const timeDifference = expiredDate.getTime() - today.getTime()
        const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
        return daysRemaining <= 0
      })
      setWarrantyFilter(expiredArray)
    } else {
      setWarrantyFilter(devicesArray)
    }
  }, [tab, warrantyData, globalSearch])

  const columns: TableColumn<WarrantiesType>[] = [
    {
      name: t('deviceSerialTb'),
      selector: item => item.device.id,
      sortable: false,
      center: true
    },
    {
      name: t('deviceNameTb'),
      cell: item => (
        <div
          className='flex justify-center tooltip w-[200px]'
          data-tip={item.device.name ?? '—'}
        >
          <div className='truncate max-w-[200px]'>
            <span>{item.device.name ?? '—'}</span>
          </div>
        </div>
      ),
      sortable: false,
      center: true
    },
    {
      name: t('deviceDate'),
      selector: item =>
        `${new Date(String(item.installDate)).toLocaleString('th-TH', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'UTC'
        })}`,
      sortable: false,
      center: true
    },
    {
      name: t('deviceWarrantyTb'),
      cell: item => {
        const today = new Date()
        const expiredDate = new Date(String(item?.expire))

        if (expiredDate < today) {
          return <span>{t('tabWarrantyExpired')}</span>
        }

        // const timeDifference = expiredDate.getTime() - today.getTime()
        // let daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))

        let years = expiredDate.getFullYear() - today.getFullYear()
        let months = expiredDate.getMonth() - today.getMonth()
        let days = expiredDate.getDate() - today.getDate()

        if (days < 0) {
          months--
          const lastMonthDays = new Date(
            expiredDate.getFullYear(),
            expiredDate.getMonth(),
            0
          ).getDate()
          days += lastMonthDays
        }

        if (months < 0) {
          years--
          months += 12
        }

        return (
          <span>
            {years > 0
              ? `${years} ${t('year')} ${months} ${t('month')} ${days} ${t(
                  'day'
                )}`
              : months > 0
              ? `${months} ${t('month')} ${days} ${t('day')}`
              : `${days} ${t('day')}`}
          </span>
        )
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
      cell: item => {
        return (
          <div className='flex items-center justify-center gap-3 p-3'>
            <button
              className='btn btn-ghost flex !text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-primary'
              key={item.id}
              onClick={() => navigate('/warranty/preview', { state: item })}
            >
              <RiPrinterLine size={20} />
            </button>
            {(role === 'SUPER' || role === 'SERVICE') && (
              <>
                <div className='divider divider-horizontal mx-0'></div>
                <button
                  className='btn btn-ghost flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-primary'
                  onClick={() => {
                    openEditModal(item)
                  }}
                >
                  <RiEditLine size={20} />
                </button>
              </>
            )}
            {role === 'SUPER' && (
              <button
                className='btn btn-ghost flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-red-500'
                onClick={() =>
                  Swal.fire({
                    title: t('deleteWarranty'),
                    text: t('deleteWarrantyText'),
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
                      deleteWarranty(item.id)
                    }
                  })
                }
              >
                <RiDeleteBin7Line size={20} />
              </button>
            )}
          </div>
        )
      },
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
          data={warrantyFilter}
          progressPending={isLoading}
          progressComponent={<Loading />}
          noDataComponent={<DataTableNoData />}
          paginationRowsPerPageOptions={[10, 20, 50, 100, 150, 200]}
          className='md:!max-h-[calc(100dvh-350px)]'
        />
      </div>
    )
  }, [warrantyFilter, isLoading, t])

  const oneYearLater = new Date()
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1)

  const formattedMinDate = oneYearLater.toISOString().split('T')[0]

  const companyList = [
    {
      key: 0,
      value: 'SCI 1'
    },
    {
      key: 1,
      value: 'SCI 2'
    }
  ]

  return (
    <div className='p-3 px-[16px]'>
      {manageMenu}
      <div className='flex flex-col lg:flex-row lg:items-center justify-between mt-3'>
        <span className='text-[20px] font-medium'></span>
        <div className='flex flex-col lg:flex-row mt-3 lg:mt-0 lg:items-center items-end lg:gap-3'>
          <button
            className='btn btn-neutral max-w-[150px]'
            onClick={() => addModalRef.current?.showModal()}
          >
            {t('addWarrantyButton')}
          </button>
        </div>
      </div>
      {DataTableComponent}

      <dialog ref={addModalRef} className='modal overflow-y-scroll py-10'>
        <form
          onSubmit={handleSubmit}
          className='modal-box w-5/6 max-w-[50rem] h-max max-h-max'
        >
          <h3 className='font-bold text-lg'>{t('addWarrantyButton')}</h3>
          {/* Invoic */}
          <div className='form-control w-full'>
            <label className='label flex-col items-start w-full mb-3'>
              <span className='label-text text-wrap mb-2'>
                <span className='font-medium text-red-500 mr-1'>*</span>
                {t('invoice')}
              </span>
              <input
                name='invoice'
                type='text'
                value={warrantyForm.invoice}
                onChange={handleChange}
                className='input  w-full'
                maxLength={23}
                autoFocus={true}
              />
            </label>
          </div>

          {/* productName */}
          <div className='form-control w-full'>
            <label className='label flex-col items-start w-full mb-3'>
              <span className='label-text text-wrap mb-2'>
                <span className='font-medium text-red-500 mr-1'>*</span>
                {t('productName')}
              </span>
              <input
                name='product'
                type='text'
                value={warrantyForm.product}
                onChange={handleChange}
                className='input  w-full'
                maxLength={23}
              />
            </label>
          </div>

          {/* selectDeviceDrop */}
          <div className='form-control w-full'>
            <label className='label flex-col items-start w-full mb-3'>
              <span className='label-text text-wrap mb-2'>
                <span className='font-medium text-red-500 mr-1'>*</span>
                {t('selectDeviceDrop')}
              </span>
              <Select
                options={mapOptions<DeviceListType, keyof DeviceListType>(
                  deviceList,
                  'staticName',
                  'id'
                )}
                value={mapDefaultValue<DeviceListType, keyof DeviceListType>(
                  deviceList,
                  warrantyForm.devName,
                  'staticName',
                  'id'
                )}
                onChange={e =>
                  setWarrantyForm({
                    ...warrantyForm,
                    devName: e?.value as string,
                    model: String(
                      e?.label.substring(0, 3) === 'eTP' ? 'eTEMP' : 'i-TeMS'
                    )
                  })
                }
                autoFocus={false}
                className='react-select-container custom-menu-select z-[75] min-w-full'
                classNamePrefix='react-select'
              />
            </label>
          </div>

          {/* modelName */}
          <div className='form-control w-full'>
            <label className='label flex-col items-start w-full mb-3'>
              <span className='label-text text-wrap mb-2'>
                <span className='font-medium text-red-500 mr-1'>*</span>
                {t('modelName')}
              </span>
              <input
                name='model'
                type='text'
                value={warrantyForm.model}
                onChange={handleChange}
                className='input  w-full'
                maxLength={23}
              />
            </label>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full'>
            {/* Right Column - 2/3 of the grid (70%) */}
            <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
              {/* startDate */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('startDate')}
                  </span>
                  <input
                    type='date'
                    className='input  w-full'
                    onChange={e =>
                      setWarrantyForm({
                        ...warrantyForm,
                        installDate: e.target.value
                      })
                    }
                  />
                </label>
              </div>

              {/* endDate */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('endDate')}
                  </span>
                  <input
                    type='date'
                    className='input  w-full'
                    min={formattedMinDate}
                    onChange={e =>
                      setWarrantyForm({
                        ...warrantyForm,
                        expire: e.target.value
                      })
                    }
                  />
                </label>
              </div>
            </div>
          </div>

          {/* customerName */}
          <div className='form-control w-full'>
            <label className='label flex-col items-start w-full mb-3'>
              <span className='label-text text-wrap mb-2'>
                <span className='font-medium text-red-500 mr-1'>*</span>
                {t('customerName')}
              </span>
              <Select
                options={mapOptions<HospitalsType, keyof HospitalsType>(
                  hospital,
                  'id',
                  'hosName'
                )}
                value={mapDefaultValue<HospitalsType, keyof HospitalsType>(
                  hospital,
                  warrantyForm.devName,
                  'id',
                  'hosName'
                )}
                onChange={e =>
                  setWarrantyForm({
                    ...warrantyForm,
                    customerName: e?.label as string,
                    customerAddress: String(
                      hospital
                        .filter(items =>
                          items.id
                            .toLowerCase()
                            .includes(String(e?.value).toLowerCase())
                        )
                        .map(items => items.hosAddress)[0] ?? '—'
                    )
                  })
                }
                menuPlacement='top'
                autoFocus={false}
                className='react-select-container custom-menu-select z-[80] min-w-full'
                classNamePrefix='react-select'
              />
            </label>
          </div>

          {/* customerAddress */}
          <div className='form-control w-full'>
            <label className='label flex-col items-start w-full mb-3'>
              <span className='label-text text-wrap mb-2'>
                <span className='font-medium text-red-500 mr-1'>*</span>
                {t('customerAddress')}
              </span>
              <input
                name='customerAddress'
                type='text'
                value={warrantyForm.customerAddress}
                onChange={handleChange}
                className='input  w-full'
                maxLength={23}
              />
            </label>
          </div>

          {/* distributionCompany */}
          <div className='form-control w-full'>
            <label className='label flex-col items-start w-full mb-3'>
              <span className='label-text text-wrap mb-2'>
                <span className='font-medium text-red-500 mr-1'>*</span>
                {t('distributionCompany')}
              </span>
              <Select
                options={mapOptions<Company, keyof Company>(
                  companyList,
                  'key',
                  'value'
                )}
                value={mapDefaultValue<Company, keyof Company>(
                  companyList,
                  warrantyForm.saleDepartment,
                  'key',
                  'value'
                )}
                onChange={e =>
                  setWarrantyForm({
                    ...warrantyForm,
                    saleDepartment: e?.label as string
                  })
                }
                menuPlacement='top'
                autoFocus={false}
                className='react-select-container custom-menu-select z-[100] min-w-full'
                classNamePrefix='react-select'
              />
            </label>
          </div>

          <div className='form-control w-full'>
            <label className='label flex-col items-start w-full mb-3'>
              <span className='label-text text-wrap mb-2'>{t('remmark')}</span>
              <input
                name='comment'
                type='text'
                value={warrantyForm.comment}
                onChange={handleChange}
                className='input  w-full'
                maxLength={256}
              />
            </label>
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
          <h3 className='font-bold text-lg'>{t('editWarranty')}</h3>
          {/* Invoic */}
          <div className='form-control w-full'>
            <label className='label flex-col items-start w-full mb-3'>
              <span className='label-text text-wrap mb-2'>
                <span className='font-medium text-red-500 mr-1'>*</span>
                {t('invoice')}
              </span>
              <input
                name='invoice'
                type='text'
                value={warrantyForm.invoice}
                onChange={handleChange}
                className='input  w-full'
                maxLength={23}
                autoFocus={true}
              />
            </label>
          </div>

          {/* productName */}
          <div className='form-control w-full'>
            <label className='label flex-col items-start w-full mb-3'>
              <span className='label-text text-wrap mb-2'>
                <span className='font-medium text-red-500 mr-1'>*</span>
                {t('productName')}
              </span>
              <input
                name='product'
                type='text'
                value={warrantyForm.product}
                onChange={handleChange}
                className='input  w-full'
                maxLength={23}
              />
            </label>
          </div>

          {/* selectDeviceDrop */}
          <div className='form-control w-full'>
            <label className='label flex-col items-start w-full mb-3'>
              <span className='label-text text-wrap mb-2'>
                <span className='font-medium text-red-500 mr-1'>*</span>
                {t('selectDeviceDrop')}
              </span>
              <Select
                options={mapOptions<DeviceListType, keyof DeviceListType>(
                  deviceList,
                  'staticName',
                  'id'
                )}
                value={mapDefaultValue<DeviceListType, keyof DeviceListType>(
                  deviceList,
                  warrantyForm.devName,
                  'staticName',
                  'id'
                )}
                onChange={e =>
                  setWarrantyForm({
                    ...warrantyForm,
                    devName: e?.value as string,
                    model: String(
                      e?.label.substring(0, 3) === 'eTP' ? 'eTEMP' : 'i-TeMS'
                    )
                  })
                }
                autoFocus={false}
                className='react-select-container custom-menu-select z-[75] min-w-full'
                classNamePrefix='react-select'
              />
            </label>
          </div>

          {/* modelName */}
          <div className='form-control w-full'>
            <label className='label flex-col items-start w-full mb-3'>
              <span className='label-text text-wrap mb-2'>
                <span className='font-medium text-red-500 mr-1'>*</span>
                {t('modelName')}
              </span>
              <input
                name='model'
                type='text'
                value={warrantyForm.model}
                onChange={handleChange}
                className='input  w-full'
                maxLength={23}
              />
            </label>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full'>
            {/* Right Column - 2/3 of the grid (70%) */}
            <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
              {/* startDate */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('startDate')}
                  </span>
                  <input
                    type='date'
                    className='input  w-full'
                    value={warrantyForm.installDate}
                    onChange={e =>
                      setWarrantyForm({
                        ...warrantyForm,
                        installDate: e.target.value
                      })
                    }
                  />
                </label>
              </div>

              {/* endDate */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('endDate')}
                  </span>
                  <input
                    type='date'
                    className='input  w-full'
                    value={warrantyForm.expire}
                    onChange={e =>
                      setWarrantyForm({
                        ...warrantyForm,
                        expire: e.target.value
                      })
                    }
                  />
                </label>
              </div>
            </div>
          </div>

          {/* customerName */}
          <div className='form-control w-full'>
            <label className='label flex-col items-start w-full mb-3'>
              <span className='label-text text-wrap mb-2'>
                <span className='font-medium text-red-500 mr-1'>*</span>
                {t('customerName')}
              </span>
              <Select
                options={mapOptions<HospitalsType, keyof HospitalsType>(
                  hospital,
                  'id',
                  'hosName'
                )}
                value={mapDefaultValue<HospitalsType, keyof HospitalsType>(
                  hospital,
                  warrantyForm.customerName,
                  'hosName',
                  'hosName'
                )}
                onChange={e =>
                  setWarrantyForm({
                    ...warrantyForm,
                    customerName: e?.label as string,
                    customerAddress: String(
                      hospital
                        .filter(items =>
                          items.id
                            .toLowerCase()
                            .includes(String(e?.value).toLowerCase())
                        )
                        .map(items => items.hosAddress)[0] ?? '—'
                    )
                  })
                }
                menuPlacement='top'
                autoFocus={false}
                className='react-select-container custom-menu-select z-[80] min-w-full'
                classNamePrefix='react-select'
              />
            </label>
          </div>

          {/* customerAddress */}
          <div className='form-control w-full'>
            <label className='label flex-col items-start w-full mb-3'>
              <span className='label-text text-wrap mb-2'>
                <span className='font-medium text-red-500 mr-1'>*</span>
                {t('customerAddress')}
              </span>
              <input
                name='customerAddress'
                type='text'
                value={warrantyForm.customerAddress}
                onChange={handleChange}
                className='input  w-full'
                maxLength={23}
              />
            </label>
          </div>

          {/* distributionCompany */}
          <div className='form-control w-full'>
            <label className='label flex-col items-start w-full mb-3'>
              <span className='label-text text-wrap mb-2'>
                <span className='font-medium text-red-500 mr-1'>*</span>
                {t('distributionCompany')}
              </span>
              <Select
                options={mapOptions<Company, keyof Company>(
                  companyList,
                  'key',
                  'value'
                )}
                value={mapDefaultValue<Company, keyof Company>(
                  companyList,
                  warrantyForm.saleDepartment,
                  'value',
                  'value'
                )}
                onChange={e =>
                  setWarrantyForm({
                    ...warrantyForm,
                    saleDepartment: e?.label as string
                  })
                }
                menuPlacement='top'
                autoFocus={false}
                className='react-select-container custom-menu-select z-[100] min-w-full'
                classNamePrefix='react-select'
              />
            </label>
          </div>

          <div className='form-control w-full'>
            <label className='label flex-col items-start w-full mb-3'>
              <span className='label-text text-wrap mb-2'>{t('remmark')}</span>
              <input
                name='comment'
                type='text'
                value={warrantyForm.comment}
                onChange={handleChange}
                className='input  w-full'
                maxLength={256}
              />
            </label>
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

export default Warranty
