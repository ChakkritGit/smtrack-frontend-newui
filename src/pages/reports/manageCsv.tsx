import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiFileCsvFill } from 'react-icons/pi'
import {
  RiDeleteBin7Line,
  RiDownloadLine,
  RiListSettingsLine
} from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { CsvListType } from '../../types/smtrack/reports/csvType'
import { AxiosError } from 'axios'
import { useDispatch } from 'react-redux'
import {
  setSubmitLoading,
  setTokenExpire
} from '../../redux/actions/utilsActions'
import axiosInstance from '../../constants/axios/axiosInstance'
import { responseType } from '../../types/smtrack/utilsRedux/utilsReduxType'
import Loading from '../../components/skeleton/table/loading'
import CsvPaginationProps from '../../components/pagination/csvPagination'
import Swal from 'sweetalert2'

const ManageCsv = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [csvList, setCsvList] = useState<CsvListType[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchCsvList = async () => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get<responseType<CsvListType[]>>(
        'https://drive.siamatic.co.th/api/csv'
      )
      setCsvList(response.data.data)
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
      setIsLoading(false)
    }
  }

  const deleteCsv = async (fileName: string) => {
    const result = await Swal.fire({
      title: t('deleteCsv'),
      text: t('deleteCsvText'),
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
        const response = await axiosInstance.delete<responseType<CsvListType>>(
          `https://drive.siamatic.co.th/api/csv/${fileName}`
        )
        await fetchCsvList()
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
        }
        console.error(error)
      } finally {
        dispatch(setSubmitLoading())
      }
    }
  }

  useEffect(() => {
    fetchCsvList()
  }, [])

  return (
    <div className='p-3 px-[16px]'>
      <div className='breadcrumbs text-sm mt-3'>
        <ul>
          <li>
            <a onClick={() => navigate('/management')}>
              <RiListSettingsLine size={16} className='mr-1' />
              {t('sideManage')}
            </a>
          </li>
          <li>
            <div className='flex items-center gap-2'>
              <PiFileCsvFill size={16} className='mr-1' />
              <span>{t('tabManageCsv')}</span>
            </div>
          </li>
        </ul>
      </div>
      <div className='bg-base-100 rounded-field py-4 px-5 mt-3'>
        {isLoading ? (
          <Loading />
        ) : csvList.length > 0 ? (
          <div>
            <CsvPaginationProps
              data={csvList}
              initialPerPage={10}
              itemPerPage={[10, 30, 50, 100]}
              renderItem={(item, index) => (
                <div
                  key={index}
                  className='flex items-center gap-1 justify-between py-2.5 border-b border-base-content/10 hover:bg-base-200 duration-300 ease-linear'
                >
                  <div className='flex flex-col gap-0.5'>
                    <div
                      className='flex items-center gap-1.5 tooltip tooltip-bottom'
                      data-tip={item.fileName}
                    >
                      <PiFileCsvFill size={24} className='text-primary' />
                      <span className='text-lg font-medium truncate max-w-[180px]'>
                        {item.fileName}
                      </span>
                    </div>
                    <span className='text-[13.25px] ml-1.5'>
                      {item.fileSize}
                    </span>
                    <span className='text-[13.25px] ml-1.5'>
                      {item.createDate}
                    </span>
                  </div>

                  <div className='flex items-center gap-3 mr-3'>
                    <button
                      className='btn btn-neutral p-2'
                      onClick={() =>
                        window.open(
                          `https://drive.siamatic.co.th${item.filePath}`,
                          '_blank'
                        )
                      }
                    >
                      <RiDownloadLine size={20} />
                    </button>
                    <button
                      className='btn btn-ghost bg-red-500 hover:bg-red-700 text-white p-2 duration-300 transition-all ease-linear'
                      onClick={() => deleteCsv(item.fileName)}
                    >
                      <RiDeleteBin7Line size={20} />
                    </button>
                  </div>
                </div>
              )}
            />
          </div>
        ) : (
          <div className='flex items-center justify-center loading-hieght-full'>
            <div>{t('notificationEmpty')}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageCsv
