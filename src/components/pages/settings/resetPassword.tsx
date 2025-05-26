import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import {
  setSubmitLoading,
  setTokenExpire
} from '../../../redux/actions/utilsActions'
import { AxiosError } from 'axios'
import axiosInstance from '../../../constants/axios/axiosInstance'
import {
  responseType,
  UserProfileType
} from '../../../types/smtrack/utilsRedux/utilsReduxType'
import { RootState } from '../../../redux/reducers/rootReducer'
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'

const ResetPassword = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { userProfile } = useSelector((state: RootState) => state.utils)
  const [showPassword, setShowPassword] = useState(false)
  const [userPassword, setUserPassword] = useState({
    oldPassword: '',
    newPassWord: ''
  })
  const [onEdit, setOnEdit] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(setSubmitLoading())

    if (userPassword.oldPassword !== '' && userPassword.newPassWord) {
      try {
        await axiosInstance.patch<responseType<UserProfileType>>(
          `/auth/reset/${userProfile?.username}`,
          {
            oldPassword: userPassword.oldPassword,
            password: userPassword.newPassWord
          }
        )
        resetForm()
        setOnEdit(false)
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: t('submitSuccess'),
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
    } else {
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: 'warning',
        showConfirmButton: false,
        timer: 2500
      })
      dispatch(setSubmitLoading())
    }
  }

  const resetForm = () => {
    setUserPassword({
      oldPassword: '',
      newPassWord: ''
    })
    setOnEdit(false)
  }

  return (
    <div className='mt-3'>
      <div className='divider divider-vertical my-2 before:h-[1px] after:h-[1px]'></div>
      <h3 className='font-bold text-base'>{t('titleSecurity')}</h3>

      {onEdit ? (
        <div className='mt-3'>
          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {/* Old Password */}
              <div className='form-control w-full relative'>
                <label className='input input-bordered flex items-center gap-2 pr-14 w-full'>
                  <span className='hidden md:block opacity-50'>
                    {t('oldPassword')}
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='oldPassword'
                    autoComplete='off'
                    placeholder={t('oldPassword')}
                    onChange={e =>
                      setUserPassword({
                        ...userPassword,
                        oldPassword: e.target.value
                      })
                    }
                    value={userPassword.oldPassword}
                    className='grow caret-primary w-[100px] md:placeholder:opacity-0 md:w-auto'
                    autoFocus
                    max={20}
                    min={4}
                  />
                </label>
                <button
                  type='button'
                  className='absolute right-2 top-1/2 -translate-y-1/2 border border-base-content/30 w-7 h-7 p-1 flex items-center justify-center cursor-pointer rounded-field text-base-content/30 hover:opacity-50 duration-300 ease-linear z-10'
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? (
                    <RiEyeOffLine size={18} />
                  ) : (
                    <RiEyeLine size={18} />
                  )}
                </button>
              </div>

              {/* New Password */}
              <div className='form-control w-full relative'>
                <label className='input input-bordered flex items-center gap-2 pr-14 w-full'>
                  <span className='hidden md:block opacity-50'>
                    {t('newPassword')}
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='newPassword'
                    autoComplete='off'
                    placeholder={t('newPassword')}
                    onChange={e =>
                      setUserPassword({
                        ...userPassword,
                        newPassWord: e.target.value
                      })
                    }
                    value={userPassword.newPassWord}
                    className='grow caret-primary w-[100px] md:placeholder:opacity-0 md:w-auto'
                    max={20}
                    min={4}
                  />
                </label>
                <button
                  type='button'
                  className='absolute right-2 top-1/2 -translate-y-1/2 border border-base-content/30 w-7 h-7 p-1 flex items-center justify-center cursor-pointer rounded-field text-base-content/30 hover:opacity-50 duration-300 ease-linear z-10'
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
        </div>
      ) : (
        <div className='flex md:items-center justify-between flex-col md:flex-row gap-3 md:gap-0 mt-3'>
          <span className='ml-5'>{t('titlePassword')}</span>
          <button
            onClick={() => setOnEdit(true)}
            className='md:w-[140px] h-[45px] md:h-[40px] px-2 font-bold rounded-field border-[2px] border-base-content text-[14px] md:text-base-content hover:opacity-50 cursor-pointer duration-300 ease-linear'
          >
            {t('changPassword')}
          </button>
        </div>
      )}
    </div>
  )
}

export default ResetPassword
