import { i18n, TFunction } from 'i18next'
import { dateThaiFormat } from '../../constants/utils/utilsConstants'

interface VersionProps {
  t: TFunction
  i18n: i18n
}

const V2_0_2 = ({ t, i18n }: VersionProps) => (
  <div className='border-b py-3 px-2 border-base-content/10'>
    <div className='flex items-center justify-between mr-3'>
      <div className='mt-2 flex items-center gap-3'>
        <span className='font-bold'>v2.0.2</span>
        <div className='badge badge-accent font-medium px-1.5'>
          {t('changelog.badgeNew')}
        </div>
      </div>
      <span className='text-[14px] font-medium'>
        {dateThaiFormat('2025-09-17', i18n)}
      </span>
    </div>
    <div>
      <div className='ml-3'>
        <span className='font-bold text-lg'>-</span>
        <span className='ml-3'>{t('changelog.v2_0_2.updateDeps')}</span>
      </div>
      <div className='ml-3'>
        <span className='font-bold text-lg'>-</span>
        <span className='ml-3'>{t('changelog.v2_0_2.fixFilterWard')}</span>
      </div>
      <div className='ml-3'>
        <span className='font-bold text-lg'>-</span>
        <span className='ml-3'>{t('changelog.v2_0_2.bugFixes')}</span>
      </div>
    </div>
  </div>
)

const V2_0_1 = ({ t, i18n }: VersionProps) => (
  <div className='border-b py-3 px-2 border-base-content/10'>
    <div className='flex items-center justify-between mr-3'>
      <div className='mt-2 flex items-center gap-3'>
        <span className='font-bold'>v2.0.1</span>
      </div>
      <span className='text-[14px] font-medium'>
        {dateThaiFormat('2025-08-14', i18n)}
      </span>
    </div>
    <div>
      <div className='ml-3'>
        <span className='font-bold text-lg'>-</span>
        <span className='ml-3'>{t('changelog.v2_0_1.updateDeps')}</span>
      </div>
      <div className='ml-3'>
        <span className='font-bold text-lg'>-</span>
        <span className='ml-3'>{t('changelog.v2_0_1.fixGraphGradient')}</span>
      </div>
    </div>
  </div>
)

const V2 = ({ t, i18n }: VersionProps) => (
  <div className='border-b py-3 px-2 border-base-content/10'>
    <div className='flex items-center justify-between mr-3'>
      <div className='mt-2'>
        <span className='font-bold'>v2.0</span>
        {t('changelog.v2.titleSuffix')}
      </div>
      <span className='text-[14px] font-medium'>
        {dateThaiFormat('2025-08-01', i18n)}
      </span>
    </div>
    <div>
      <div className='ml-3'>
        <span className='font-bold text-lg'>-</span>
        <span className='ml-3'>{t('changelog.v2.rewrite')}</span>
      </div>
    </div>
  </div>
)

export { V2, V2_0_1, V2_0_2 }
