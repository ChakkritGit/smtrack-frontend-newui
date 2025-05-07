import { useTranslation } from 'react-i18next'
import HospitalAndWard from '../../../components/filter/hospitalAndWard'
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import {
  AddDeviceForm,
  DeviceTmsType
} from '../../../types/tms/devices/deviceType'
import axiosInstance from '../../../constants/axios/axiosInstance'
import { RootState } from '../../../redux/reducers/rootReducer'
import { useDispatch, useSelector } from 'react-redux'
import { AxiosError } from 'axios'
import {
  setHosId,
  setSholdFetch,
  setSubmitLoading,
  setTokenExpire
} from '../../../redux/actions/utilsActions'
import DataTable, { TableColumn } from 'react-data-table-component'
import HopitalSelect from '../../../components/selects/hopitalSelect'
import WardSelectTms from '../../../components/selects/tms/wardSelect'
import Swal from 'sweetalert2'
import { responseType } from '../../../types/smtrack/utilsRedux/utilsReduxType'
import { RiDeleteBin7Line, RiEditLine, RiFileCopyLine } from 'react-icons/ri'
import toast from 'react-hot-toast'
import Loading from '../../../components/skeleton/table/loading'
import DataTableNoData from '../../../components/skeleton/table/noData'
import { GlobalContextType } from '../../../types/global/globalContext'
import { GlobalContext } from '../../../contexts/globalContext'

