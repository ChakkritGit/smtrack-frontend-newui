import DefaultUser from '../../../assets/images/default-user.jpg'
import DefaultHos from '../../../assets/images/default-pic.png'
import { RiCameraLine } from 'react-icons/ri'
import { useTranslation } from 'react-i18next'
import { Dispatch, FormEvent, RefObject, SetStateAction, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AxiosError } from 'axios'
import Swal from 'sweetalert2'
import {
  responseType,
  UserProfileType
} from '../../../types/smtrack/utilsRedux/utilsReduxType'
import { resizeImage } from '../../../constants/utils/image'
import axiosInstance from '../../../constants/axios/axiosInstance'
import {
  cookieOptions,
  cookies,
  getRoleLabel
} from '../../../constants/utils/utilsConstants'
import {
  setSubmitLoading,
  setTokenExpire,
  setUserProfile
} from '../../../redux/actions/utilsActions'

interface ProfileProps {
  userProfile: UserProfileType | undefined
  profileModalRef: RefObject<HTMLDialogElement | null>
  fileInputRef: RefObject<HTMLInputElement | null>
  setImage: Dispatch<SetStateAction<FormState>>
  image: FormState
  setEdit: Dispatch<SetStateAction<boolean>>
  edit: boolean
  setImageProcessing: Dispatch<SetStateAction<boolean>>
  imageProcessing: boolean
}

interface FormState {
  imagePreview: string | null
}

