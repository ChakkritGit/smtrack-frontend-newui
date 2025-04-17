import { useLocation, useNavigate } from 'react-router-dom'
import { WarrantiesType } from '../../types/smtrack/warranties/warranties'
import { useEffect, useMemo } from 'react'
import { RiFilePdf2Fill, RiShieldCheckLine } from 'react-icons/ri'
import { useTranslation } from 'react-i18next'
import {
  Document,
  Image,
  Page,
  PDFViewer,
  Text,
  usePDF,
  View
} from '@react-pdf/renderer'
import { style } from './style/warrantyStyles'
import ThanesLogo from '../../assets/images/Thanes_Logo2.png'
import ThanesSciLogo from '../../assets/images/Thanesscience_Logo.png'
import ThanesBannerLogo from '../../assets/images/ts-logo.png'
import ThanesSciBannerLogo from '../../assets/images/Thanesscience.png'
import Loading from '../skeleton/table/loading'
import { UAParser } from 'ua-parser-js'
import { Worker, Viewer } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import { breakText } from '../../constants/utils/utilsConstants'

const WarrantyPdf = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state } = useLocation() as { state: WarrantiesType }
  const parser = new UAParser()
  const os = parser.getOS().name
  const isWindows = os === 'Windows'
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  const pdfUrl = '/pdf.worker.min.js'

  useEffect(() => {
    if (state === null) navigate('/warranty')
  }, [state])

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour12: false
    }).format(date)
  }

  const pdfViewer = useMemo(
    () => (
      <Document
        pdfVersion='1.7ext3'
        title={
          state?.device?.name || state?.id
            ? `${state?.device?.name} - ${state?.id}`
            : '—'
        }
        author='Thanes Development Co., Ltd'
        subject='smtrack-Report'
        keywords='Warranty, etc.'
        pageLayout='singlePage'
        language='th-TH'
      >
        <Page
          dpi={72}
          orientation='portrait'
          size={'A4'}
          style={style.body}
          wrap
        >
          <View style={style.sectionOneWrapper}>
            <View style={style.headerRow}>
              <Image
                src={
                  state?.saleDepartment === 'SCI 1' ? ThanesLogo : ThanesSciLogo
                }
                style={style.headImage}
              />
              <View style={style.headText}>
                <Text>บัตรรับประกันผลิตภัณฑ์</Text>
                <Text>Warranty Registration Card.</Text>
                <Text>[สำหรับลูกค้า] </Text>
              </View>
            </View>
            <View style={style.contentWrapperRow}>
              <View style={style.contentWrapperColumn}>
                <View style={style.secondHeaderTextColumn}>
                  <View style={style.secondHeaderTextRow}>
                    <Text>หมายเลขประกัน</Text>
                    <Text>Warranty No</Text>
                  </View>
                  <View style={style.secondHeaderTextTwo}>
                    <Text>{state?.id ? breakText(state.id, 25) : '—'}</Text>
                  </View>
                </View>
                <View style={style.secondHeaderTextColumn}>
                  <View style={style.secondHeaderTextRow}>
                    <Text>ประเภทสินค้า</Text>
                    <Text>Product</Text>
                  </View>
                  <View style={style.secondHeaderTextTwo}>
                    <Text>{state?.product ?? '—'}</Text>
                  </View>
                </View>
                <View style={style.secondHeaderTextColumn}>
                  <View style={style.secondHeaderTextRow}>
                    <Text>รุ่น</Text>
                    <Text>Model</Text>
                  </View>
                  <View style={style.secondHeaderTextTwo}>
                    <Text>{state?.model ?? '—'}</Text>
                  </View>
                </View>
                <View style={style.secondHeaderTextColumn}>
                  <View style={style.secondHeaderTextRow}>
                    <Text>วันที่ติดตั้ง</Text>
                    <Text>Install Date</Text>
                  </View>
                  <View style={style.secondHeaderTextTwo}>
                    <Text>
                      {state?.installDate
                        ? formatDate(state?.installDate)
                        : '—'}
                    </Text>
                  </View>
                </View>
                <View style={style.secondHeaderTextColumn}>
                  <View style={style.secondHeaderTextRow}>
                    <Text>ชื่อลูกค้า</Text>
                    <Text>Customer's Name</Text>
                  </View>
                  <View style={style.secondHeaderTextTwo}>
                    <Text>{state?.customerName ?? '—'}</Text>
                  </View>
                </View>
              </View>
              <View style={style.contentWrapperColumn}>
                <View style={style.secondHeaderTextColumn}>
                  <View style={style.secondHeaderTextRow}>
                    <Text>เลขที่ Invoice</Text>
                    <Text>Invoice No</Text>
                  </View>
                  <View style={style.secondHeaderTextTwo}>
                    <Text>{state?.invoice ?? '—'}</Text>
                  </View>
                </View>
                <View style={style.secondHeaderTextColumn}>
                  <View style={style.secondHeaderTextRow}>
                    <Text>ยี่ห้อ</Text>
                    <Text>Trademark</Text>
                  </View>
                  <View style={style.secondHeaderTextTwo}>
                    <Text>{'Siamatic'}</Text>
                  </View>
                </View>
                <View style={style.secondHeaderTextColumn}>
                  <View style={style.secondHeaderTextRow}>
                    <Text>หมายเลขเครื่อง</Text>
                    <Text>Serial No</Text>
                  </View>
                  <View style={style.secondHeaderTextTwo}>
                    <Text>{state?.device?.id ?? '—'}</Text>
                  </View>
                </View>
                <View style={style.secondHeaderTextColumn}>
                  <View style={style.secondHeaderTextRow}>
                    <Text>วันหมดประกัน</Text>
                    <Text>Expiry Date</Text>
                  </View>
                  <View style={style.secondHeaderTextTwo}>
                    <Text>
                      {state?.expire ? formatDate(state?.expire) : '—'}
                    </Text>
                  </View>
                </View>
                <View style={style.secondHeaderTextColumn}>
                  <View style={style.secondHeaderTextRow}>
                    <Text>โทร</Text>
                    <Text>Tel</Text>
                  </View>
                  <View style={style.secondHeaderTextTwo}>
                    <Text>{'0-2791-4500'}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={style.contactWrapperRow}>
              <View style={style.contactItemOne}>
                <View style={style.secondHeaderTextRow}>
                  <Text>ที่อยู่</Text>
                  <Text>Address</Text>
                </View>
                <View style={style.notice}>
                  <Text>{state?.customerAddress ?? '—'}</Text>
                </View>
              </View>

              <View style={style.contactItemOne}>
                <View style={style.secondHeaderTextRow}>
                  <Text>หมายเหตุ</Text>
                </View>
                <View style={style.notice}>
                  <Text>
                    กรุณากรอกรายละเอียดข้อความให้ชัดเจนและโปรดแสดงบัตรรับประกันผลิตภัณฑ์แก่บริษัท
                    ฯ ทุกครั้งเมื่อนำผลิตภัณฑ์เข้ารับบริการ
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={style.sectionTwoWrapper}>
            <View style={style.sectionTwoHead}>
              <Text>เงื่อนไขการรับประกันและบริการ</Text>
              <Text>Conditions of Guarantee and Service</Text>
            </View>
            <View style={style.warrantyCondition}>
              <Text>1) ระยะเวลาประกันเริ่มต้นจากวันที่ติดตั้ง</Text>
              <Text>
                2) ในกรณีที่ชํารุด เกิดจากความผิดพลาดของมาตรฐานการผลิต
                หรือจากความบกพร่องของชิ้นส่วนบริษัทฯยินดี เปลี่ยนอะไหล่ให้
                โดยไม่คิดมูลค่าใดๆ ทั้งสิน
                แต่ไม่รวมถึงการชํารุดที่เกิดจากอุบัติเหตุ อัคคีภัย
              </Text>
              <Text>
                3) บริษัทฯจะรับประกันเฉพาะผู้ที่ส่งบัตรลงทะเบียน
                พร้อมหมายเลขเครื่องคืนมายังบริษัทฯภายในเวลาไม่เกิน 30 วัน
                นับตั้งแต่วันที่ซื้อ เมื่อมีการเปลี่ยนอะไหล่ใดๆ ในเวลารับประกัน
                บริษัทฯ จะรับประกันให้เท่ากับเวลาที่เหลืออยู่ของอายุ
                รับประกันเท่านั้น
              </Text>
              <Text>4) บริษัทฯ จะไม่รับสินค้าตามที่:</Text>
              <View style={style.warrantyNumberfour}>
                <Text>
                  - ไม่มีบัตรรับประกันมาแสดง
                  (โปรดเก็บรักษาให้ดีและแจ้งหมายเลขประกันทุกครั้ง)
                </Text>
                <Text>- มีการเปลี่ยนมือจากผู้ซื้อคนเดิม</Text>
                <Text>
                  -
                  มีการซ่อมหรือดัดแปลงโดยบุคคลอื่นที่ไม่ได้รับมอบหมายจากบริษัทฯ
                </Text>
              </View>
              <Text>5) การรับประกันนี้ใช้เฉพาะในประเทศเท่านั้น</Text>
            </View>
            <View style={style.warrantyFooter}>
              <Image
                style={style.footerImage}
                src={
                  state?.saleDepartment === 'SCI 1'
                    ? ThanesBannerLogo
                    : ThanesSciBannerLogo
                }
              />
              <View style={style.footerText}>
                <Text>
                  61/34 ซ.อมรพันธ์ 4 (วิภาวดี 42) ถ.วิภาวดีรังสิต แขวงลาดยาว
                  เขตจตุจักร กรุงเทพฯ 10900
                </Text>
                <Text>
                  61/34 Amornpan 4 (Vibhavadi 42), Vibhavadi Rangsit RD, Lat
                  Yao, Chatuchak, Bangkok 10900
                </Text>
                <Text>0-2791-4500</Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    ),
    [state]
  )

  const [instance, _update] = usePDF({ document: pdfViewer })

  return (
    <div className='h-[calc(100dvh-200px)] sm:h-[calc(100dvh-140px)] p-3 px-[16px]'>
      <div className='breadcrumbs text-sm mb-2'>
        <ul>
          <li>
            <a onClick={() => navigate('/warranty')}>
              <RiShieldCheckLine size={16} className='mr-1' />
              {t('sideWarranty')}
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
  )
}

export default WarrantyPdf
