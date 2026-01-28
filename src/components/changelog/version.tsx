import { i18n, TFunction } from 'i18next'
import { dateThaiFormat } from '../../constants/utils/utilsConstants'

interface VersionProps {
  t: TFunction
  i18n: i18n
}

const V2_0_13 = ({ t, i18n }: VersionProps) => (
  <div className='border-b py-3 px-2 border-base-content/10'>
    <div className='flex items-center justify-between mr-3'>
      <div className='mt-2 flex items-center gap-3'>
        <span className='font-bold'>v2.0.13</span>
        <div className='badge badge-accent font-medium px-1.5'>
          {t('changelog.badgeNew')}
        </div>
      </div>
      <span className='text-[14px] font-medium'>
        {/* เปลี่ยนวันที่เป็นวันที่ปัจจุบัน */}
        {dateThaiFormat('2026-01-28', i18n)}
      </span>
    </div>
    <div>
      <div className='ml-3'>
        <span className='font-bold text-lg'>-</span>
        {/* ต้องเพิ่ม key นี้ในไฟล์ json translation: "แก้ไขปัญหา" */}
        <span className='ml-3'>{t('changelog.v2_0_13.bugFixes')}</span>
      </div>
    </div>
  </div>
)

// เพิ่ม v2.0.7
const V2_0_7 = ({ t, i18n }: VersionProps) => (
  <div className='border-b py-3 px-2 border-base-content/10'>
    <div className='flex items-center justify-between mr-3'>
      <div className='mt-2 flex items-center gap-3'>
        <span className='font-bold'>v2.0.7</span>
      </div>
      <span className='text-[14px] font-medium'>
        {/* เปลี่ยนวันที่เป็นวันที่ปัจจุบัน */}
        {dateThaiFormat('2026-01-06', i18n)}
      </span>
    </div>
    <div>
      <div className='ml-3'>
        <span className='font-bold text-lg'>-</span>
        {/* ต้องเพิ่ม key นี้ในไฟล์ json translation: "แก้ไขปัญหา" */}
        <span className='ml-3'>{t('changelog.v2_0_7.bugFixes')}</span>
      </div>
    </div>
  </div>
)

const V2_0_6 = ({ t, i18n }: VersionProps) => (
  <div className='border-b py-3 px-2 border-base-content/10'>
    <div className='flex items-center justify-between mr-3'>
      <div className='mt-2 flex items-center gap-3'>
        <span className='font-bold'>v2.0.6</span>
      </div>
      <span className='text-[14px] font-medium'>
        {dateThaiFormat('2025-12-20', i18n)}
      </span>
    </div>
    <div>
      <div className='ml-3'>
        <span className='font-bold text-lg'>-</span>
        <span className='ml-3'>
          {t('changelog.v2_0_6.message') || 'Minor updates and fixes'}
        </span>
      </div>
    </div>
  </div>
)

// v2.0.5
const V2_0_5 = ({ t, i18n }: VersionProps) => (
  <div className='border-b py-3 px-2 border-base-content/10'>
    <div className='flex items-center justify-between mr-3'>
      <div className='mt-2 flex items-center gap-3'>
        <span className='font-bold'>v2.0.5</span>
      </div>
      <span className='text-[14px] font-medium'>
        {dateThaiFormat('2025-11-25', i18n)}
      </span>
    </div>
    <div>
      <div className='ml-3'>
        <span className='font-bold text-lg'>-</span>
        <span className='ml-3'>
          {t('changelog.v2_0_5.message') || 'Performance improvements'}
        </span>
      </div>
    </div>
  </div>
)

// v2.0.4
const V2_0_4 = ({ t, i18n }: VersionProps) => (
  <div className='border-b py-3 px-2 border-base-content/10'>
    <div className='flex items-center justify-between mr-3'>
      <div className='mt-2 flex items-center gap-3'>
        <span className='font-bold'>v2.0.4</span>
      </div>
      <span className='text-[14px] font-medium'>
        {dateThaiFormat('2025-10-30', i18n)}
      </span>
    </div>
    <div>
      <div className='ml-3'>
        <span className='font-bold text-lg'>-</span>
        <span className='ml-3'>
          {t('changelog.v2_0_4.message') || 'Bug fixes'}
        </span>
      </div>
    </div>
  </div>
)

// v2.0.3
const V2_0_3 = ({ t, i18n }: VersionProps) => (
  <div className='border-b py-3 px-2 border-base-content/10'>
    <div className='flex items-center justify-between mr-3'>
      <div className='mt-2 flex items-center gap-3'>
        <span className='font-bold'>v2.0.3</span>
      </div>
      <span className='text-[14px] font-medium'>
        {dateThaiFormat('2025-10-05', i18n)}
      </span>
    </div>
    <div>
      <div className='ml-3'>
        <span className='font-bold text-lg'>-</span>
        <span className='ml-3'>
          {t('changelog.v2_0_3.message') || 'Maintenance update'}
        </span>
      </div>
    </div>
  </div>
)

// แก้ไข v2.0.2 (เอาป้าย New ออก)
const V2_0_2 = ({ t, i18n }: VersionProps) => (
  <div className='border-b py-3 px-2 border-base-content/10'>
    <div className='flex items-center justify-between mr-3'>
      <div className='mt-2 flex items-center gap-3'>
        <span className='font-bold'>v2.0.2</span>
        {/* เอา badge new ออกจากเวอร์ชันเก่า */}
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
        <span className='font-bold'>v2.0.0</span>
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

export { V2, V2_0_1, V2_0_2, V2_0_3, V2_0_4, V2_0_5, V2_0_6, V2_0_7, V2_0_13 }
