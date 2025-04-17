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

  const mappedData = deviceLogs?.log
    ? deviceLogs.log.map(item => ({
        time: new Date(item.createdAt).getTime(),
        tempAvg: Number(item.tempValue),
        probe: item.mcuId ?? 'unknown'
      }))
    : []

  const groupedByProbe: Record<string, { x: number; y: number }[]> = {}

  mappedData.forEach(item => {
    if (!groupedByProbe[item.probe]) {
      groupedByProbe[item.probe] = []
    }
    groupedByProbe[item.probe].push({ x: item.time, y: item.tempAvg })
  })

  const series: ApexAxisChartSeries = Object.keys(groupedByProbe).map(
    probe => ({
      type: 'line',
      name: probe,
      data: groupedByProbe[probe],
      zIndex: 50
    })
  )

  const dynamicColors = [
    'oklch(65% 0.25 30)',
    'oklch(65% 0.25 60)',
    'oklch(65% 0.25 90)',
    'oklch(65% 0.25 120)',
    'oklch(65% 0.25 150)',
    'oklch(65% 0.25 180)',
    'oklch(65% 0.25 210)',
    'oklch(65% 0.25 240)',
    'oklch(65% 0.25 270)',
    'oklch(65% 0.25 300)',
    'oklch(65% 0.25 330)',
    'oklch(65% 0.25 0)',
    'oklch(72% 0.27 15)',
    'oklch(72% 0.27 45)',
    'oklch(72% 0.27 75)',
    'oklch(72% 0.27 105)',
    'oklch(72% 0.27 135)',
    'oklch(72% 0.27 165)',
    'oklch(72% 0.27 195)',
    'oklch(72% 0.27 225)',
    'oklch(72% 0.27 255)',
    'oklch(72% 0.27 285)',
    'oklch(72% 0.27 315)',
    'oklch(72% 0.27 345)',
    'oklch(60% 0.20 20)',
    'oklch(60% 0.20 70)',
    'oklch(60% 0.20 140)',
    'oklch(60% 0.20 200)',
    'oklch(60% 0.20 260)',
    'oklch(60% 0.20 320)'
  ]

  const dynamicStrokeWidths = Array.from(
    { length: series.length },
    (_, _i) => 2.0
  )

  const dynamicStrokeCurves = Array(series.length).fill('smooth')

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
    yaxis: {
      show: true,
      axisTicks: {
        show: true
      },
      axisBorder: {
        show: true,
        color: 'oklch(65% 0.25 30 / 1)',
        width: 2.5
      },
      labels: {
        style: {
          fontFamily: 'Anuphan',
          colors: 'oklch(65% 0.25 30 / 1)',
          fontSize: '12px',
          fontWeight: 600
        }
      }
    },
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
