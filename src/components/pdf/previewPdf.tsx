import { PDFViewer, usePDF } from '@react-pdf/renderer'
import { Location, useLocation, useNavigate } from 'react-router-dom'
import {
  RiBarChart2Line,
  RiDashboardLine,
  RiFilePdf2Fill
} from 'react-icons/ri'
import { useTranslation } from 'react-i18next'
import Fullchartpdf from './fullChartPdf'
import { useEffect, useMemo } from 'react'
import { UAParser } from 'ua-parser-js'
import Loading from '../skeleton/table/loading'
import { Worker, Viewer } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import { ProbeType } from '../../types/smtrack/probe/probeType'
import { DeviceLog } from '../../types/smtrack/devices/deviceType'

interface ChartPreviewPdfType {
  title: string
  ward: string
  image: string
  hospital: string
  devSn: string
  devName: string | undefined
  chartIMG: unknown
  dateTime: string
  hosImg: string | undefined
  probe: ProbeType[]
  deviceLogs: DeviceLog
}

function PreviewPDF () {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation() as Location<ChartPreviewPdfType>
  const parser = new UAParser()
  const os = parser.getOS().name
  const isWindows = os === 'Windows'
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  const pdfUrl = '/pdf.worker.min.js'

  useEffect(() => {
    if (!location.state) {
      navigate('/dashboard')
    }
  }, [location.state])

  const pdfViewer = useMemo(
    () => (
      <Fullchartpdf
        title={location?.state?.title}
        image={location?.state?.image}
        chartIMG={location?.state?.chartIMG as string}
        devSn={location?.state?.devSn}
        devName={location?.state?.devName}
        hospital={location?.state?.hospital}
        ward={location?.state?.ward}
        dateTime={location?.state?.dateTime}
        hosImg={location?.state?.hosImg}
        deviceLogs={location?.state?.deviceLogs}
      />
    ),
    [location.state]
  )

  const [instance, _update] = usePDF({ document: pdfViewer })

  return (
    <div className='p-3 h-[calc(100dvh-180px)]'>
      <div className='breadcrumbs text-sm mt-3'>
        <ul>
          <li>
            <a onClick={() => navigate('/dashboard')}>
              <RiDashboardLine size={16} className='mr-1' />
              {t('sideDashboard')}
            </a>
          </li>
          <li>
            <a
              onClick={() =>
                navigate('/dashboard/chart', {
                  state: {
                    deviceLogs: location.state.deviceLogs
                  }
                })
              }
            >
              <RiBarChart2Line size={16} className='mr-1' />
              {t('fullChart')}
            </a>
          </li>
          <li>
            <span className='inline-flex items-center gap-2'>
              <RiFilePdf2Fill size={16} className='mr-1' />
              {t('pagePDF')}
            </span>
          </li>
        </ul>
      </div>
      <div className='h-full mt-3'>
        {!instance.url ? (
          <Loading />
        ) : isWindows ? (
          <PDFViewer
            width={'100%'}
            height={'100%'}
            style={{ borderRadius: 'var(--border-radius-small)' }}
            className='!rounded-md'
          >
            {pdfViewer}
          </PDFViewer>
        ) : (
          <Worker workerUrl={pdfUrl}>
            <div className='w-full h-full'>
              <Viewer
                fileUrl={instance?.url ?? ''}
                plugins={[defaultLayoutPluginInstance]}
              />
            </div>
          </Worker>
        )}
      </div>
    </div>
  )
}

export default PreviewPDF
