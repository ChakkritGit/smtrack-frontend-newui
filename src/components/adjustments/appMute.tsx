import { Dispatch, SetStateAction } from 'react'
import { Option } from '../../types/global/hospitalAndWard'
import { useTranslation } from 'react-i18next'
import Select, { SingleValue } from 'react-select'
import {
  Schedule,
  ScheduleHour,
  ScheduleMinute
} from '../../types/tms/devices/probeType'
import {
  scheduleDayArray,
  scheduleMinuteArray,
  scheduleTimeArray
} from '../../constants/utils/utilsConstants'

type AppMuteProps = {
  setMuteMode: Dispatch<
    SetStateAction<{
      choichOne: string
      choichtwo: string
      choichthree: string
      choichfour: string
    }>
  >
  setSendTime: Dispatch<
    SetStateAction<{
      after: number
      every: number
    }>
  >
  setScheduleDay: Dispatch<
    SetStateAction<{
      firstDay: string
      seccondDay: string
      thirdDay: string
    }>
  >
  setScheduleTime: Dispatch<
    SetStateAction<{
      firstTime: string
      secondTime: string
      thirdTime: string
      firstMinute: string
      seccondMinute: string
      thirdMinute: string
    }>
  >
  muteMode: {
    choichOne: string
    choichtwo: string
    choichthree: string
    choichfour: string
  }
  sendTime: {
    after: number
    every: number
  }
  scheduleDay: {
    firstDay: string
    seccondDay: string
    thirdDay: string
  }
  scheduleTime: {
    firstTime: string
    secondTime: string
    thirdTime: string
    firstMinute: string
    seccondMinute: string
    thirdMinute: string
  }
}

