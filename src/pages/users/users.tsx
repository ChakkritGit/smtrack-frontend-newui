import { useTranslation } from 'react-i18next'
import HospitalAndWard from '../../components/filter/hospitalAndWard'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  ChangeEvent,
  FormEvent
} from 'react'
import { FormState, UsersType } from '../../types/smtrack/users/usersType'
import axiosInstance from '../../constants/axios/axiosInstance'
import {
  responseType,
  UserProfileType
} from '../../types/smtrack/utilsRedux/utilsReduxType'
import {
  RiDeleteBin7Line,
  RiEditLine,
  RiEyeLine,
  RiEyeOffLine,
  RiKey2Line,
  RiMore2Line
} from 'react-icons/ri'
import defaultPic from '../../assets/images/default-user.jpg'
import { RootState } from '../../redux/reducers/rootReducer'
import { useDispatch, useSelector } from 'react-redux'
import { getRoleLabel } from '../../constants/utils/utilsConstants'
import UserPagination from '../../components/pagination/userPagination'
import {
  setHosId,
  setSearch,
  setSubmitLoading,
  setTokenExpire
} from '../../redux/actions/utilsActions'
import Swal from 'sweetalert2'
import { isSafeImageUrl, resizeImage } from '../../constants/utils/image'
import WardSelect from '../../components/selects/wardSelect'
import RoleSelect from '../../components/selects/roleSelect'
import { UserRole } from '../../types/global/users/usersType'
import { AxiosError } from 'axios'
import StatusSelect from '../../components/selects/statusSelect'
import RoleButtons from '../../components/pages/users/users'
import Loading from '../../components/skeleton/table/loading'
import { getColor } from '../../constants/utils/color'
import AddHopitalSelect from '../../components/selects/addHopitalSelect'

