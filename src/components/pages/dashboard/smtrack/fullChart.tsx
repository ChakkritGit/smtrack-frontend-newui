import Chart from 'react-apexcharts'
import { useTranslation } from 'react-i18next'
import { DeviceLog, DeviceLogs} from '../../../../types/smtrack/devices/deviceType'
import Loading from '../../../skeleton/table/loading'
import { useMemo } from 'react'

interface FullChartPropType {
  dataLog: DeviceLogs[]
  deviceLogs: DeviceLog
  tempMin: number
  tempMax: number
  isLoading: boolean
}

const doorOpen = (doorQty: number | undefined, deviceLog: DeviceLogs) => {
  switch (doorQty) {
    case 1:
      // กรณีมี 1 ประตู: สนใจแค่ door1 เท่านั้น
      return deviceLog.door1 ? 1 : 0

    case 2:
      // กรณีมี 2 ประตู: สนใจแค่ door1 หรือ door2 (ถ้า door1 เปิด จะ return door1 ก่อน)
      return deviceLog.door1 || deviceLog.door2 ? 1 : 0

    case 3:
      // กรณีมี 3 ประตู: เช็คทั้ง 3 บาน
      return deviceLog.door1 || deviceLog.door2 || deviceLog.door3 ? 1 : 0

    default:
      // กรณีไม่ระบุ doorQty หรือเป็น 0
      return 0
  }
}

const FullChartComponent = (props: FullChartPropType) => {
  const { t } = useTranslation()
  const { dataLog, tempMin, tempMax, isLoading, deviceLogs } = props

  const tempAvgValues = dataLog ? dataLog.map(item => item.temp) : [0]
  const minTemp = Math.min(...tempAvgValues, tempMin)
  const maxTemp = Math.max(...tempAvgValues, tempMax)

  const limitMin = Math.floor(minTemp - 3.2)
  const limitMax = Math.ceil(maxTemp + 3.2)

  const mappedData = dataLog.map(item => {
    const time = new Date(item._time).getTime()
    const doorQty = deviceLogs?.probe?.find(item => item.doorQty)?.doorQty

    return {
      time,
      tempAvg: item.temp,
      humidityAvg: item.humidity,
      door: doorOpen(doorQty, item)
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

  const dynamicOpacityFrom: number[] = []
  const dynamicOpacityTo: number[] = []
  const TARGET_OPACITY = 0.15

  series.forEach(s => {
    if (s.name === t('temperatureName')) {
      if (s.data && Array.isArray(s.data)) {
        const yValues = s.data.map((point: any) =>
          typeof point === 'object' ? point.y : point
        )
        const maxValInSeries = Math.max(...yValues, -Infinity)

        if (maxValInSeries > 0) {
          dynamicOpacityFrom.push(TARGET_OPACITY)
          dynamicOpacityTo.push(0)
        } else {
          dynamicOpacityFrom.push(0)
          dynamicOpacityTo.push(TARGET_OPACITY)
        }
      } else {
        dynamicOpacityFrom.push(TARGET_OPACITY)
        dynamicOpacityTo.push(0)
      }
    } else if (s.name === t('humidityName')) {
      dynamicOpacityFrom.push(TARGET_OPACITY)
      dynamicOpacityTo.push(0)
    } else {
      dynamicOpacityFrom.push(0)
      dynamicOpacityTo.push(0)
    }
  })

  const options: ApexCharts.ApexOptions = {
    chart: {
      height: 680,
      animations: {
        enabled: false,
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
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        show: true,
        autoSelected: 'zoom',
        tools: {
          download: false,
          selection: true
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
          width: 3
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
          width: 3
        },
        labels: {
          style: {
            fontFamily: 'Anuphan',
            colors: 'oklch(70% 0.1973 44.47 / 1)',
            fontSize: '14px',
            fontWeight: 600
          }
        },
        min: limitMin,
        max: limitMax
      },
      {
        show: false,
        min: limitMin,
        max: limitMax
      },
      {
        show: false,
        min: limitMin,
        max: limitMax
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
          'oklch(79% 0.1305 238 / var(--tw-text-opacity, 0.45))',
          'oklch(76.18% 0.1702 44.47 / var(--tw-text-opacity, 1))',
          'oklch(0% 0 0 / var(--tw-text-opacity, 0))',
          'oklch(0% 0 0 / var(--tw-text-opacity, 0))',
          'oklch(0% 0 0 / var(--tw-text-opacity, 0))'
        ],
        inverseColors: false,
        opacityFrom: dynamicOpacityFrom,
        opacityTo: dynamicOpacityTo,
        stops: [0, 100]
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'right'
    },
    responsive: [
      {
        breakpoint: 5124,
        options: {
          chart: {
            height: 2445
          }
        }
      },
      {
        breakpoint: 3844,
        options: {
          chart: {
            height: 1745
          }
        }
      },
      {
        breakpoint: 2564,
        options: {
          chart: {
            height: 1045
          }
        }
      },
      {
        breakpoint: 1924,
        options: {
          chart: {
            height: 635
          }
        }
      },
      {
        breakpoint: 1284,
        options: {
          chart: {
            height: 545
          }
        }
      },
      {
        breakpoint: 724,
        options: {
          chart: {
            height: 445
          }
        }
      },
      {
        breakpoint: 484,
        options: {
          chart: {
            height: 345
          }
        }
      }
    ]
  }

  const chart = useMemo(
    () => <Chart options={options} series={series} />,
    [dataLog]
  )

  return (
    <div className={`mt-3 ${isLoading ? 'h-[calc(100dvh-260px)]' : ''}`}>
      {isLoading ? <Loading /> : chart}
    </div>
  )
}

export default FullChartComponent