const ManageDevice = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { wardId, globalSearch, hosId, shouldFetch } =
    useSelector((state: RootState) => state.utils)
  const { searchRef, isFocused, setIsFocused, isCleared, setIsCleared } =
    useContext(GlobalContext) as GlobalContextType
  const [devices, setDevices] = useState<DeviceTmsType[]>([])
  const [loading, setLoading] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [formData, setFormData] = useState<AddDeviceForm>({
    ward: '',
    wardName: '',
    hospital: '',
    hospitalName: '',
    sn: '',
    name: ''
  })

  const addModalRef = useRef<HTMLDialogElement>(null)
  const editModalRef = useRef<HTMLDialogElement>(null)

  const fetchDevices = useCallback(
    async (page: number, size = perPage, search?: string) => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(
          `/legacy/device?${
            wardId ? `ward=${wardId}&` : hosId ? `ward=${hosId}&` : ''
          }page=${page}&perpage=${size} ${search ? `&filter=${search}` : ''}`
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

  const resetForm = () => {
    setFormData({
      ward: '',
      wardName: '',
      hospital: '',
      hospitalName: '',
      sn: '',
      name: ''
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    if (
      formData.ward !== '' &&
      hosId !== '' &&
      formData.sn !== '' &&
      formData.name !== ''
    ) {
      const body = {
        ward: formData.ward,
        hospital: hosId,
        sn: formData.sn,
        name: formData.name
      }
      try {
        const response = await axiosInstance.post<responseType<DeviceTmsType>>(
          '/legacy/device',
          body
        )

        addModalRef.current?.close()
        resetForm()
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.data.token,
          icon: 'success',
          confirmButtonText: t('copyToken'),
          showConfirmButton: true,
          showCancelButton: false
        }).finally(async () => {
          await fetchDevices(1)
          try {
            navigator.clipboard.writeText(response.data.data.token)
            toast.success(t('copyToClip'))
          } catch (error) {
            console.error('Failed to copy: ', error)
            toast.error(t('copyToClipFaile'))
          }
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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

  const deleteDevice = async (id: string) => {
    const result = await Swal.fire({
      title: t('deleteDeviceTitle'),
      text: t('notReverseText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('confirmButton'),
      cancelButtonText: t('cancelButton')
    })

    if (result.isConfirmed) {
      dispatch(setSubmitLoading())
      try {
        const response = await axiosInstance.delete<
          responseType<DeviceTmsType>
        >(`/legacy/device/${id}`)
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: 'success',
          showConfirmButton: false,
          timer: 2500
        }).finally(async () => {
          await fetchDevices(1)
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
  }

  const openEditModal = (device: DeviceTmsType) => {
    dispatch(setHosId(device.hospital))
    setFormData({
      id: device.id,
      hospital: device.hospital,
      hospitalName: device.hospitalName,
      ward: device.ward,
      name: device.name,
      wardName: device.wardName,
      sn: device.sn
    })
    editModalRef.current?.showModal()
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())
    if (
      formData.ward !== '' &&
      hosId !== '' &&
      formData.sn !== '' &&
      formData.name !== ''
    ) {
      try {
        const body = {
          ward: formData.ward,
          hospital: hosId,
          wardName: formData.wardName,
          hospitalName: formData.hospitalName,
          sn: formData.sn,
          name: formData.name
        }
        await axiosInstance.put<responseType<DeviceTmsType>>(
          `/legacy/device/${formData.id}`,
          body
        )
        editModalRef.current?.close()
        resetForm()
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: t('submitSuccess'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2500
        }).finally(async () => {
          await fetchDevices(1)
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

  const columns: TableColumn<DeviceTmsType>[] = [
    {
      name: t('deviceSerialTb'),
      cell: item => <span title={item.sn}>{item.sn}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('deviceNameBox'),
      cell: item => item.name,
      sortable: false
      // center: true
    },
    {
      name: t('hospitalsName'),
      cell: item => item.hospitalName,
      sortable: false
      // center: true
    },
    {
      name: t('wardsName'),
      cell: item => item.wardName,
      sortable: false
      // center: true
    },
    {
      name: t('token'),
      cell: item => (
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
          <span className='truncate max-w-[80px]'>{item.token}</span>
          <RiFileCopyLine size={18} className='text-base-content/70' />
        </div>
      ),
      sortable: false,
      center: true
    },
    {
      name: t('action'),
      cell: item => (
        <div className='flex items-center justify-center gap-3 p-3'>
          <button
            className='btn btn-ghost flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-red-500'
            onClick={() => deleteDevice(item.sn)}
          >
            <RiDeleteBin7Line size={20} />
          </button>
          <button
            className='btn btn-ghost flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-primary'
            onClick={() => openEditModal(item)}
          >
            <RiEditLine size={20} />
          </button>
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

  return (
    <div>
      <div className='flex flex-col lg:flex-row lg:items-center justify-between mt-3'>
        <span className='text-[20px] font-medium'></span>
        <div className='flex flex-col lg:flex-row mt-3 lg:mt-0 lg:items-center items-end gap-4'>
          <HospitalAndWard />
          <button
            className='btn btn-neutral max-w-[130px]'
            onClick={() => addModalRef.current?.showModal()}
          >
            {t('addDeviceButton')}
          </button>
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
          className='md:!max-h-[calc(100dvh-300px)]'
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
              {/* Hospital */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('userHospitals')}
                  </span>
                  <HopitalSelect
                    formData={formData}
                    setFormData={setFormData}
                  />
                </label>
              </div>

              {/* Ward */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('userWard')}
                  </span>
                  <WardSelectTms
                    formData={formData}
                    setFormData={setFormData}
                  />
                </label>
              </div>

              {/* sn */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('deviceSerialTb')}
                  </span>
                  <input
                    name='sn'
                    type='text'
                    value={formData.sn}
                    onChange={handleChange}
                    className='input input-bordered w-full'
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
                    className='input input-bordered w-full'
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

      <dialog ref={editModalRef} className='modal overflow-y-scroll py-10'>
        <form
          onSubmit={handleUpdate}
          className='modal-box w-11/12 max-w-5xl h-max max-h-max'
        >
          <h3 className='font-bold text-lg'>{t('editUserButton')}</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full'>
            {/* Right Column - 2/3 of the grid (70%) */}
            <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
              {/* Hospital */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('userHospitals')}
                  </span>
                  <HopitalSelect
                    formData={formData}
                    setFormData={setFormData}
                  />
                </label>
              </div>

              {/* Ward */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('userWard')}
                  </span>
                  <WardSelectTms
                    formData={formData}
                    setFormData={setFormData}
                  />
                </label>
              </div>

              {/* sn */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('deviceSerialTb')}
                  </span>
                  <input
                    name='sn'
                    type='text'
                    value={formData.sn}
                    onChange={handleChange}
                    className='input input-bordered w-full'
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
                    className='input input-bordered w-full'
                    maxLength={80}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className='modal-action mt-4 md:mt-6'>
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

export default ManageDevice