const Users = () => {
  const dispatch = useDispatch()
  const { globalSearch, wardId, tokenDecode, tmsMode, ambientDisabled } =
    useSelector((state: RootState) => state.utils)
  const { t } = useTranslation()
  const { role } = tokenDecode || {}
  const [users, setUsers] = useState<UsersType[]>([])
  const [usersFilter, setUsersFilter] = useState<UsersType[]>([])
  const [imageProcessing, setImageProcessing] = useState(false)
  const [userConnect, setUserConnect] = useState('')
  const [userInactive, setUserInactive] = useState(false)
  const [onEdit, setOnEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userPassword, setUserPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<FormState>({
    username: '',
    password: '',
    display: '',
    role:
      role === 'LEGACY_ADMIN'
        ? ('LEGACY_USER' as UserRole)
        : ('GUEST' as UserRole),
    status: true,
    wardId: '',
    imageFile: null,
    imagePreview: null
  })
  const [colors, setColors] = useState<string[]>([])

  const addModalRef = useRef<HTMLDialogElement>(null)
  const editModalRef = useRef<HTMLDialogElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get<responseType<UsersType[]>>(
        '/auth/user'
      )
      setUsers(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenExpire(true))
        }
        console.error(error.response?.data.message)
      } else {
        console.error(error)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    let parsedValue: string | boolean = value
    if (name === 'status') {
      parsedValue = value === 'true'
    }

    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }))
  }

  const createFormData = () => {
    const formDataObj = new FormData()

    const keyMapping: Record<string, string> = {
      imageFile: 'image',
      username: 'username',
      role: 'role',
      display: 'display'
    }

    Object.entries(formData).forEach(([key, value]) => {
      if (value === null || value === undefined || key === 'imagePreview')
        return

      const mappedKey = keyMapping[key as keyof typeof keyMapping] || key

      if (value instanceof File) {
        formDataObj.append(mappedKey, value)
      } else if (typeof value === 'boolean') {
        formDataObj.append(mappedKey, value.toString())
      } else if (mappedKey === 'username') {
        formDataObj.append(mappedKey, value.toLowerCase() as string)
      } else {
        formDataObj.append(mappedKey, value as string)
      }
    })

    return formDataObj
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
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
          setFormData({
            ...formData,
            imageFile: null
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
        imageFile: reSized,
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
    setFormData({
      username: '',
      password: '',
      display: '',
      role: 'GUEST' as UserRole,
      status: true,
      wardId: '',
      imageFile: null,
      imagePreview: null
    })
    setShowPassword(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    if (
      formData.username !== '' &&
      formData.password !== '' &&
      formData.display !== '' &&
      formData.wardId !== '' &&
      formData.role !== undefined
    ) {
      try {
        const formDataObj = createFormData()
        await axiosInstance.post<responseType<UsersType>>(
          '/auth/register',
          formDataObj,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        )

        addModalRef.current?.close()
        resetForm()
        dispatch(setHosId(''))
        await fetchUsers()
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

  const openEditModal = (user: UsersType) => {
    setFormData({
      id: user.id,
      username: user.username,
      display: user.display || '',
      role: user.role as UserRole,
      status: user.status,
      wardId: user.ward?.id || '',
      imageFile: null,
      imagePreview: user.pic || null
    })
    editModalRef.current?.showModal()
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())
    if (
      formData.username !== '' &&
      formData.password !== '' &&
      formData.display !== '' &&
      formData.wardId !== '' &&
      formData.role !== undefined
    ) {
      try {
        const formDataObj = createFormData()
        await axiosInstance.put<responseType<UsersType>>(
          `/auth/user/${formData.id}`,
          formDataObj,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        )

        editModalRef.current?.close()
        resetForm()
        await fetchUsers()
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

  const deleteUser = async (id: string) => {
    const result = await Swal.fire({
      title: t('deleteUserTitle'),
      text: t('notReverseText'),
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: t('cancelButton'),
      confirmButtonText: t('confirmButton'),
      customClass: {
        actions: 'custom-action',
        confirmButton: 'custom-confirmButton',
        cancelButton: 'custom-cancelButton'
      }
    })

    if (result.isConfirmed) {
      dispatch(setSubmitLoading())
      try {
        const response = await axiosInstance.delete<responseType<UsersType>>(
          `/auth/user/${id}`
        )
        await fetchUsers()
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

  const handleFilterConnect = (status: string) => {
    if (userConnect === status) {
      setUserConnect('')
    } else {
      setUserConnect(status)
    }
  }

  const handleSubmitPass = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    if (userPassword !== '') {
      try {
        await axiosInstance.patch<responseType<UserProfileType>>(
          `/auth/reset/${formData.username}`,
          {
            password: userPassword
          }
        )
        resetFormPass()
        setOnEdit(false)
        editModalRef.current?.close()
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: t('submitSuccess'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2500
        }).finally(() => {
          editModalRef.current?.showModal()
        })
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            dispatch(setTokenExpire(true))
          }
          editModalRef.current?.close()
          Swal.fire({
            title: t('alertHeaderError'),
            text: error.response?.data.message,
            icon: 'error',
            showConfirmButton: false,
            timer: 2500
          }).finally(() => {
            editModalRef.current?.showModal()
          })
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
      }).finally(() => {
        editModalRef.current?.showModal()
      })
      dispatch(setSubmitLoading())
    }
  }

  const resetFormPass = () => {
    setUserPassword('')
    setOnEdit(false)
    setShowPassword(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const filterUsers = users?.filter(f => {
      if (wardId && f.ward?.id !== wardId) {
        return false
      }

      const matchesSearch =
        f.display?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        f.username?.toLowerCase().includes(globalSearch.toLowerCase())

      const matchesConnection =
        userConnect === '' ||
        (userConnect === 'SUPER' && f.role === 'SUPER') ||
        (userConnect === 'SERVICE' && f.role === 'SERVICE') ||
        (userConnect === 'ADMIN' && f.role === 'ADMIN') ||
        (userConnect === 'USER' && f.role === 'USER') ||
        (userConnect === 'LEGACY_ADMIN' && f.role === 'LEGACY_ADMIN') ||
        (userConnect === 'LEGACY_USER' && f.role === 'LEGACY_USER') ||
        (userConnect === 'GUEST' && f.role === 'GUEST')

      const matchesInactive = userInactive ? !f.status : true

      return matchesSearch && matchesConnection && matchesInactive
    })

    const newFilter = tmsMode
      ? filterUsers.filter(
          item =>
            item.role?.includes('LEGACY_ADMIN') ||
            item.role?.includes('LEGACY_USER')
        )
      : filterUsers

    setUsersFilter(newFilter)
  }, [users, globalSearch, wardId, tmsMode, userConnect, userInactive])

  useEffect(() => {
    if (!ambientDisabled) return

    if (usersFilter.length > 0) {
      usersFilter.forEach((item, index) => {
        getColor(item.pic ?? defaultPic, index, setColors)
      })
    }
  }, [usersFilter, ambientDisabled])

  const UserCard = useMemo(() => {
    if (isLoading)
      return (
        <div className='h-[calc(100dvh-300px)]'>
          <Loading />
        </div>
      )
    if (usersFilter?.length > 0) {
      return (
        <UserPagination
          data={usersFilter}
          initialPerPage={10}
          itemPerPage={[10, 30, 50, 100]}
          renderItem={(item, index) => {
            const bgColor = colors[index] || 'transparent'

            return (
              <div
                className={`min-h-[240px] max-h-[270px] w-full shadow-sm ${
                  !item.status ? 'bg-base-100/40' : 'bg-base-100'
                } rounded-field overflow-hidden`}
                key={index}
              >
                <div
                  className='h-full flex flex-col items-center gap-4 px-3 py-4'
                  key={item.id}
                >
                  <div className='flex items-center justify-between w-full'>
                    {item.status ? (
                      <span
                        className={`badge bg-opacity-15 border-1 font-bold h-[25px] ${
                          item.role
                            ? item.role === 'SUPER'
                              ? 'badge-super'
                              : item.role === 'SERVICE'
                              ? 'badge-service'
                              : item.role === 'ADMIN'
                              ? 'badge-admin'
                              : item.role === 'USER'
                              ? 'badge-user'
                              : 'badge-guest'
                            : ''
                        }`}
                      >
                        {item.role ? getRoleLabel(item.role, t) : '—'}
                      </span>
                    ) : (
                      <span
                        className={`badge bg-red-500/15 border-red-500 text-red-500 bg-opacity-15 border-1 font-bold h-[25px]`}
                      >
                        {!item.status ? t('userInactive') : t('userActive')}
                      </span>
                    )}
                    <div className='dropdown dropdown-end z-30'>
                      <button
                        tabIndex={0}
                        role='button'
                        name='menuButton'
                        aria-label={t('menuButton')}
                        data-tip={t('menuButton')}
                        className='btn btn-ghost flex p-0 max-w-[30px] min-w-[30px] max-h-[30px] min-h-[30px] tooltip tooltip-left'
                      >
                        <RiMore2Line size={20} />
                      </button>
                      <ul
                        tabIndex={0}
                        className='dropdown-content menu bg-base-100 rounded-box z-[1] max-w-[180px] w-[140px] p-2 shadow'
                      >
                        <li onClick={() => openEditModal(item)}>
                          <div className='flex items-center gap-3 text-[16px]'>
                            <RiEditLine size={20} />
                            <span>{t('editButton')}</span>
                          </div>
                        </li>
                        {(role === 'SUPER' ||
                          role === 'ADMIN' ||
                          role === 'LEGACY_ADMIN') && (
                          <>
                            <div className='divider my-1 h-2 before:h-[1px] after:h-[1px]'></div>
                            <li onClick={() => deleteUser(item.id)}>
                              <div className='flex items-center gap-3 text-[16px] text-red-500 hover:bg-red-500 hover:text-white'>
                                <RiDeleteBin7Line size={20} />
                                <span>{t('deleteButton')}</span>
                              </div>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                  <div
                    className={`flex items-center justify-center ${
                      !item.status ? 'grayscale' : ''
                    }`}
                  >
                    <div className='relative w-24 h-24'>
                      <div className='avatar absolute z-20'>
                        <div className='w-24 rounded-field'>
                          <img
                            src={
                              isSafeImageUrl(item.pic) ? item.pic : defaultPic
                            }
                            alt='user'
                          />
                        </div>
                      </div>
                      {ambientDisabled && (
                        <div
                          className='blur-[128px] w-24 h-24 absolute opacity-75 z-10 duration-700 ease-linear'
                          style={{ backgroundColor: bgColor }}
                        ></div>
                      )}
                    </div>
                  </div>
                  <div className='flex flex-col items-center justify-center'>
                    <label
                      htmlFor='span'
                      className='tooltip tooltip-top z-30'
                      data-tip={item.display ?? '—'}
                    >
                      <span className='truncate block max-w-[180px] text-[20px]'>
                        {item.display ?? '—'}
                      </span>
                    </label>
                    <label
                      htmlFor='span'
                      className='tooltip tooltip-top z-30'
                      data-tip={item.username ?? '—'}
                    >
                      <span className='truncate block max-w-[180px] text-base-content/50 text-[16px]'>
                        @{item.username ?? '—'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )
          }}
        />
      )
    } else {
      return (
        <div className='flex items-center justify-center loading-hieght-full'>
          <div>{t('nodata')}</div>
        </div>
      )
    }
  }, [usersFilter, role, t, isLoading, colors])

  useEffect(() => {
    return () => {
      dispatch(setSearch(''))
    }
  }, [])

  return (
    <div className='p-3 px-[16px]'>
      {/* Header Section */}
      <div className='flex flex-col lg:flex-row lg:items-center justify-between mt-3'>
        <span className='text-[20px] font-medium'>{t('sidePermission')}</span>
        <div className='flex flex-col lg:flex-row mt-3 lg:mt-0 lg:items-center items-end gap-4'>
          <HospitalAndWard />
          <button
            className='btn btn-neutral max-w-[130px]'
            onClick={() => addModalRef.current?.showModal()}
          >
            {t('addUserButton')}
          </button>
        </div>
      </div>

      <div className='flex items-center justify-start flex-wrap gap-3 mt-5'>
        <RoleButtons
          userConnect={userConnect}
          handleFilterConnect={handleFilterConnect}
          role={role}
          t={t}
          disabled={userInactive}
        />
        {(role === 'SUPER' ||
          role === 'SERVICE' ||
          role === 'ADMIN' ||
          role === 'LEGACY_ADMIN') && (
          <>
            <div className='divider divider-horizontal hidden md:flex mx-0 py-1'></div>
            <button
              disabled={userConnect !== ''}
              key={'Inactive'}
              className={`flex items-center justify-center btn w-max h-[36px] min-h-0 p-2 font-normal ${
                userConnect !== '' ? 'opacity-50' : ''
              } ${
                userInactive
                  ? 'btn-neutral text-white'
                  : 'btn-ghost border border-base-content/50 text-base-content'
              }`}
              onClick={() => setUserInactive(!userInactive)}
            >
              <span>{t(`userInactive`)}</span>
            </button>
          </>
        )}
      </div>

      {UserCard}

      {/* Add User Modal */}
      <dialog ref={addModalRef} className='modal overflow-y-scroll py-10'>
        <form
          onSubmit={handleSubmit}
          className='modal-box w-11/12 max-w-5xl h-max max-h-max'
        >
          <h3 className='font-bold text-lg'>{t('addUserButton')}</h3>
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
                      <span className='loading loading-dots loading-md'></span>
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
                        className={`w-32 h-32 md:w-48 md:h-48 rounded-field object-cover border-2 border-dashed border-base-300 ${
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
                  <WardSelect formData={formData} setFormData={setFormData} />
                </label>
              </div>

              {/* Username */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('userNameForm')}
                  </span>
                  <input
                    name='username'
                    type='text'
                    value={formData.username}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={50}
                  />
                </label>
              </div>

              {/* Password */}
              <label className='label flex-col items-start w-full mb-3'>
                <span className='label-text text-wrap mb-2'>
                  <span className='font-medium text-red-500 mr-1'>*</span>
                  {t('userPassword')}
                </span>
                <div className='w-full relative'>
                  <input
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className='input input-bordered w-full pr-14'
                    maxLength={128}
                  />
                  <button
                    type='button'
                    className='absolute right-2 top-1/2 -translate-y-1/2 border-2 border-base-content/30 w-7 h-7 p-1 flex items-center justify-center cursor-pointer rounded-field text-base-content/30 hover:opacity-50 duration-300 ease-linear z-10'
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? (
                      <RiEyeOffLine size={18} />
                    ) : (
                      <RiEyeLine size={18} />
                    )}
                  </button>
                </div>
              </label>

              {/* DisplayName */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    <span className='font-medium text-red-500 mr-1'>*</span>
                    {t('userDisplayName')}
                  </span>
                  <input
                    name='display'
                    type='text'
                    value={formData.display}
                    onChange={handleChange}
                    className='input input-bordered w-full'
                    maxLength={80}
                  />
                </label>
              </div>

              {/* Role */}
              <div className='form-control w-full'>
                <label className='label flex-col items-start w-full mb-3'>
                  <span className='label-text text-wrap mb-2'>
                    {t('userRole')}
                  </span>
                  <RoleSelect
                    formData={formData}
                    roleToken={role}
                    setFormData={setFormData}
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
                if (fileInputRef.current) fileInputRef.current.value = ''
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

      {/* Edit User Modal */}
      <dialog ref={editModalRef} className='modal overflow-y-scroll py-10'>
        <form
          onSubmit={!onEdit ? handleUpdate : handleSubmitPass}
          className={`modal-box ${
            onEdit ? 'max-w-[40rem]' : 'max-w-5xl'
          } w-11/12 h-max max-h-max`}
        >
          <h3 className='font-bold text-lg'>{t('editUserButton')}</h3>
          {!onEdit ? (
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
                        <span className='loading loading-dots loading-md'></span>
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
                          className={`w-32 h-32 md:w-48 md:h-48 rounded-field object-cover border-2 border-dashed border-base-300 ${
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
                {/* Ward */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      {t('ward')}
                    </span>
                    <WardSelect formData={formData} setFormData={setFormData} />
                  </label>
                </div>

                {/* Status */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      {t('userStatus')}
                    </span>
                    <StatusSelect
                      formData={formData}
                      setFormData={setFormData}
                    />
                  </label>
                </div>

                {/* Username */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      <span className='font-medium text-red-500 mr-1'>*</span>
                      {t('userNameForm')}
                    </span>
                    <input
                      type='text'
                      name='username'
                      value={formData.username}
                      onChange={handleChange}
                      className='input input-bordered w-full'
                      maxLength={50}
                    />
                  </label>
                </div>

                {/* Display Name */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      <span className='font-medium text-red-500 mr-1'>*</span>
                      {t('userDisplayName')}
                    </span>
                    <input
                      type='text'
                      name='display'
                      value={formData.display}
                      onChange={handleChange}
                      className='input input-bordered w-full'
                      maxLength={80}
                    />
                  </label>
                </div>

                {/* Role */}
                <div className='form-control w-full'>
                  <label className='label flex-col items-start w-full mb-3'>
                    <span className='label-text text-wrap mb-2'>
                      {t('userRole')}
                    </span>
                    <RoleSelect
                      formData={formData}
                      roleToken={role}
                      setFormData={setFormData}
                    />
                  </label>
                </div>

                {/* Password reset */}
                {role === 'SUPER' && (
                  <div className='form-control w-full'>
                    <label className='label flex-col items-start w-full mb-3'>
                      <span className='label-text text-wrap mb-2'>
                        {t('titleSecurity')}
                      </span>
                      <button
                        type='button'
                        className='btn btn-neutral w-full'
                        onClick={() => setOnEdit(true)}
                      >
                        <RiKey2Line size={20} />
                        {t('changPassword')}
                      </button>
                    </label>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className='mt-4'>
              <div className='mt-3'>
                <div className='form-control w-full relative'>
                  <label className='input input-bordered flex items-center gap-2 pr-14 w-full'>
                    <span className='hidden md:block opacity-50'>
                      {t('newPassword')}
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name='oldPassword'
                      autoComplete='off'
                      placeholder={t('newPassword')}
                      onChange={e => setUserPassword(e.target.value)}
                      value={userPassword}
                      className='grow caret-primary w-[100px] md:w-auto md:placeholder:opacity-0'
                      autoFocus
                      max={20}
                      min={4}
                    />
                  </label>
                  <button
                    type='button'
                    className='absolute right-2 top-1/2 -translate-y-1/2 border-2 border-base-content/30 w-7 h-7 p-1 flex items-center justify-center cursor-pointer rounded-field text-base-content/30 hover:opacity-50 duration-300 ease-linear z-10'
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? (
                      <RiEyeOffLine size={18} />
                    ) : (
                      <RiEyeLine size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className='modal-action mt-4 md:mt-6'>
            {!onEdit ? (
              <button
                type='button'
                className='btn'
                onClick={() => {
                  editModalRef.current?.close()
                  resetForm()
                  resetFormPass()
                  setOnEdit(false)
                }}
              >
                {t('cancelButton')}
              </button>
            ) : (
              <button
                type='button'
                className='btn'
                onClick={() => {
                  resetFormPass()
                  setOnEdit(false)
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
    </div>
  )
}

export default Users
