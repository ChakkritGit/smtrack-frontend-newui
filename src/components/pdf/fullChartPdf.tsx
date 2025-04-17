import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import defaultImg from '../../assets/images/default-pic.png'
import { pdftype } from '../../types/tms/pdfExportType'
import { StylesPdf } from './style/styles'

export default function Fullchartpdf (pdftype: pdftype) {
  const { chartIMG, dateTime, devName, devSn, title, hosImg, deviceLogs } =
    pdftype

  return (
    <Document
      pdfVersion='1.7ext3'
      title={title}
      author='Thanes Development Co., Ltd'
      subject='smtrack-Report'
      keywords='Chart, Datatable etc.'
      pageLayout='singlePage'
      language='th-TH'
    >
      <Page
        dpi={300}
        orientation='landscape'
        size={'A4'}
        style={StylesPdf.body}
        wrap
      >
        <Text style={StylesPdf.title}>Validation Certificate</Text>
        <View style={StylesPdf.Head}>
          <View style={StylesPdf.left}>
            <View style={StylesPdf.left_row}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10
                }}
              >
                <Text style={StylesPdf.tag}>Device SN:&nbsp;</Text>
                <Text>{devSn}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10
                }}
              >
                <Text style={StylesPdf.tag}>Device Name:&nbsp;</Text>
                <Text>{devName}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10
                }}
              >
                <Text style={StylesPdf.tag}>Date:&nbsp;</Text>
                <Text>{dateTime}</Text>
              </View>
            </View>
          </View>
          <View style={StylesPdf.right}>
            <Image
              source={hosImg ? hosImg : defaultImg}
              style={StylesPdf.img}
            />
            <Text>{deviceLogs.hospitalName}</Text>
            <Text>{deviceLogs.wardName}</Text>
          </View>
        </View>
        <View style={StylesPdf.Body_img}>
          <Image src={chartIMG} style={StylesPdf.img_width} />
        </View>
      </Page>
      {/* <Page
        dpi={300}
        orientation='landscape'
        size={'A4'}
        style={StylesPdf.body}
        wrap
      >
        <View>
          <Text>Test</Text>
        </View>
      </Page> */}
    </Document>
  )
}
