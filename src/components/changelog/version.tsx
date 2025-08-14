import { TFunction } from 'i18next'

interface VersionProps {
  t: TFunction
}

const V2_0_1 = ({ t }: VersionProps) => (
  <div className='border-b py-3 px-2 border-base-content/10'>
    <div className='mt-2 flex items-center gap-3'>
      <span className='font-bold'>v2.0.1</span>
      <div className='badge badge-accent font-medium px-1.5'>
        {t('changelog.badgeNew')}
      </div>
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

const V2 = ({ t }: VersionProps) => (
  <div className='border-b py-3 px-2 border-base-content/10'>
    <div className='mt-2'>
      <span className='font-bold'>v2.0</span>
      {t('changelog.v2.titleSuffix')}
    </div>
    <div>
      <div className='ml-3'>
        <span className='font-bold text-lg'>-</span>
        <span className='ml-3'>{t('changelog.v2.rewrite')}</span>
      </div>
    </div>
  </div>
)

export { V2, V2_0_1 }