const AppMute = (props: AppMuteProps) => {
  const { t } = useTranslation()
  const {
    muteMode,
    scheduleDay,
    scheduleTime,
    sendTime,
    setMuteMode,
    setScheduleDay,
    setScheduleTime,
    setSendTime
  } = props

  const filterOptions = (options: Option[], selectedValues: string[]) => {
    return options.filter(
      option => option.value === 'OFF' || !selectedValues.includes(option.value)
    )
  }

  const getScheduleDay = (e: SingleValue<Option>, key: string) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    switch (key) {
      case 'firstDay':
        setScheduleDay({ ...scheduleDay, firstDay: selectedValue })
        break
      case 'seccondDay':
        setScheduleDay({ ...scheduleDay, seccondDay: selectedValue })
        break
      case 'thirdDay':
        setScheduleDay({ ...scheduleDay, thirdDay: selectedValue })
        break
    }
  }

  const getScheduleTime = (e: SingleValue<Option>, key: string) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    switch (key) {
      case 'firstTime':
        setScheduleTime({ ...scheduleTime, firstTime: selectedValue })
        break
      case 'seccondTime':
        setScheduleTime({ ...scheduleTime, secondTime: selectedValue })
        break
      case 'thirdTime':
        setScheduleTime({ ...scheduleTime, thirdTime: selectedValue })
        break
    }
  }

  const getScheduleTimeMinute = (e: SingleValue<Option>, key: string) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    switch (key) {
      case 'firstTimeMinute':
        setScheduleTime({ ...scheduleTime, firstMinute: selectedValue })
        break
      case 'seccondTimeMinute':
        setScheduleTime({ ...scheduleTime, seccondMinute: selectedValue })
        break
      case 'thirdTimeMinute':
        setScheduleTime({ ...scheduleTime, thirdMinute: selectedValue })
        break
    }
  }

  const mapOptions = <T, K extends keyof T>(
    data: T[],
    valueKey: K,
    labelKey: K
  ): Option[] =>
    data?.map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))

  const mapDefaultValue = <T, K extends keyof T>(
    data: T[],
    id: string,
    valueKey: K,
    labelKey: K
  ): Option | undefined =>
    data
      ?.filter(item => item[valueKey] === id)
      .map(item => ({
        value: item[valueKey] as unknown as string,
        label: item[labelKey] as unknown as string
      }))[0]

  return (
    <div className='w-full my-4'>
      <h3 className='font-bold text-base'>{t('notificationSettings')}</h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full'>
        {/* Right Column - 2/3 of the grid (70%) */}
        <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
          {/* 1 */}
          <div className='form-control w-full'>
            <label className='label flex-col items-start w-full mb-3'>
              <span className='label-text mb-2 text-wrap'>
                {t('choiceOne')}
              </span>
              <div className='flex flex-col gap-3'>
                <label className='flex items-center gap-2'>
                  <input
                    type='radio'
                    name='immediately'
                    className='radio radio-primary'
                    checked={muteMode.choichOne === 'immediately'}
                    onChange={() =>
                      setMuteMode({
                        ...muteMode,
                        choichOne: 'immediately'
                      })
                    }
                  />
                  <span>{t('messageimmediately')}</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='radio'
                    name='after'
                    className='radio radio-primary'
                    checked={muteMode.choichOne === 'after'}
                    onChange={() =>
                      setMuteMode({ ...muteMode, choichOne: 'after' })
                    }
                  />
                  <span>{t('messageAfter')}</span>
                </label>
                {muteMode.choichOne === 'after' && (
                  <div className='join'>
                    <button
                      name='after'
                      type='button'
                      className='btn join-item rounded-l-box'
                      onClick={() => {
                        if (sendTime.after > 5) {
                          setSendTime({
                            ...sendTime,
                            after: sendTime.after - 5
                          })
                        }
                      }}
                    >
                      -
                    </button>
                    <input
                      name='after'
                      className='input input-bordered join-item'
                      type='number'
                      min={5}
                      max={30}
                      step={5}
                      value={sendTime.after}
                    />
                    <button
                      name='after'
                      type='button'
                      className='btn join-item rounded-r-box'
                      onClick={() => {
                        if (sendTime.after < 30) {
                          setSendTime({
                            ...sendTime,
                            after: sendTime.after + 5
                          })
                        }
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* 2 */}
          <div className='form-control w-full'>
            <label className='label flex-col items-start w-full mb-3'>
              <span className='label-text mb-2 text-wrap'>
                {t('choiceTwo')}
              </span>
              <div className='flex flex-col gap-3'>
                <label className='flex items-center gap-2'>
                  <input
                    type='radio'
                    name='send'
                    className='radio radio-primary'
                    checked={muteMode.choichtwo === 'send'}
                    onChange={() =>
                      setMuteMode({ ...muteMode, choichtwo: 'send' })
                    }
                  />
                  <span>{t('messageSend')}</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='radio'
                    name='donotsend'
                    className='radio radio-primary'
                    checked={muteMode.choichtwo === 'donotsend'}
                    onChange={() =>
                      setMuteMode({
                        ...muteMode,
                        choichtwo: 'donotsend'
                      })
                    }
                  />
                  <span>{t('messageDonotSend')}</span>
                </label>
              </div>
            </label>
          </div>
        </div>
        {/* Right Column - 2/3 of the grid (70%) */}
        <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
          {/* 3 */}
          <div className='form-control w-full'>
            <label className='label flex-col items-start w-full mb-3'>
              <span className='label-text mb-2 text-wrap'>
                {t('choiceThree')}
              </span>
              <div className='flex flex-col gap-3'>
                <label className='flex items-center gap-2'>
                  <input
                    type='radio'
                    name='onetime'
                    className='radio radio-primary'
                    checked={muteMode.choichthree === 'onetime'}
                    onChange={() =>
                      setMuteMode({
                        ...muteMode,
                        choichthree: 'onetime'
                      })
                    }
                  />
                  <span>{t('messageOneTime')}</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='radio'
                    name='every'
                    className='radio radio-primary'
                    checked={muteMode.choichthree === 'every'}
                    onChange={() =>
                      setMuteMode({ ...muteMode, choichthree: 'every' })
                    }
                  />
                  <span>{t('messageEvery')}</span>
                </label>
                {muteMode.choichthree === 'every' && (
                  <div className='join'>
                    <button
                      name='every'
                      type='button'
                      className='btn join-item rounded-l-box'
                      onClick={() => {
                        if (sendTime.every > 5) {
                          setSendTime({
                            ...sendTime,
                            every: sendTime.every - 5
                          })
                        }
                      }}
                    >
                      -
                    </button>
                    <input
                      name='every'
                      className='input input-bordered join-item'
                      type='number'
                      min={5}
                      max={30}
                      step={5}
                      value={sendTime.every}
                    />
                    <button
                      name='every'
                      type='button'
                      className='btn join-item rounded-r-box'
                      onClick={() => {
                        if (sendTime.every < 30) {
                          setSendTime({
                            ...sendTime,
                            every: sendTime.every + 5
                          })
                        }
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* 4 */}
          <div className='form-control w-full'>
            <label className='label flex-col items-start w-full mb-3'>
              <span className='label-text mb-2 text-wrap'>
                {t('choiceFour')}
              </span>
              <div className='flex flex-col gap-3'>
                <label className='flex items-center gap-2'>
                  <input
                    type='radio'
                    name='off'
                    className='radio radio-primary'
                    checked={muteMode.choichfour === 'off'}
                    onChange={() =>
                      setMuteMode({ ...muteMode, choichfour: 'off' })
                    }
                  />
                  <span>{t('messageOff')}</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='radio'
                    name='on'
                    className='radio radio-primary'
                    checked={muteMode.choichfour === 'on'}
                    onChange={() =>
                      setMuteMode({ ...muteMode, choichfour: 'on' })
                    }
                  />
                  <span>{t('messageOn')}</span>
                </label>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className='divider divider-vertical opacity-50'>
        {t('scheduleTile')}
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 w-full'>
        <div className='form-control w-full items-center justify-center'>
          <label
            className='label flex-col items-center justify-center w-full'
            htmlFor='scheduleDayArray'
          >
            <span className='label-text mb-2 text-wrap'>{t('firstDay')}</span>
            <Select
              id='scheduleDayArray'
              isDisabled={scheduleDay.firstDay === 'ALL'}
              key={String(scheduleDay.firstDay)}
              options={filterOptions(
                mapOptions<Schedule, keyof Schedule>(
                  scheduleDayArray,
                  'scheduleKey',
                  'scheduleLabel'
                ),
                [String(scheduleDay.seccondDay), String(scheduleDay.thirdDay)]
              )}
              value={mapDefaultValue<Schedule, keyof Schedule>(
                scheduleDayArray,
                String(scheduleDay.firstDay),
                'scheduleKey',
                'scheduleLabel'
              )}
              onChange={e => getScheduleDay(e, 'firstDay')}
              autoFocus={false}
              menuPlacement='top'
              className='react-select-container custom-menu-select z-[75] min-w-full'
              classNamePrefix='react-select'
            />
          </label>
        </div>
        <div className='form-control w-full items-center justify-center'>
          <label
            className='label flex-col items-center justify-center w-full'
            htmlFor='scheduleDayArray'
          >
            <span className='label-text mb-2 text-wrap'>{t('seccondDay')}</span>
            <Select
              id='scheduleDayArray'
              isDisabled={scheduleDay.seccondDay === 'ALL'}
              key={String(scheduleDay.seccondDay)}
              options={filterOptions(
                mapOptions<Schedule, keyof Schedule>(
                  scheduleDayArray,
                  'scheduleKey',
                  'scheduleLabel'
                ),
                [String(scheduleDay.firstDay), String(scheduleDay.thirdDay)]
              )}
              value={mapDefaultValue<Schedule, keyof Schedule>(
                scheduleDayArray,
                String(scheduleDay.seccondDay),
                'scheduleKey',
                'scheduleLabel'
              )}
              onChange={e => getScheduleDay(e, 'seccondDay')}
              autoFocus={false}
              menuPlacement='top'
              className='react-select-container custom-menu-select z-[75] min-w-full'
              classNamePrefix='react-select'
            />
          </label>
        </div>
        <div className='form-control w-full items-center justify-center'>
          <label
            className='label flex-col items-center justify-center w-full'
            htmlFor='scheduleDayArray'
          >
            <span className='label-text mb-2 text-wrap'>{t('thirdDay')}</span>
            <Select
              id='scheduleDayArray'
              isDisabled={scheduleDay.thirdDay === 'ALL'}
              key={String(scheduleDay.thirdDay)}
              options={filterOptions(
                mapOptions<Schedule, keyof Schedule>(
                  scheduleDayArray,
                  'scheduleKey',
                  'scheduleLabel'
                ),
                [String(scheduleDay.firstDay), String(scheduleDay.seccondDay)]
              )}
              value={mapDefaultValue<Schedule, keyof Schedule>(
                scheduleDayArray,
                String(scheduleDay.thirdDay),
                'scheduleKey',
                'scheduleLabel'
              )}
              onChange={e => getScheduleDay(e, 'thirdDay')}
              autoFocus={false}
              menuPlacement='top'
              className='react-select-container custom-menu-select z-[75] min-w-full'
              classNamePrefix='react-select'
            />
          </label>
        </div>
        <div className='form-control w-full items-center justify-center'>
          <label
            className='label flex-col items-center justify-center w-full h-full'
            htmlFor='toggle'
          >
            <span className='label-text mb-2 text-wrap'>{t('everyDays')}</span>
            <input
              id='toggle'
              type='checkbox'
              className='toggle toggle-md'
              checked={
                scheduleDay.firstDay === 'ALL' &&
                scheduleDay.seccondDay === 'ALL' &&
                scheduleDay.thirdDay === 'ALL'
              }
              onClick={() => {
                if (
                  scheduleDay.firstDay === 'ALL' &&
                  scheduleDay.seccondDay === 'ALL' &&
                  scheduleDay.thirdDay === 'ALL'
                ) {
                  setScheduleDay({
                    firstDay: '',
                    seccondDay: '',
                    thirdDay: ''
                  })
                } else {
                  setScheduleDay({
                    firstDay: 'ALL',
                    seccondDay: 'ALL',
                    thirdDay: 'ALL'
                  })
                }
              }}
            />
          </label>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5 w-full'>
        <span className='label-text mb-2 text-wrap'>{t('firstTime')}</span>
        <Select
          name='scheduleTimeArray'
          // key={String(scheduleTime.firstTime)}
          options={filterOptions(
            mapOptions<ScheduleHour, keyof ScheduleHour>(
              scheduleTimeArray,
              'scheduleHourKey',
              'scheduleHourLabel'
            ),
            [String(scheduleTime.secondTime), String(scheduleTime.thirdTime)]
          )}
          value={mapDefaultValue<ScheduleHour, keyof ScheduleHour>(
            scheduleTimeArray,
            String(scheduleTime.firstTime),
            'scheduleHourKey',
            'scheduleHourLabel'
          )}
          onChange={e => getScheduleTime(e, 'firstTime')}
          autoFocus={false}
          menuPlacement='top'
          className='react-select-container custom-menu-select z-[75] min-w-full'
          classNamePrefix='react-select'
        />
        <Select
          isDisabled={scheduleTime.firstTime === 'OFF'}
          name='scheduleMinuteArray'
          // key={String(scheduleTime.firstMinute)}
          options={mapOptions<ScheduleMinute, keyof ScheduleMinute>(
            scheduleMinuteArray,
            'scheduleMinuteKey',
            'scheduleMinuteLabel'
          )}
          value={mapDefaultValue<ScheduleMinute, keyof ScheduleMinute>(
            scheduleMinuteArray,
            String(scheduleTime.firstMinute),
            'scheduleMinuteKey',
            'scheduleMinuteLabel'
          )}
          onChange={e => getScheduleTimeMinute(e, 'firstTimeMinute')}
          autoFocus={false}
          menuPlacement='top'
          className='react-select-container custom-menu-select z-[75] min-w-full'
          classNamePrefix='react-select'
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 w-full'>
        <span className='label-text mb-2 text-wrap'>{t('seccondTime')}</span>
        <Select
          name='scheduleTimeArray'
          options={filterOptions(
            mapOptions<ScheduleHour, keyof ScheduleHour>(
              scheduleTimeArray,
              'scheduleHourKey',
              'scheduleHourLabel'
            ),
            [String(scheduleTime.firstTime), String(scheduleTime.thirdTime)]
          )}
          value={mapDefaultValue<ScheduleHour, keyof ScheduleHour>(
            scheduleTimeArray,
            String(scheduleTime.secondTime),
            'scheduleHourKey',
            'scheduleHourLabel'
          )}
          onChange={e => getScheduleTime(e, 'seccondTime')}
          autoFocus={false}
          menuPlacement='top'
          className='react-select-container custom-menu-select z-[75] min-w-full'
          classNamePrefix='react-select'
        />
        <Select
          isDisabled={scheduleTime.secondTime === 'OFF'}
          name='scheduleMinuteArray'
          // key={String(scheduleTime.firstMinute)}
          options={mapOptions<ScheduleMinute, keyof ScheduleMinute>(
            scheduleMinuteArray,
            'scheduleMinuteKey',
            'scheduleMinuteLabel'
          )}
          value={mapDefaultValue<ScheduleMinute, keyof ScheduleMinute>(
            scheduleMinuteArray,
            String(scheduleTime.seccondMinute),
            'scheduleMinuteKey',
            'scheduleMinuteLabel'
          )}
          onChange={e => getScheduleTimeMinute(e, 'seccondTimeMinute')}
          autoFocus={false}
          menuPlacement='top'
          className='react-select-container custom-menu-select z-[75] min-w-full'
          classNamePrefix='react-select'
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 w-full'>
        <span className='label-text mb-2 text-wrap'>{t('thirdTime')}</span>
        <Select
          name='scheduleTimeArray'
          // key={String(scheduleTime.firstTime)}
          options={filterOptions(
            mapOptions<ScheduleHour, keyof ScheduleHour>(
              scheduleTimeArray,
              'scheduleHourKey',
              'scheduleHourLabel'
            ),
            [String(scheduleTime.firstTime), String(scheduleTime.secondTime)]
          )}
          value={mapDefaultValue<ScheduleHour, keyof ScheduleHour>(
            scheduleTimeArray,
            String(scheduleTime.thirdTime),
            'scheduleHourKey',
            'scheduleHourLabel'
          )}
          onChange={e => getScheduleTime(e, 'thirdTime')}
          autoFocus={false}
          menuPlacement='top'
          className='react-select-container custom-menu-select z-[75] min-w-full'
          classNamePrefix='react-select'
        />
        <Select
          isDisabled={scheduleTime.thirdTime === 'OFF'}
          name='scheduleMinuteArray'
          // key={String(scheduleTime.firstMinute)}
          options={mapOptions<ScheduleMinute, keyof ScheduleMinute>(
            scheduleMinuteArray,
            'scheduleMinuteKey',
            'scheduleMinuteLabel'
          )}
          value={mapDefaultValue<ScheduleMinute, keyof ScheduleMinute>(
            scheduleMinuteArray,
            String(scheduleTime.thirdMinute),
            'scheduleMinuteKey',
            'scheduleMinuteLabel'
          )}
          onChange={e => getScheduleTimeMinute(e, 'thirdTimeMinute')}
          autoFocus={false}
          menuPlacement='top'
          className='react-select-container custom-menu-select z-[75] min-w-full'
          classNamePrefix='react-select'
        />
      </div>
    </div>
  )
}

export default AppMute
