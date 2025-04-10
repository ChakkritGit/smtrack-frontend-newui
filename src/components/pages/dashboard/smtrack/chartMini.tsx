import Chart from 'react-apexcharts'
import { useTranslation } from 'react-i18next'
import { DeviceLogType } from '../../../../types/smtrack/logs/deviceLog'

interface ChartMiniProps {
  logData: DeviceLogType[]
  tempMin: number
  tempMax: number
}

const ChartMini = (props: ChartMiniProps) => {
  const { t } = useTranslation()
  const { logData, tempMin, tempMax } = props

  const tempAvgValues = logData.map(item => item.temp)
  const minTempAvg = Math.min(...tempAvgValues)
  const maxTempAvg = Math.max(...tempAvgValues)

  const mappedData = logData.map(item => {
    const time = new Date(item.sendTime).getTime()
    return {
      time,
      tempAvg: item.tempDisplay,
      humidityAvg: item.humidityDisplay,
      door: item.door1 || item.door2 || item.door3 ? 1 : 0
    }
  })

  const series: ApexAxisChartSeries = [
    {
      type: 'area',
      zIndex: 2,
      name: t('humidityName'),
      data: mappedData.map(data => ({
        x: data.time,
        y: data.humidityAvg
      }))
    },
    {
      type: 'area',
      zIndex: 1,
      name: t('temperatureName'),
      data: mappedData.map(data => ({
        x: data.time,
        y: data.tempAvg
      }))
    },
    {
      type: 'area',
      name: t('tempMin'),
      zIndex: 3,
      data: mappedData.map(data => ({
        x: data.time,
        y: tempMin
      }))
    },
    {
      type: 'area',
      name: t('tempMax'),
      zIndex: 4,
      data: mappedData.map(data => ({
        x: data.time,
        y: tempMax
      }))
    },
    {
      type: 'area',
      name: t('dashDoor'),
      zIndex: 5,
      data: mappedData.map(data => ({
        x: data.time,
        y: data.door
      }))
    }
  ]

  const options: ApexCharts.ApexOptions = {
    chart: {
      animations: {
        enabled: true,
        animateGradually: {
          enabled: true
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
      enabled: true,
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
      curve: ['smooth', 'smooth', 'smooth', 'smooth', 'stepline'],
      width: [3, 3, 1.5, 1.5, 2]
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: [
      {
        show: true,
        opposite: false,
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
          color: 'oklch(79% 0.1305 238 / 1)',
          width: 2.5
        },
        labels: {
          style: {
            fontFamily: 'Anuphan',
            colors: 'oklch(70% 0.1305 238 / 1)',
            fontSize: '14px',
            fontWeight: 600
          }
        },
        min: 0,
        max: 100
      },
      {
        axisTicks: {
          show: true
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
        min: tempMin - 3.5 - minTempAvg / 1.3,
        max: tempMax + 3.5 + maxTempAvg / 1.3
      },
      {
        show: false,
        min: tempMin - 3.5 - minTempAvg / 1.3,
        max: tempMax + 3.5 + maxTempAvg / 1.3
      },
      {
        show: false,
        min: tempMin - 3.5 - minTempAvg / 1.3,
        max: tempMax + 3.5 + maxTempAvg / 1.3
      },
      {
        show: false,
        min: 5,
        max: 0
      }
    ],
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
    colors: [
      'oklch(79% 0.1305 238 / var(--tw-text-opacity, 0.45))',
      'oklch(73.24% 0.1973 44.47 / var(--tw-text-opacity, 1))',
      'oklch(0.81 0.1825 170.47 / var(--tw-text-opacity, 1))',
      'oklch(0.81 0.1825 170.47 / var(--tw-text-opacity, 1))',
      'oklch(90% 0.1378 90 / var(--tw-text-opacity, 1))'
    ],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: [
          'oklch(84.41% 0.0937 238 / var(--tw-text-opacity, 0.45))',
          'oklch(76.18% 0.1702 44.47 / var(--tw-text-opacity, 1))',
          'oklch(0% 0 0 / var(--tw-text-opacity, 0))',
          'oklch(0% 0 0 / var(--tw-text-opacity, 0))',
          'oklch(0% 0 0 / var(--tw-text-opacity, 0))'
        ],
        inverseColors: true,
        opacityFrom: 0.45,
        opacityTo: 0,
        stops: [minTempAvg, tempMax + maxTempAvg + 50]
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

export default ChartMini
