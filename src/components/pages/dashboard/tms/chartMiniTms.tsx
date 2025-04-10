import Chart from 'react-apexcharts'
import { useTranslation } from 'react-i18next'
import { DeviceLogTms } from '../../../../types/tms/devices/deviceType'

interface ChartMiniProps {
  deviceLogs: DeviceLogTms | undefined
  minTemp: number | undefined
  maxTemp: number | undefined
}

const ChartMiniTms = (props: ChartMiniProps) => {
  const { t } = useTranslation()
  const { deviceLogs } = props

  // const tempAvgValues = deviceLogs?.log
  //   ? deviceLogs?.log.map(item => item.tempValue)
  //   : [0]
  // const minTempAvg = Math.min(...tempAvgValues) - 2
  // const maxTempAvg = Math.max(...tempAvgValues) + 2

  const mappedData = deviceLogs?.log
    ? deviceLogs.log.map(item => ({
        time: new Date(item.createdAt).getTime(),
        tempAvg: item.tempValue,
        probe: item.mcuId
      }))
    : [{ time: 0, tempAvg: 0, probe: '' }]

  const groupedByProbe: Record<string, { x: number; y: number }[]> = {}

  mappedData.forEach(item => {
    if (!groupedByProbe[item.probe]) {
      groupedByProbe[item.probe] = []
    }
    groupedByProbe[item.probe].push({ x: item.time, y: item.tempAvg })
  })

  const series: ApexAxisChartSeries = Object.keys(groupedByProbe).map(
    probe => ({
      type: 'area',
      name: probe,
      data: groupedByProbe[probe],
      zIndex: 50
    })
  )

  // series.push(
  //   {
  //     type: 'area',
  //     name: t('tempMin'),
  //     zIndex: 60,
  //     data: mappedData.map(data => ({ x: data.time, y: minTemp }))
  //   },
  //   {
  //     type: 'area',
  //     name: t('tempMax'),
  //     zIndex: 60,
  //     data: mappedData.map(data => ({ x: data.time, y: maxTemp }))
  //   }
  // )

  const generateColors = (count: number) => {
    const colors = ['oklch(73.24% 0.1973 44.47 / 1)']
    for (let i = 1; i < count; i++) {
      const chroma = (Math.random() * 0.2 + 0.1).toFixed(4)
      const hue = (Math.random() * 360).toFixed(0)
      colors.push(`oklch(72% ${chroma} ${hue} / 1)`)
    }
    return colors
  }

  const dynamicColors = generateColors(series.length)

  const dynamicStrokeWidths = Array.from({ length: series.length }, (_, i) =>
    i === 0 ? 2.0 : 1.0
  )

  const dynamicStrokeCurves = Array(series.length).fill('smooth')

  const dynamicYaxis = Array.from({ length: series.length }, (_, i) => ({
    show: i === 0,
    axisTicks: {
      show: i === 0
    },
    axisBorder: {
      show: true,
      color: 'oklch(73.24% 0.1973 44.47 / 1)',
      width: 2.5
    },
    labels: {
      style: {
        fontFamily: 'Anuphan',
        colors: 'oklch(70% 0.1973 44.47 / 1)',
        fontSize: '14px',
        fontWeight: 600
      }
    },
    // min: minTempAvg - 5,
    // max: maxTempAvg + 5
  }))

  const options: ApexCharts.ApexOptions = {
    chart: {
      animations: {
        enabled: true,
        animateGradually: {
          enabled: true,
          delay: 300
        },
        dynamicAnimation: {
          speed: 500
        }
      },
      stacked: false,
      zoom: {
        type: 'x',
        enabled: false,
        autoScaleYaxis: false
      },
      toolbar: {
        show: false,
        autoSelected: 'zoom',
        tools: {
          download: false,
          selection: false
        }
      },
      locales: [
        {
          name: 'en',
          options: {
            months: [
              'มกราคม',
              'กุมภาพันธ์',
              'มีนาคม',
              'เมษายน',
              'พฤษภาคม',
              'มิถุนายน',
              'กรกฎาคม',
              'สิงหาคม',
              'กันยายน',
              'ตุลาคม',
              'พฤศจิกายน',
              'ธันวาคม'
            ],
            shortMonths: [
              'ม.ค.',
              'ก.พ.',
              'มี.ค.',
              'เม.ย.',
              'พ.ค.',
              'มิ.ย.',
              'ก.ค.',
              'ส.ค.',
              'ก.ย.',
              'ต.ค.',
              'พ.ย.',
              'ธ.ค.'
            ],
            days: [
              'อาทิตย์',
              'จันทร์',
              'อังคาร',
              'พุธ',
              'พฤหัสบดี',
              'ศุกร์',
              'เสาร์'
            ],
            shortDays: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
            toolbar: {
              exportToSVG: 'Download SVG',
              exportToPNG: 'Download PNG',
              // "menu": "Menu",
              selection: 'เลือก',
              selectionZoom: 'ซูมเลือก',
              zoomIn: 'ซูมเข้า',
              zoomOut: 'ซูมออก',
              pan: 'การแพน',
              reset: 'ยกเลิกการซูม'
            } //make it component
          }
        }
      ],
      defaultLocale: 'en'
    },
    tooltip: {
      theme: 'apexcharts-tooltip',
      x: {
        format: 'dd MMM yy HH:mm'
      },
      style: {
        fontSize: '14px'
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
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0
    },
    stroke: {
      lineCap: 'round',
      curve: dynamicStrokeCurves,
      width: dynamicStrokeWidths
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: dynamicYaxis,
    noData: {
      text: t('nodata'),
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: 'oklch(61% 0 238 / var(--tw-text-opacity, 1))',
        fontSize: '14px',
        fontFamily: 'anuphan'
      }
    },
    colors: dynamicColors,
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: dynamicColors.map(color =>
          color.replace('72%', '79.71%')
        ),
        inverseColors: true,
        opacityFrom: 0.45,
        opacityTo: 0,
        stops: [0, 25]
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'right'
    }
  }

  return (
    <div className='mb-5'>
      <Chart options={options} series={series} height={310} />
    </div>
  )
}

export default ChartMiniTms
