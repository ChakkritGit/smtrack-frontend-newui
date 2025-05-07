import ApexCharts from 'apexcharts'
import {
  Document,
  Page,
  Image,
  Text,
  View,
  StyleSheet,
  pdf,
  Font
} from '@react-pdf/renderer'
import { useState } from 'react'
import Loading from '../components/skeleton/table/loading'
import AnuphanRegular from '../assets/fonts/Anuphan-Regular.ttf'
import AnuphanMedium from '../assets/fonts/Anuphan-Medium.ttf'

type ChartImage = {
  title: string
  base64: string
}

type ChartData = {
  chart: {
    type: string
    width: number
    height: number
  }
  series: {
    name: string
    data: number[]
  }[]
  xaxis: {
    categories: string[]
  }
}

Font.register({
  family: 'Anuphan',
  fonts: [
    {
      src: AnuphanRegular
    },
    {
      src: AnuphanMedium
    }
  ]
})

const ChartPdf = () => {
  const [loading, setLoading] = useState(false)

  const chartDataList = [
    {
      title: 'กราฟ A',
      series: [{ name: 'A', data: [10, 20, 16, 40] }],
      categories: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.']
    },
    {
      title: 'กราฟ B',
      series: [{ name: 'B', data: [26, 8, 27, 12] }],
      categories: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.']
    }
  ]

  const renderChartToBase64 = async (options: ChartData): Promise<string> => {
    const div = document.createElement('div')
    div.style.display = 'none'
    document.body.appendChild(div)

    const chart = new ApexCharts(div, options)
    await chart.render()

    const result = await chart.dataURI()
    chart.destroy()
    document.body.removeChild(div)

    if ('imgURI' in result) {
      return result.imgURI
    } else {
      const base64 = await blobToBase64(result.blob)
      return base64
    }
  }

  const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })

  const styles = StyleSheet.create({
    page: {
      fontFamily: 'Anuphan',
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35
    },
    section: { marginBottom: 20 },
    chartTitle: { fontSize: 14, marginBottom: 10 },
    chartImage: { width: 524, height: 262 }
  })

  const ChartPDF: React.FC<{ chartImages: ChartImage[] }> = ({
    chartImages
  }) => (
    <Document>
      <Page style={styles.page}>
        {chartImages.map((img, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.chartTitle}>{img.title}</Text>
            <Image style={styles.chartImage} src={img.base64} />
          </View>
        ))}
      </Page>
    </Document>
  )

  const generatePdfWithCharts = async () => {
    setLoading(true)
    const chartImages = []

    for (const chart of chartDataList) {
      const options = {
        chart: {
          type: 'line',
          width: 524,
          height: 262,
          animations: {
            enabled: false
          }
        },
        stacked: true,
        series: chart.series,
        xaxis: { categories: chart.categories },
        yaxis: {
          show: true,
          opposite: false,
          axisBorder: {
            show: true,
            color: 'oklch(70% 0.1305 238 / 1)',
            width: 1.5
          },
          labels: {
            style: {
              fontFamily: 'Anuphan',
              colors: 'oklch(70% 0.1305 238 / 1)',
              fontSize: '10px',
              fontWeight: 600
            }
          }
        },
        grid: {
          show: true,
          strokeDashArray: 5,
          borderColor: 'oklch(61% 0 238 / var(--tw-text-opacity, .15))',
          xaxis: {
            lines: {
              show: true
            }
          },
          yaxis: {
            lines: {
              show: true
            }
          }
        },
        stroke: {
          lineCap: 'round',
          curve: 'smooth',
          width: 1.5
        }
      }

      const base64 = await renderChartToBase64(options)
      chartImages.push({ title: chart.title, base64 })
    }

    const blob = await pdf(<ChartPDF chartImages={chartImages} />).toBlob()
    setLoading(false)

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'charts.pdf'
    link.click()
  }

  return (
    <div className='flex items-center justify-center h-[calc(100dvh-205px)]'>
      {!loading ? (
        <button className='btn btn-primary' onClick={generatePdfWithCharts}>
          Export PDF
        </button>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default ChartPdf
