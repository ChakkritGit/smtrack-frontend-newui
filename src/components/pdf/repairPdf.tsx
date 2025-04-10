import {
  Document,
  Page,
  Path,
  PDFViewer,
  Svg,
  Text,
  usePDF,
  View
} from '@react-pdf/renderer'
import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { RepairType } from '../../types/smtrack/repair/repairType'
import { useTranslation } from 'react-i18next'
import { RiFilePdf2Fill, RiFileSettingsLine } from 'react-icons/ri'
import { style } from './style/repairStyles'
import Loading from '../skeleton/table/loading'
import { UAParser } from 'ua-parser-js'
import { Worker, Viewer } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

const RepairPdf = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state } = useLocation() as { state: RepairType }
  const parser = new UAParser()
  const os = parser.getOS().name
  const isWindows = os === 'Windows'
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  const pdfUrl = '/pdf.worker.min.js'

  useEffect(() => {
    if (state === null) navigate('/repair')
  }, [state])

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
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
        keywords='Repair, etc.'
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
          <View style={style.headerColumn}>
            <Text style={style.headerTextSq}>
              ลำดับที่{' '}
              <Text style={style.headerTextSqColor}>{state?.seq ?? '—'}</Text>
            </Text>
            <Text style={style.headerTitle}>ใบแจ้งซ่อม</Text>
            <Text style={style.headerTextNumber}>
              เลขที่{' '}
              <Text style={style.headerTextNumberColor}>
                {state?.id ? state?.id : '—'}
              </Text>
            </Text>
          </View>
          <View style={style.contactRow}>
            <View style={style.contactColumn}>
              <Text style={style.contactCompany}>บริษัท ธเนศพัฒนา จำกัด </Text>
              <Text style={style.contactCompanyAddress}>
                61/34 ซ.อมรพันธ์ 4 (วิภาวดี 42) ถ.วิภาวดีรังสิต แขวงลาดยาว
                เขตจตุจักร กรุงเทพฯ 10900 โทร. 0-2791-4500
              </Text>
            </View>
            <Text style={style.contactNotic}>ต้นฉบับ</Text>
          </View>
          <View style={style.tableWrapper}>
            <View style={style.tableHeaderRow}>
              <View style={style.tableHeaderLeft}>
                <View style={style.customerContactColumn}>
                  <View style={style.customerContactTextWrapper}>
                    <Text>ชื่อลูกค้า: </Text>
                    <Text style={style.customerContactText}>
                      {state?.info ?? '—'}{' '}
                    </Text>
                  </View>
                  <View style={style.customerContactTextWrapper}>
                    <Text>ที่อยู่: </Text>
                    <Text style={style.customerContactText}>
                      {state?.address ?? '—'}{' '}
                    </Text>
                  </View>
                  <View style={style.customerContactTextWrapper}>
                    <Text>โทรศัพท์: </Text>
                    <Text style={style.customerContactText}>
                      {state?.phone ?? '—'}{' '}
                    </Text>
                  </View>
                  <View style={style.customerContactTextWrapper}>
                    <Text>สถานที่ติดตั้ง: </Text>
                    <Text style={style.customerContactText}>
                      {state?.ward ?? '—'}{' '}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={style.tableHeaderRight}>
                <View style={style.customerContactColumn}>
                  <View style={style.customerContactTextWrapper}>
                    <Text>สินค้า: </Text>
                    <Text style={style.customerContactText}>
                      {state?.device?.id
                        ? state?.device?.id.substring(0, 3) === 'eTP'
                          ? 'eTEMP'
                          : 'iTEMP'
                        : '—'}{' '}
                    </Text>
                  </View>
                  <View style={style.customerContactTextWrapper}>
                    <Text>Model: </Text>
                    <Text style={style.customerContactText}>
                      {state?.device?.id.substring(0, 8) ?? '—'}{' '}
                    </Text>
                  </View>
                  <View style={style.customerContactTextWrapper}>
                    <Text>S/N: </Text>
                    <Text style={style.customerContactText}>
                      {state?.device?.id ?? '—'}{' '}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={style.tableWarrantyWrapper}>
              <View style={style.tableWarrantyStatus}>
                <Text style={style.warrantyText}>สถานะ: </Text>
                <View style={style.wrapperBox}>
                  <View style={style.checkBox}>
                    {state?.warrantyStatus === '1' && (
                      <Svg viewBox='0 0 24 24' width='24' height='24'>
                        <Path
                          d='M9 16.2L4.8 12l-1.4 1.4 5.6 5.6 12-12-1.4-1.4z'
                          fill='balck'
                          stroke='balck'
                        />
                      </Svg>
                    )}
                  </View>
                  <Text style={style.warrantyText}>อยู่ในประกัน</Text>
                </View>
                <View style={style.wrapperBox}>
                  <View style={style.checkBox}>
                    {state?.warrantyStatus === '2' && (
                      <Svg viewBox='0 0 24 24' width='24' height='24'>
                        <Path
                          d='M9 16.2L4.8 12l-1.4 1.4 5.6 5.6 12-12-1.4-1.4z'
                          fill='balck'
                          stroke='balck'
                        />
                      </Svg>
                    )}
                  </View>
                  <Text style={style.warrantyText}>หมดประกัน</Text>
                </View>
                <View style={style.wrapperBox}>
                  <View style={style.checkBox}>
                    {state?.warrantyStatus === '3' && (
                      <Svg viewBox='0 0 24 24' width='24' height='24'>
                        <Path
                          d='M9 16.2L4.8 12l-1.4 1.4 5.6 5.6 12-12-1.4-1.4z'
                          fill='balck'
                          stroke='balck'
                        />
                      </Svg>
                    )}
                  </View>
                  <Text style={style.warrantyText}>ต่อ MA</Text>
                </View>
                <View style={style.wrapperBox}>
                  <View style={style.checkBox}>
                    {state?.warrantyStatus === '4' && (
                      <Svg viewBox='0 0 24 24' width='24' height='24'>
                        <Path
                          d='M9 16.2L4.8 12l-1.4 1.4 5.6 5.6 12-12-1.4-1.4z'
                          fill='balck'
                          stroke='balck'
                        />
                      </Svg>
                    )}
                  </View>
                  <Text style={style.warrantyText}>อื่น ๆ</Text>
                </View>
              </View>
              {state?.warrantyStatus === '4' && (
                <View style={style.warrantyDetailRow}>
                  <Text style={style.warrantyDetailMark}>*</Text>
                  <Text style={style.warrantyDetail}>{state?.remark}</Text>
                </View>
              )}
            </View>
            <View style={style.tableDetailWrapper}>
              <View style={style.tableDetailColumn}>
                <View style={style.tableDetailTextWrapper}>
                  <Text>สภาพเครื่อง: </Text>
                  <Text style={style.tableDetailText}>
                    {state?.info1 ?? '—'}{' '}
                  </Text>
                </View>
                <View style={style.tableDetailTextWrapper}>
                  <Text>อุปกรณ์ที่นำมาด้วย: </Text>
                  <Text style={style.tableDetailText}>
                    {state?.info2 ?? '—'}{' '}
                  </Text>
                </View>
                <View style={style.tableDetailTextWrapper}>
                  <Text>รายละเอียด: </Text>
                  <Text style={style.tableDetailText}>
                    {state?.detail ?? '—'}{' '}
                  </Text>
                </View>
              </View>
            </View>
            <View style={style.tableSignatureRow}>
              <View style={style.tableSignatureLeft}>
                <View style={style.signatureWrapper}>
                  <View style={style.signatureLeft}>
                    <Text style={style.signatureDotLeft}></Text>
                    <View style={style.signatureSpace}>
                      <Text>(</Text>
                      <Text>)</Text>
                    </View>
                    <Text>ลายเซ็น/ตัวบรรจงของลูกค้า</Text>
                  </View>
                  <View style={style.signatureright}>
                    <View style={style.signatureDotRight}>
                      <View style={style.signatureItemRight}>
                        <Text style={style.signatureItemRightDot}></Text>
                        <Text>/</Text>
                      </View>
                      <View style={style.signatureItemRight}>
                        <Text style={style.signatureItemRightDot}></Text>
                        <Text>/</Text>
                      </View>
                      <View style={style.signatureItemRight}>
                        <Text style={style.signatureItemRightDot}></Text>
                      </View>
                    </View>
                    <Text>(ว-ด-ป)</Text>
                  </View>
                </View>
              </View>
              <View style={style.tableSignatureRight}>
                <View style={style.signatureWrapper}>
                  <View style={style.signatureLeft}>
                    <Text style={style.signatureDotLeft}></Text>
                    <View style={style.signatureSpace}>
                      <Text>(</Text>
                      <Text>)</Text>
                    </View>
                    <Text>ผู้ปฏิบัติงาน</Text>
                  </View>
                  <View style={style.signatureright}>
                    <View style={style.signatureDotRight}>
                      <View style={style.signatureItemRight}>
                        <Text style={style.signatureItemRightDot}></Text>
                        <Text>/</Text>
                      </View>
                      <View style={style.signatureItemRight}>
                        <Text style={style.signatureItemRightDot}></Text>
                        <Text>/</Text>
                      </View>
                      <View style={style.signatureItemRight}>
                        <Text style={style.signatureItemRightDot}></Text>
                      </View>
                    </View>
                    <Text>(ว-ด-ป)</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={style.progressWrapper}>
              <View style={style.progressLeft}>
                <Text>ผลการดำเนินการ</Text>
              </View>
              <View style={style.progressRight}>
                <View style={style.progressItem}>
                  <View style={style.wrapperProgressBox}>
                    <View style={style.checkBox}></View>
                    <Text>เรียบร้อย</Text>
                  </View>
                  <View style={style.wrapperProgressBox}>
                    <View style={style.checkBox}></View>
                    <Text>ส่งซ่อม / มีค่าใช้จ่าย</Text>
                  </View>
                  <View style={style.wrapperProgressBox}>
                    <View style={style.checkBox}></View>
                    <Text>ลูกค้ายกเลิกซ่อม</Text>
                  </View>
                </View>
                <View style={style.progressItem}>
                  <View style={style.wrapperProgressBox}>
                    <View style={style.checkBox}></View>
                    <Text>ไม่เรียบร้อย</Text>
                  </View>
                  <View style={style.wrapperProgressBox}>
                    <View style={style.checkBox}></View>
                    <Text>ส่งซ่อม / เปลี่ยนในระยะประกัน</Text>
                  </View>
                  <View style={style.wrapperProgressBox}>
                    <View></View>
                    <Text></Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={style.progressDetailWrapper}>
              <View style={style.progressDetail}>
                <Text>รายละเอียด</Text>
                <Text style={style.progressDetailExplan}></Text>
              </View>
              <Text style={style.progressDetailExplan}></Text>
            </View>
          </View>
          <View style={style.footerWrapper}>
            <View style={style.footerLeft}>
              <View style={style.signatureWrapper}>
                <View style={style.signatureLeft}>
                  <Text style={style.signatureDotLeft}></Text>
                  <View style={style.signatureSpace}>
                    <Text>(</Text>
                    <Text>)</Text>
                  </View>
                  <Text>ผู้คืนเครื่องซ่อม</Text>
                </View>
                <View style={style.signatureright}>
                  <View style={style.signatureDotRight}>
                    <View style={style.signatureItemRight}>
                      <Text style={style.signatureItemRightDot}></Text>
                      <Text>/</Text>
                    </View>
                    <View style={style.signatureItemRight}>
                      <Text style={style.signatureItemRightDot}></Text>
                      <Text>/</Text>
                    </View>
                    <View style={style.signatureItemRight}>
                      <Text style={style.signatureItemRightDot}></Text>
                    </View>
                  </View>
                  <Text>(ว-ด-ป)</Text>
                </View>
              </View>
            </View>
            <View style={style.footerRight}>
              <View style={style.signatureWrapper}>
                <View style={style.signatureLeft}>
                  <Text style={style.signatureDotLeft}></Text>
                  <View style={style.signatureSpace}>
                    <Text>(</Text>
                    <Text>)</Text>
                  </View>
                  <Text>ผู้รับเครื่องซ่อม</Text>
                </View>
                <View style={style.signatureright}>
                  <View style={style.signatureDotRight}>
                    <View style={style.signatureItemRight}>
                      <Text style={style.signatureItemRightDot}></Text>
                      <Text>/</Text>
                    </View>
                    <View style={style.signatureItemRight}>
                      <Text style={style.signatureItemRightDot}></Text>
                      <Text>/</Text>
                    </View>
                    <View style={style.signatureItemRight}>
                      <Text style={style.signatureItemRightDot}></Text>
                    </View>
                  </View>
                  <Text>(ว-ด-ป)</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={style.notic} fixed>
            <View style={style.noticText}>
              <Text style={style.noticTextBold}>หมายเหตุ*</Text>
              <Text>กรุณาพิมพ์สำเนาสองฉบับเพื่อนำส่งและเก็บไว้ </Text>
            </View>
            <Text>{formatDate(state?.createAt)} Rev.01</Text>
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
            <a onClick={() => navigate('/repair')}>
              <RiFileSettingsLine size={16} className='mr-1' />
              {t('sideRepair')}
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

export default RepairPdf
