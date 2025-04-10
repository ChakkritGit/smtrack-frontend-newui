import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { countryCodes } from '../../constants/utils/utilsConstants'
import axios from 'axios'
import Swal from 'sweetalert2'

const Support = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+66',
    phone: '',
    hospitalName: '',
    ward: '',
    message: ''
  })

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target

    let formattedValue = value

    formattedValue = name === 'phone' ? formatPhoneNumber(value) : value

    setFormData({ ...formData, [e.target.name]: formattedValue })
  }

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      countryCode: '+66',
      phone: '',
      hospitalName: '',
      ward: '',
      message: ''
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (
      formData.message !== '' &&
      formData.email !== '' &&
      formData.firstName !== '' &&
      formData.hospitalName !== '' &&
      formData.lastName !== '' &&
      formData.countryCode !== '' &&
      formData.phone !== '' &&
      formData.ward !== ''
    ) {
      const combineText = `\n *** SUPPORT *** \n\n Name: ${formData.firstName} ${formData.lastName} \n Hospitals: ${formData.hospitalName} \n Ward: ${formData.ward} \n Tel: ${formData.countryCode}${formData.phone} \n Email: ${formData.email} \n Details: ${formData.message} \n\n ----------------------- END -----------------------`
      const response = await axios.post(
        `${'https://api.siamatic.co.th/etemp'}/utils/ticket`,
        { text: combineText }
      )
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: String(response.data.data),
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
      resetForm()
    } else {
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: 'warning',
        timer: 2000,
        showConfirmButton: false
      })
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-5'>
      <div className='card bg-base-100 w-full max-w-3xl shadow-xl p-8'>
        <h2 className='text-2xl font-bold text-center'>{t('getInTouch')}</h2>
        <p className='text-center text-gray-500 mb-5'>{t('contactDes')}</p>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <input
              type='text'
              name='firstName'
              placeholder='ชื่อ'
              className='input input-bordered w-full'
              value={formData.firstName}
              onChange={handleChange}
            />
            <input
              type='text'
              name='lastName'
              placeholder='นามสกุล'
              className='input input-bordered w-full'
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <input
            type='email'
            name='email'
            placeholder='อีเมล'
            className='input input-bordered w-full'
            value={formData.email}
            onChange={handleChange}
          />
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <label htmlFor='countryCode'>
              <select
                id='countryCode'
                name='countryCode'
                className='select select-bordered w-full'
                value={formData.countryCode}
                onChange={handleChange}
                defaultValue={'+66'}
              >
                {countryCodes.map((item, index) => (
                  <option key={index} value={item.code}>
                    {item.country} ({item.code})
                  </option>
                ))}
              </select>
            </label>
            <input
              type='tel'
              name='phone'
              placeholder='เบอร์โทร'
              className='input input-bordered w-full'
              value={formData.phone}
              onChange={handleChange}
              maxLength={12}
            />
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <input
              type='text'
              name='hospitalName'
              placeholder='ชื่อโรงพยาบาล'
              className='input input-bordered w-full'
              value={formData.hospitalName}
              onChange={handleChange}
            />
            <input
              type='text'
              name='ward'
              placeholder='ชื่อวอร์ด'
              className='input input-bordered w-full'
              value={formData.ward}
              onChange={handleChange}
            />
          </div>
          <textarea
            name='message'
            placeholder='เราสามารถช่วยอะไรคุณได้บ้าง?'
            className='textarea textarea-bordered w-full'
            value={formData.message}
            onChange={handleChange}
          ></textarea>
          <button className='btn btn-primary w-full'>
            {t('contactSubmit')}
          </button>
        </form>
        <p className='text-center text-sm text-gray-500 mt-4'>
          {t('contactAgree')}{' '}
          <span
            onClick={() => navigate('/privacy-policy')}
            className='link link-primary font-semibold'
          >
            {t('contactAgreeLink')}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Support
