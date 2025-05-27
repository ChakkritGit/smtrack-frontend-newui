import { TFunction } from 'i18next'
import {
  PiDoorLight,
  PiDoorOpenLight,
  PiNoteLight,
  PiPlugsConnectedLight,
  PiPlugsLight,
  PiSimCardLight,
  PiSirenLight,
  PiThermometerColdLight,
  PiThermometerHotLight,
  PiThermometerSimpleLight
} from 'react-icons/pi'

const changIcon = (text: string) => {
  if (text.split(':')[1]?.substring(1, 5) === 'DOOR') {
    if (text.split(' ')[3] === 'opened') {
      return <PiDoorOpenLight size={28} className='text-red-500' />
    } else {
      return <PiDoorLight size={28} className='text-primary' />
    }
  } else if (text.split(' ')[0] === 'Power') {
    if (text.split(' ')[1] === 'off') {
      return <PiPlugsLight size={28} className='text-red-500' />
    } else {
      return <PiPlugsConnectedLight size={28} className='text-primary' />
    }
  } else if (text.split(' ')[0] === 'SDCard') {
    if (text.split(' ')[1] === 'failed') {
      return <PiSimCardLight size={28} className='text-red-500' />
    } else {
      return <PiSimCardLight size={28} className='text-primary' />
    }
  } else if (text.split(' ')[0]?.substring(0, 5) === 'PROBE') {
    if (text.split(' ')[4] === 'high') {
      return <PiThermometerHotLight size={28} className='text-red-500' />
    } else if (text.split(' ')[4] === 'low') {
      return <PiThermometerColdLight size={28} className='text-red-500' />
    } else {
      return <PiThermometerSimpleLight size={28} className='text-primary' />
    }
  } else if (text.split('/')[0] === 'REPORT') {
    return <PiNoteLight size={28} className='text-primary' />
  } else {
    return <PiSirenLight size={28} className='text-red-500' />
  }
}

const changText = (text: string, t: TFunction<'translation', undefined>) => {
  if (text.split(':')[1]?.substring(1, 5) === 'DOOR') {
    const probe = text.split(' ')
    const probeNumber = probe[0].replace('PROBE', '')?.substring(0, 1)
    const doorNumber = probe[1].replace('DOOR', '')
    const status = probe[3] === 'opened' ? t('stateOn') : t('stateOff')
    return `${t('deviceProbeTb')} ${probeNumber} ${t(
      'doorNum'
    )} ${doorNumber} ${status}`
  } else if (text.split(' ')[0] === 'Power') {
    if (text.split(' ')[1] === 'off') {
      return t('plugProblem')
    } else {
      return t('plugBackToNormal')
    }
  } else if (text.split(' ')[0] === 'SDCard') {
    if (text.split(' ')[1] === 'failed') {
      return t('SdCardProblem')
    } else {
      return t('SdCardBackToNormal')
    }
  } else if (text.split(' ')[0]?.substring(0, 5) === 'PROBE') {
    if (text.split(' ')[4] === 'high') {
      return t('tempHigherLimmit')
    } else if (text.split(' ')[4] === 'low') {
      return t('tempBelowLimmit')
    } else {
      return t('tempBackToNormal')
    }
  } else if (text.split('/')[0] === 'REPORT') {
    return `${t('reportText')}/ ${t('devicsmtrackTb')}: ${
      extractValues(text)?.temperature
        ? extractValues(text)?.temperature
        : '- -'
    }°C, ${t('deviceHumiTb')}: ${
      extractValues(text)?.humidity ? extractValues(text)?.humidity : '- -'
    }%`
  } else {
    return text
  }
}

const extractValues = (text: string) => {
  if (text.split('/')[0] === 'REPORT') {
    const matches = text.match(/(-?\d+(\.\d+)?)/g)

    if (matches && matches.length >= 2) {
      const temperature = parseFloat(matches[0])
      const humidity = parseFloat(matches[1])
      return { temperature, humidity }
    }
  }

  return null
}

export { changIcon, changText, extractValues }
