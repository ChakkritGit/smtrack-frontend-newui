import { useTranslation } from 'react-i18next'
import {
  ChangeEvent,
  FormEvent,
  memo,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { AxiosError } from 'axios'
import axiosInstance from '../../constants/axios/axiosInstance'
import {
  HospitalsType,
  WardType
} from '../../types/global/hospitals/hospitalType'
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import DataTable, { TableColumn } from 'react-data-table-component'
import DataTableNoData from '../../components/skeleton/table/noData'
import {
  RiArrowRightSLine,
  RiArrowUpSLine,
  RiDeleteBin7Line,
  RiEditLine
} from 'react-icons/ri'
import { isSafeImageUrl, resizeImage } from '../../constants/utils/image'
import {
  FormAddHospitalState,
  FormAddWardType
} from '../../types/smtrack/users/usersType'
import defaultPic from '../../assets/images/default-pic.png'
import Swal from 'sweetalert2'
import {
  setSubmitLoading,
  setTokenExpire
} from '../../redux/actions/utilsActions'
import { GlobalContextType } from '../../types/global/globalContext'
import { GlobalContext } from '../../contexts/globalContext'
import AddHopitalSelect from '../../components/selects/addHopitalSelect'
import { Option } from '../../types/global/hospitalAndWard'
import Select, { SingleValue } from 'react-select'

interface FormWardType {
  value: string
  label: string
}

const typeOption = [
  { value: 'NEW', label: 'NEW' },
  { value: 'LEGACY', label: 'LEGACY' }
]

const ManageHospital = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { hospital, fetchHospital } = useContext(
    GlobalContext
  ) as GlobalContextType
  const { globalSearch, tokenDecode, hosId } = useSelector(
    (state: RootState) => state.utils
  )
  const [filterHospital, setFilterHospital] = useState<HospitalsType[]>([])
  const [imageProcessing, setImageProcessing] = useState(false)
  const [hospitalForm, setHospitalForm] = useState<FormAddHospitalState>({
    hosAddress: '',
    hosLatitude: '',
    hosLongitude: '',
    hosName: '',
    hosPic: null,
    hosTel: '',
    userContact: '',
    userTel: '',
    imagePreview: null
  })
  const [wardForm, setWardForm] = useState<FormAddWardType>({
    wardName: '',
    hosId: '',
    type: ''
  })
  const { wardId, role } = tokenDecode ?? {}

  const addHosModalRef = useRef<HTMLDialogElement>(null)
  const editHosModalRef = useRef<HTMLDialogElement>(null)
  const addWardModalRef = useRef<HTMLDialogElement>(null)
  const editWardModalRef = useRef<HTMLDialogElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetForm = () => {
    setHospitalForm({
      hosAddress: '',
      hosLatitude: '',
      hosLongitude: '',
      hosName: '',
      hosPic: null,
      hosTel: '',
      userContact: '',
      userTel: '',
      imagePreview: null
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const resetFormWard = () => {
    setWardForm({
      wardName: '',
      hosId: '',
      type: ''
    })
  }

  const handleSubmitHospital = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    if (
      hospitalForm.hosName &&
      hospitalForm.hosAddress &&
      hospitalForm.hosTel &&
      hospitalForm.userTel
    ) {
      try {
        const formDataObj = createFormData()
        await axiosInstance.post<responseType<FormAddHospitalState>>(
          '/auth/hospital',
          formDataObj,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        )

        addHosModalRef.current?.close()
        resetForm()
        await fetchHospital()
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: t('submitSuccess'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2500
        })
      } catch (error) {
        addHosModalRef.current?.close()
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
          }).finally(() => addHosModalRef.current?.showModal())
        } else {
          console.error(error)
        }
      } finally {
        dispatch(setSubmitLoading())
      }
    } else {
      addHosModalRef.current?.close()
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: 'warning',
        showConfirmButton: false,
        timer: 2500
      }).finally(() => addHosModalRef.current?.showModal())
      dispatch(setSubmitLoading())
    }
  }

  const handleUpdateHospital = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    if (
      hospitalForm.hosName &&
      hospitalForm.hosAddress &&
      hospitalForm.hosTel &&
      hospitalForm.userTel
    ) {
      try {
        const formDataObj = createFormData()
        await axiosInstance.put<responseType<FormAddHospitalState>>(
          `/auth/hospital/${hospitalForm.id}`,
          formDataObj,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        )

        editHosModalRef.current?.close()
        resetForm()
        await fetchHospital()
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: t('submitSuccess'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2500
        })
      } catch (error) {
        editHosModalRef.current?.close()
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
          }).finally(() => editHosModalRef.current?.showModal())
        } else {
          console.error(error)
        }
      } finally {
        dispatch(setSubmitLoading())
      }
    } else {
      editHosModalRef.current?.close()
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: 'warning',
        showConfirmButton: false,
        timer: 2500
      }).finally(() => editHosModalRef.current?.showModal())
      dispatch(setSubmitLoading())
    }
  }

  const handleSubmitWard = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    if (wardForm.wardName && hosId && wardForm.type) {
      try {
        wardForm.hosId = hosId
        await axiosInstance.post<responseType<FormAddHospitalState>>(
          '/auth/ward',
          wardForm
        )

        addWardModalRef.current?.close()
        resetFormWard()
        await fetchHospital()
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: t('submitSuccess'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2500
        })
      } catch (error) {
        addWardModalRef.current?.close()
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
          }).finally(() => addWardModalRef.current?.showModal())
        } else {
          console.error(error)
        }
      } finally {
        dispatch(setSubmitLoading())
      }
    } else {
      addWardModalRef.current?.close()
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: 'warning',
        showConfirmButton: false,
        timer: 2500
      }).finally(() => addWardModalRef.current?.showModal())
      dispatch(setSubmitLoading())
    }
  }

  const handleUpdateWard = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    if (wardForm.wardName) {
      try {
        await axiosInstance.put<responseType<FormAddHospitalState>>(
          `/auth/ward/${wardForm.id}`,
          {
            wardName: wardForm.wardName,
            type: wardForm.type
          }
        )

        editWardModalRef.current?.close()
        resetFormWard()
        await fetchHospital()
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: t('submitSuccess'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2500
        })
      } catch (error) {
        editWardModalRef.current?.close()
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
          }).finally(() => editWardModalRef.current?.showModal())
        } else {
          console.error(error)
        }
      } finally {
        dispatch(setSubmitLoading())
      }
    } else {
      editWardModalRef.current?.close()
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: 'warning',
        showConfirmButton: false,
        timer: 2500
      }).finally(() => editWardModalRef.current?.showModal())
      dispatch(setSubmitLoading())
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageProcessing(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      const reSized = await resizeImage(file)
      setHospitalForm(prev => ({
        ...prev,
        hosPic: reSized,
        imagePreview: URL.createObjectURL(file)
      }))
      setImageProcessing(false)
    }
  }

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')

    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/)

    if (match) {
      const [, part1, part2, part3] = match
      return [part1, part2, part3].filter(Boolean).join('-')
    }

    return value
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    let formattedValue = value

    formattedValue =
      name === 'hosTel' || name === 'userTel' ? formatPhoneNumber(value) : value

    setHospitalForm(prev => ({
      ...prev,
      [name]: formattedValue
    }))
  }

  const handleWardChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setWardForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const createFormData = () => {
    const formDataObj = new FormData()

    const keyMapping: Record<string, string> = {
      hosPic: 'image'
    }

    Object.entries(hospitalForm).forEach(([key, value]) => {
      if (value === null || value === undefined || key === 'imagePreview')
        return

      const mappedKey = keyMapping[key as keyof typeof keyMapping] || key

      if (value instanceof File) {
        formDataObj.append(mappedKey, value)
      } else {
        formDataObj.append(mappedKey, value as string)
      }
    })

    return formDataObj
  }

  const openEditHosModal = (hos: HospitalsType) => {
    setHospitalForm({
      id: hos.id,
      hosAddress: hos.hosAddress,
      hosLatitude: hos.hosLatitude,
      hosLongitude: hos.hosLongitude,
      hosName: hos.hosName,
      hosPic: null,
      hosTel: hos.hosTel,
      userContact: hos.userContact,
      userTel: hos.userTel,
      imagePreview: hos.hosPic
    })
    editHosModalRef.current?.showModal()
  }

  const openEditWardModal = (ward: WardType) => {
    setWardForm({
      id: ward.id,
      wardName: ward.wardName,
      hosId: ward.hosId,
      type: ward.type
    })
    editWardModalRef.current?.showModal()
  }

  const deleteHospital = async (id: string) => {
    const result = await Swal.fire({
      title: t('deleteHosTitle'),
      text: t('notReverseText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('confirmButton'),
      cancelButtonText: t('cancelButton'),
      customClass: {
        actions: 'custom-action',
        confirmButton: 'custom-confirmButton',
        cancelButton: 'custom-cancelButton'
      }
    })

    if (result.isConfirmed) {
      dispatch(setSubmitLoading())
      try {
        const response = await axiosInstance.delete<
          responseType<FormAddHospitalState>
        >(`/auth/hospital/${id}`)
        await fetchHospital()
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
  }

  const deleteWard = async (id: string) => {
    const result = await Swal.fire({
      title: t('deleteWardTitle'),
      text: t('notReverseText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('confirmButton'),
      cancelButtonText: t('cancelButton'),
      customClass: {
        actions: 'custom-action',
        confirmButton: 'custom-confirmButton',
        cancelButton: 'custom-cancelButton'
      }
    })

    if (result.isConfirmed) {
      dispatch(setSubmitLoading())
      try {
        const response = await axiosInstance.delete<
          responseType<FormAddHospitalState>
        >(`/auth/ward/${id}`)
        await fetchHospital()
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
  }

  useEffect(() => {
    const filter = hospital?.filter(
      item =>
        item.hosName.toLowerCase().includes(globalSearch.toLowerCase()) ||
        item.hosTel?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        item.userTel?.toLowerCase().includes(globalSearch.toLowerCase())
    )
    setFilterHospital(filter)
  }, [hospital, globalSearch])

  const columns: TableColumn<HospitalsType>[] = [
    {
      name: t('noNumber'),
      cell: (item, _index) => {
        return <div>{item.hosSeq}</div>
      },
      sortable: false,
      center: true
    },
    {
      name: t('hosPicture'),
      cell: item => (
        <div className='avatar'>
          <div className='w-11 rounded'>
            <img
              src={
                isSafeImageUrl(String(item.hosPic))
                  ? String(item.hosPic)
                  : defaultPic
              }
              alt='hos-logo'
            />
          </div>
        </div>
      ),
      center: true,
      sortable: false
    },
    {
      name: t('hosName'),
      cell: item => item.hosName,
      // center: true,
      sortable: false
    },
    {
      name: t('hosAddress'),
      cell: item =>
        item.hosAddress ? (
          <span className='truncate max-w-[200px]' title={item.hosAddress}>
            {item.hosAddress}
          </span>
        ) : (
          '—'
        ),
      // center: true,
      sortable: false
    },
    {
      name: t('hosTel'),
      cell: item => item.hosTel ?? '—',
      center: true,
      sortable: false
    },
    {
      name: t('lastModified'),
      cell: item => (
        <div className='flex items-center gap-2'>
          <span>
            {new Date(item.updateAt)?.toLocaleString('th-TH', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
              timeZone: 'UTC'
            })}
          </span>
          <span>
            {new Date(item.updateAt)?.toLocaleString('th-TH', {
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
      cell: (item, index) =>
        tokenDecode?.hosId !== item.id && (
          <div
            className='flex items-center justify-center gap-3 p-3'
            key={index}
          >
            <button
              onClick={() => openEditHosModal(item)}
              className='btn btn-ghost flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-primary'
            >
              <RiEditLine size={20} />
            </button>
            {role === 'SUPER' && (
              <button
                onClick={() => deleteHospital(item.id)}
                className='btn btn-ghost flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-red-500'
              >
                <RiDeleteBin7Line size={20} />
              </button>
            )}
          </div>
        ),
      center: true,
      sortable: false
    }
  ]

  const subWardColumns: TableColumn<WardType>[] = [
    {
      name: t('noNumber'),
      cell: (_, index) => {
        return <div>{index + 1}</div>
      },
      sortable: false,
      center: true
    },
    {
      name: t('wardName'),
      cell: item => item.wardName,
      // center: true,
      sortable: false
    },
    {
      name: t('lastModified'),
      cell: item => (
        <div className='flex items-center gap-2'>
          <span>
            {new Date(item.updateAt)?.toLocaleString('th-TH', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
              timeZone: 'UTC'
            })}
          </span>
          <span>
            {new Date(item.updateAt)?.toLocaleString('th-TH', {
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
      cell: (item, index) =>
        wardId !== item.id && (
          <div
            className='flex items-center justify-center gap-3 p-3'
            key={index}
          >
            <button
              onClick={() => openEditWardModal(item)}
              className='btn btn-ghost flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-primary'
            >
              <RiEditLine size={20} />
            </button>
            {role === 'SUPER' && (
              <button
                onClick={() => deleteWard(item.id)}
                className='btn btn-ghost flex text-white min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] p-0 bg-red-500'
              >
                <RiDeleteBin7Line size={20} />
              </button>
            )}
          </div>
        ),
      center: true,
      sortable: false
    }
  ]

  const ExpandedComponent = memo(({ data }: { data: HospitalsType }) => (
    <div className='dataTableSubWrapper bg-base-100 rounded-field duration-300 ease-linear'>
      <DataTable
        columns={subWardColumns}
        data={data.ward}
        noDataComponent={<DataTableNoData />}
        responsive
      />
    </div>
  ))

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

  const getType = (type: SingleValue<Option>) => {
    if (type?.value !== '') {
      setWardForm({ ...wardForm, type: String(type?.value) })
    }
  }

  return (
    <div>
      <div className='flex flex-col lg:flex-row lg:items-center justify-between mt-3'>
        <span></span>
        <div className='flex flex-col lg:flex-row mt-3 lg:mt-0 lg:items-center items-end gap-3'>
          {(role === 'SUPER' || role === 'SERVICE') && (
            <button
              className='btn btn-neutral'
              onClick={() => addHosModalRef.current?.showModal()}
            >
              {t('addHos')}
            </button>
          )}
          <button
            className='btn btn-neutral'
            onClick={() => addWardModalRef.current?.showModal()}
          >
            {t('addWard')}
          </button>
        </div>
      </div>
      <div className='dataTableWrapper bg-base-100 rounded-field p-3 mt-5 duration-300 ease-linear'>
        <DataTable
          columns={columns}
          data={filterHospital}
          expandableRows
          expandOnRowClicked
          expandableRowsComponent={ExpandedComponent}
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 40, 60, 80, 100]}
          noDataComponent={<DataTableNoData />}
          pagination
          responsive
          fixedHeader
          className='md:!max-h-[calc(100dvh-370px)]'
          expandableIcon={{
            collapsed: (
              <RiArrowRightSLine size={24} className='text-base-content' />
            ),
            expanded: <RiArrowUpSLine size={24} className='text-base-content' />
          }}
        />
      </div>

      <dialog ref={addHosModalRef} className='modal overflow-y-scroll py-10'>
        <form
          onSubmit={handleSubmitHospital}
          className='modal-box w-11/12 max-w-5xl h-max max-h-max'
        >
          <h3 className='font-bold text-lg'>{t('addHos')}</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 w-full'>
            <div className='col-span-1 flex justify-center'>
              <div className='form-control'>
                <label className='label cursor-pointer image-hover flex flex-col justify-center'>
                  <span className='label-text text-wrap'>
                    {t('hosPicture')}
                  </span>
                  <input
                    key={hospitalForm.imagePreview}
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='hidden'
                  />
                  {imageProcessing ? (
                    <div className='mt-4 flex justify-center w-32 h-32 md:w-48 md:h-48'>
                      <span className='loading loading-dots loading-md'></span>
                    </div>
                  ) : (
                    <div className='mt-4 relative'>
                      <img
                        src={
                          isSafeImageUrl(String(hospitalForm.imagePreview))
                            ? String(hospitalForm.imagePreview)
                            : defaultPic
                        }
                        alt='Preview'
                        className={`w-32 h-32 md:w-48 md:h-48 rounded-field object-cover border-2 border-dashed border-base-300 ${
                          hospitalForm.imagePreview || defaultPic
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

            {/* Right Column - 2/3 of the grid (70%) */}
            <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
              {/* Hospital name */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('hosName')}
                  </span>
                  <input
                    name='hosName'
                    type='text'
                    value={hospitalForm.hosName}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={80}
                  />
                </label>
              </div>

              {/* Address */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('hosAddress')}
                  </span>
                  <input
                    name='hosAddress'
                    type='text'
                    value={hospitalForm.hosAddress}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={120}
                  />
                </label>
              </div>

              {/* tel */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('hosTel')}
                  </span>
                  <input
                    name='hosTel'
                    type='tel'
                    value={hospitalForm.hosTel}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={12}
                  />
                </label>
              </div>

              {/* userTel */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('userTel')}
                  </span>
                  <input
                    name='userTel'
                    type='tel'
                    value={hospitalForm.userTel}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={12}
                  />
                </label>
              </div>

              {/* hosLatitude */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    {t('hosLat')}
                  </span>
                  <input
                    name='hosLatitude'
                    type='text'
                    value={hospitalForm.hosLatitude}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={18}
                  />
                </label>
              </div>

              {/* hosLongitude */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    {t('hosLong')}
                  </span>
                  <input
                    name='hosLongitude'
                    type='text'
                    value={hospitalForm.hosLongitude}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={18}
                  />
                </label>
              </div>

              {/* userContact */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    {t('userContact')}
                  </span>
                  <input
                    name='userContact'
                    type='text'
                    value={hospitalForm.userContact}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={120}
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
                addHosModalRef.current?.close()
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

      <dialog ref={editHosModalRef} className='modal overflow-y-scroll py-10'>
        <form
          onSubmit={handleUpdateHospital}
          className='modal-box w-11/12 max-w-5xl h-max max-h-max'
        >
          <h3 className='font-bold text-lg'>{t('editHos')}</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 w-full'>
            <div className='col-span-1 flex justify-center'>
              <div className='form-control'>
                <label className='label cursor-pointer image-hover flex flex-col justify-center'>
                  <span className='label-text text-wrap'>
                    {t('hosPicture')}
                  </span>
                  <input
                    key={hospitalForm.imagePreview}
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='hidden'
                  />
                  {imageProcessing ? (
                    <div className='mt-4 flex justify-center w-32 h-32 md:w-48 md:h-48'>
                      <span className='loading loading-dots loading-md'></span>
                    </div>
                  ) : (
                    <div className='mt-4 relative'>
                      <img
                        src={
                          isSafeImageUrl(String(hospitalForm.imagePreview))
                            ? String(hospitalForm.imagePreview)
                            : defaultPic
                        }
                        alt='Preview'
                        className={`w-32 h-32 md:w-48 md:h-48 rounded-field object-cover border-2 border-dashed border-base-300 ${
                          hospitalForm.imagePreview || defaultPic
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

            {/* Right Column - 2/3 of the grid (70%) */}
            <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
              {/* Hospital name */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('hosName')}
                  </span>
                  <input
                    name='hosName'
                    type='text'
                    value={hospitalForm.hosName}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={80}
                  />
                </label>
              </div>

              {/* Address */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('hosAddress')}
                  </span>
                  <input
                    name='hosAddress'
                    type='text'
                    value={hospitalForm.hosAddress}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={120}
                  />
                </label>
              </div>

              {/* tel */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('hosTel')}
                  </span>
                  <input
                    name='hosTel'
                    type='tel'
                    value={hospitalForm.hosTel}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={12}
                  />
                </label>
              </div>

              {/* userTel */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('userTel')}
                  </span>
                  <input
                    name='userTel'
                    type='tel'
                    value={hospitalForm.userTel}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={12}
                  />
                </label>
              </div>

              {/* hosLatitude */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    {t('hosLat')}
                  </span>
                  <input
                    name='hosLatitude'
                    type='text'
                    value={hospitalForm.hosLatitude}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={18}
                  />
                </label>
              </div>

              {/* hosLongitude */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    {t('hosLong')}
                  </span>
                  <input
                    name='hosLongitude'
                    type='text'
                    value={hospitalForm.hosLongitude}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={18}
                  />
                </label>
              </div>

              {/* userContact */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    {t('userContact')}
                  </span>
                  <input
                    name='userContact'
                    type='text'
                    value={hospitalForm.userContact}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={120}
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
                editHosModalRef.current?.close()
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

      <dialog ref={addWardModalRef} className='modal overflow-y-scroll py-10'>
        <form
          onSubmit={handleSubmitWard}
          className='modal-box w-11/12 max-w-5xl min-h-[30rem] justify-between flex flex-col'
        >
          <div>
            <h3 className='font-bold text-lg'>{t('addWard')}</h3>
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
                    <AddHopitalSelect />
                  </label>
                </div>

                {/* Ward */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      <span className='font-medium text-red-500 mr-1'>*</span>
                      {t('userWard')}
                    </span>
                    <input
                      name='wardName'
                      type='text'
                      value={wardForm.wardName}
                      onChange={handleWardChange}
                      className='input input-bordered w-full'
                      maxLength={80}
                    />
                  </label>
                </div>
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      <span className='font-medium text-red-500 mr-1'>*</span>
                      {t('typeLabel')}
                    </span>
                    <Select
                      key={wardForm.type}
                      options={mapOptions<FormWardType, keyof FormWardType>(
                        typeOption,
                        'value',
                        'label'
                      )}
                      value={mapDefaultValue<FormWardType, keyof FormWardType>(
                        typeOption,
                        wardForm.type ? wardForm.type : '',
                        'value',
                        'label'
                      )}
                      onChange={getType}
                      autoFocus={false}
                      className='react-select-container custom-menu-select w-full'
                      classNamePrefix='react-select'
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className='modal-action mt-4 md:mt-6'>
            <button
              type='button'
              className='btn'
              onClick={() => {
                addWardModalRef.current?.close()
                resetFormWard()
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

      <dialog ref={editWardModalRef} className='modal overflow-y-scroll py-10'>
        <form
          onSubmit={handleUpdateWard}
          className='modal-box w-4/5 min-h-[30rem] justify-between flex flex-col'
        >
          <div>
            <h3 className='font-bold text-lg'>{t('editWard')}</h3>
            <div className='grid grid-cols-1 gap-4 mt-4 w-full'>
              {/* Right Column - 2/3 of the grid (70%) */}
              <div className='col-span-2 grid grid-cols-1 gap-2 md:gap-4'>
                {/* Ward */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      <span className='font-medium text-red-500 mr-1'>*</span>
                      {t('userWard')}
                    </span>
                    <input
                      name='wardName'
                      type='text'
                      value={wardForm.wardName}
                      onChange={handleWardChange}
                      className='input input-bordered w-full'
                      maxLength={80}
                    />
                  </label>
                </div>
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      <span className='font-medium text-red-500 mr-1'>*</span>
                      {t('typeLabel')}
                    </span>
                    <Select
                      key={wardForm.type}
                      options={mapOptions<FormWardType, keyof FormWardType>(
                        typeOption,
                        'value',
                        'label'
                      )}
                      value={mapDefaultValue<FormWardType, keyof FormWardType>(
                        typeOption,
                        wardForm.type ? wardForm.type : '',
                        'value',
                        'label'
                      )}
                      onChange={getType}
                      autoFocus={false}
                      className='react-select-container custom-menu-select w-full'
                      classNamePrefix='react-select'
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* Modal Actions */}
          <div className='modal-action mt-4 md:mt-6'>
            <button
              type='button'
              className='btn'
              onClick={() => {
                editWardModalRef.current?.close()
                resetFormWard()
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

export default ManageHospital