const ProfileComponent = (props: ProfileProps) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const {
    userProfile,
    profileModalRef,
    fileInputRef,
    image,
    setImage,
    edit,
    setEdit,
    setImageProcessing,
    imageProcessing
  } = props

  const [displayName, setDisplayName] = useState('')

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageProcessing(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      const reSized = await resizeImage(file)
      setImage({
        ...image,
        imagePreview: URL.createObjectURL(file)
      })
      handleUpdate(reSized)
      setImageProcessing(false)
    }
  }

  const fetchUserProfile = async () => {
    if (userProfile?.id) {
      try {
        const response = await axiosInstance.get<responseType<UserProfileType>>(
          `${
            import.meta.env.VITE_APP_NODE_ENV === 'development'
              ? import.meta.env.VITE_APP_AUTH
              : ''
          }/auth/user/${userProfile?.id}`
        )
        cookies.set('userProfile', response.data.data, cookieOptions)
        dispatch(setUserProfile(response.data.data))
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            dispatch(setTokenExpire(true))
          } else {
            console.error('Something wrong' + error)
          }
        } else {
          console.error('Uknown error: ', error)
        }
      }
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    if (displayName !== '') {
      try {
        await axiosInstance.put<responseType<UserProfileType>>(
          `/auth/user/${userProfile?.id}`,
          {
            display: displayName
          }
        )
        profileModalRef.current?.close()
        resetForm()
        setEdit(false)
        await fetchUserProfile()
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: t('submitSuccess'),
          icon: 'success',
          showConfirmButton: false,
          timer: 2500
        }).finally(() => profileModalRef.current?.showModal())
      } catch (error) {
        profileModalRef.current?.close()
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
          }).finally(() => profileModalRef.current?.showModal())
        } else {
          console.error(error)
        }
      } finally {
        dispatch(setSubmitLoading())
      }
    } else {
      profileModalRef.current?.close()
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: 'warning',
        showConfirmButton: false,
        timer: 2500
      }).finally(() => profileModalRef.current?.showModal())
      dispatch(setSubmitLoading())
    }
  }

  const handleUpdate = async (reSized: File) => {
    try {
      const formDataObj = new FormData()
      formDataObj.append('image', reSized)
      await axiosInstance.put<responseType<UserProfileType>>(
        `/auth/user/${userProfile?.id}`,
        formDataObj,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      )

      resetForm()
      await fetchUserProfile()
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
    }
  }

  const resetForm = () => {
    setDisplayName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    setEdit(false)
  }

  return (
    <div className='w-full'>
      <div className='relative mb-20'>
        <div
          className='w-full h-56 relative rounded-tl-selector rounded-tr-selector before:absolute before:inset-x-0 before:bottom-0 before:h-20
          before:bg-gradient-to-t before:from-base-content/50 before:to-transparent'
          style={{
            backgroundImage: `url(${
              userProfile?.ward.hospital?.hosPic ?? DefaultHos
            })`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        <div className='form-control absolute bottom-0 rounded-full translate-y-[40%] w-full md:w-auto flex justify-center items-center md:items-start md:left-7'>
          <label htmlFor='imageFileSelect' className='cursor-pointer relative'>
            <div className='avatar rounded-selector border-[5px] border-base-100 relative'>
              <div className='w-28 md:w-36 rounded-selector'>
                {!imageProcessing ? (
                  <img
                    src={image.imagePreview ?? DefaultUser}
                    className='rounded-selector bg-base-100'
                    alt='user-avatar'
                  />
                ) : (
                  <img
                    src={DefaultUser}
                    className='rounded-selector bg-base-100'
                    alt='user-avatar'
                  />
                )}
              </div>

              <div className='absolute hover:opacity-85 duration-300 ease-linear flex items-center justify-center bottom-1 right-1 bg-base-200 p-1.5 md:p-2 rounded-selector border-[3px] border-base-100'>
                <RiCameraLine className='text-[18px] md:text-[20px] text-base-content/80' />
              </div>
            </div>

            <input
              ref={fileInputRef}
              id='imageFileSelect'
              name='imageFileSelect'
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='hidden'
            />
          </label>
        </div>
      </div>

      {!edit ? (
        <div className='flex flex-col md:flex-row gap-5 md:gap-0 items-center justify-between'>
          <div className='flex flex-col pl-3'>
            <div className='flex items-center flex-wrap justify-center gap-2 mb-2 md:mb-auto'>
              <span className='text-[20px] lg:text-[32px] md:text-[24px] font-medium'>
                {userProfile?.display ?? '—'}
              </span>
              <span
                className={`badge bg-opacity-15 border-1 font-bold text-[12px] md:text-[14px] h-[20px] md:h-[25px] ${
                  userProfile?.role
                    ? userProfile?.role === 'SUPER'
                      ? 'badge-super'
                      : userProfile?.role === 'SERVICE'
                      ? 'badge-service'
                      : userProfile?.role === 'ADMIN'
                      ? 'badge-admin'
                      : userProfile?.role === 'USER'
                      ? 'badge-user'
                      : 'badge-guest'
                    : ''
                }`}
              >
                {userProfile?.role ? getRoleLabel(userProfile?.role, t) : '—'}
              </span>
            </div>
            <span className='opacity-70 text-center md:text-left'>
              @{userProfile?.username}
            </span>
          </div>
          <button
            className='w-full md:w-[80px] h-[45px] md:h-[40px] font-bold rounded-field border-[2px] border-base-content text-[14px] md:text-base-content hover:opacity-50 cursor-pointer duration-300 ease-linear'
            onClick={() => {
              setEdit(true)
              setDisplayName(userProfile?.display ?? '—')
            }}
          >
            {t('editButton')}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className='form-control'>
            <label className='input  flex items-center gap-2 w-full'>
              <span className='opacity-50'>{t('userDisplayName')}</span>
              <input
                type='text'
                name='display'
                autoComplete='off'
                onChange={e => setDisplayName(e.target.value)}
                value={displayName}
                className='grow caret-primary w-[100px] md:w-auto'
                autoFocus
                maxLength={80}
              />
            </label>
          </div>
          {/* Modal Actions */}
          <div className='modal-action mt-6'>
            <button type='button' className='btn' onClick={() => resetForm()}>
              {t('cancelButton')}
            </button>
            <button type='submit' className='btn btn-neutral'>
              {t('submitButton')}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ProfileComponent
