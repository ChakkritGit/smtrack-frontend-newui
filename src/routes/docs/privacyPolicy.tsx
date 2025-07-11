import { useTranslation } from 'react-i18next'
import { readingTime } from 'reading-time-estimator'
import { privacy } from './constants'
import { RiLinkM } from 'react-icons/ri'
import NavbarForTCPP from './navbarForTCPP'
import Footer from '../../components/footer/footer'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'

const PrivacyPolicy = () => {
  const { t } = useTranslation()
  const { i18nInit } = useSelector((state: RootState) => state.utils)
  const result = readingTime(privacy, 300)
  document.title = t('privacy')

  return (
    <div>
      <NavbarForTCPP />
      <div className='hidden md:flex items-center justify-end gap-1 p-3 border-b border-base-content/15'>
        <span className='text-[12px] md:text-[14px]'>
          {i18nInit === 'th'
            ? 'มีผลบังคับใช้ตั้งแต่วันที่ 4 ตุลาคม 2024'
            : 'Effective October 04, 2024'}
        </span>
        <div className='divider divider-horizontal mx-0'></div>
        <span className='text-[12px] md:text-[14px]'>
          {i18nInit === 'th' ? 'อ่านน้อยกว่าหนึ่งนาที' : result.text}
        </span>
        <div className='divider divider-horizontal mx-0'></div>
        <div
          className='flex items-center gap-1 text-[12px] md:text-[14px] cursor-pointer hover:opacity-70 duration-300 ease-out'
          onClick={() => {
            try {
              navigator.clipboard.writeText(
                'https://siamatic.co.th/privacy-policy'
              )
              toast.success(t('copyToClip'))
            } catch (error) {
              console.error('Failed to copy: ', error)
              toast.error(t('copyToClipFaile'))
            }
          }}
        >
          <RiLinkM className='text-[16px] md:text-[20px]' />
          {i18nInit === 'th' ? 'คัดลอกลิ้งค์' : 'Copy Link'}
        </div>
      </div>
      <div className='max-w-[720px] mx-auto py-7 px-5'>
        <div className='flex items-center justify-center'>
          <p className='text-[24px] font-normal tracking-wide'>
            {t('privacy')}
          </p>
        </div>
        <div className='mt-7'>
          <p className='mb-4'>
            {i18nInit === 'th'
              ? 'เราขอขอบคุณที่คุณเลือกใช้แอปของเรา ความเป็นส่วนตัวของคุณเป็นสิ่งสำคัญ เราขอชี้แจงรายละเอียดเกี่ยวกับข้อมูลที่เรารวบรวม การใช้งาน และสิทธิของคุณ ดังนี้:'
              : 'Thank you for choosing our app. Your privacy is important. This policy outlines the information we collect, how we use it, and your rights.'}
          </p>

          <h3 className='text-lg font-medium mt-6 mb-2'>
            {i18nInit === 'th'
              ? '1. ข้อมูลที่เราเก็บรวบรวม'
              : '1. Information We Collect'}
          </h3>
          <p>
            {i18nInit === 'th'
              ? 'แอปของเราจะเก็บรวบรวมข้อมูลบางประเภท เช่น:'
              : 'We collect the following types of information:'}
          </p>
          <ul className='list-disc pl-5 mt-2'>
            <li>
              {i18nInit === 'th' ? 'ชื่อผู้ใช้งาน (Username)' : 'Username'}
            </li>
            <li>
              {i18nInit === 'th'
                ? 'อีเมล หรือเบอร์โทรศัพท์'
                : 'Email or phone number'}
            </li>
            <li>{i18nInit === 'th' ? 'รหัสผ่าน' : 'Password'}</li>
            <li>
              {i18nInit === 'th'
                ? 'ภาพที่ผู้ใช้ถ่ายจากกล้อง (หากเกี่ยวข้องกับการใช้งาน)'
                : 'Photos taken via camera (if required by features)'}
            </li>
          </ul>
          <p className='mt-2'>
            <strong>{i18nInit === 'th' ? 'หมายเหตุ:' : 'Note:'}</strong>{' '}
            {i18nInit === 'th'
              ? 'แอปจะไม่เข้าถึงกล้องของคุณโดยอัตโนมัติ จะมีการร้องขอสิทธิ์ก่อนทุกครั้ง และภาพที่ถ่ายจะถูกใช้เฉพาะตามวัตถุประสงค์ที่ระบุเท่านั้น'
              : 'The app does not access your camera automatically. Permission is always requested before use, and photos are only used for specified purposes.'}
          </p>

          <h3 className='text-lg font-medium mt-6 mb-2'>
            {i18nInit === 'th'
              ? '2. วัตถุประสงค์ของการใช้ข้อมูล'
              : '2. Purpose of Data Use'}
          </h3>
          <ul className='list-disc pl-5'>
            <li>
              {i18nInit === 'th'
                ? 'การยืนยันตัวตนผู้ใช้'
                : 'User authentication'}
            </li>
            <li>
              {i18nInit === 'th'
                ? 'ให้บริการตามคำขอ เช่น การถ่ายภาพประกอบการใช้งาน, สแกน QR Code'
                : 'Providing features such as photo-taking or QR scanning'}
            </li>
            <li>
              {i18nInit === 'th'
                ? 'รักษาความปลอดภัยของบัญชี'
                : 'Account security'}
            </li>
          </ul>

          <h3 className='text-lg font-medium mt-6 mb-2'>
            {i18nInit === 'th' ? '3. การใช้กล้อง' : '3. Use of Camera'}
          </h3>
          <p>
            {i18nInit === 'th'
              ? 'แอปนี้อาจร้องขอสิทธิ์เข้าถึงกล้องของคุณเพื่อ:'
              : 'The app may request access to your camera for:'}
          </p>
          <ul className='list-disc pl-5 mt-2'>
            <li>
              {i18nInit === 'th'
                ? 'ถ่ายรูปโปรไฟล์'
                : 'Capturing profile photos'}
            </li>
            <li>
              {i18nInit === 'th'
                ? 'สแกนเอกสาร หรือ QR Code'
                : 'Scanning documents or QR codes'}
            </li>
            <li>
              {i18nInit === 'th'
                ? 'ฟีเจอร์อื่น ๆ ที่ต้องใช้ภาพถ่ายจากผู้ใช้'
                : 'Other features requiring photo input'}
            </li>
          </ul>
          <p className='mt-2'>
            <strong>
              {i18nInit === 'th'
                ? 'เราไม่ทำการบันทึกหรือเข้าถึงกล้องในเบื้องหลังโดยที่คุณไม่ทราบ'
                : 'We do not access or record your camera in the background without your knowledge.'}
            </strong>
          </p>

          <h3 className='text-lg font-medium mt-6 mb-2'>
            {i18nInit === 'th'
              ? '4. การเปิดเผยข้อมูล'
              : '4. Disclosure of Information'}
          </h3>
          <p>
            {i18nInit === 'th'
              ? 'เราจะไม่เปิดเผยข้อมูลหรือภาพถ่ายของคุณแก่บุคคลที่สาม เว้นแต่จะได้รับความยินยอม หรือจำเป็นตามกฎหมาย'
              : 'We do not share your data or photos with third parties unless required by law or with your consent.'}
          </p>

          <h3 className='text-lg font-medium mt-6 mb-2'>
            {i18nInit === 'th' ? '5. ความปลอดภัยของข้อมูล' : '5. Data Security'}
          </h3>
          <ul className='list-disc pl-5'>
            <li>
              {i18nInit === 'th'
                ? 'ใช้ HTTPS ในการส่งข้อมูลทั้งหมด'
                : 'All communications are secured with HTTPS'}
            </li>
            <li>
              {i18nInit === 'th'
                ? 'รหัสผ่านจะถูกเข้ารหัสก่อนจัดเก็บ'
                : 'Passwords are securely hashed before storage'}
            </li>
            <li>
              {i18nInit === 'th'
                ? 'ภาพจากกล้องจะไม่ถูกใช้เพื่อการอื่นนอกเหนือจากที่ระบุ'
                : 'Camera photos are only used for their stated purposes'}
            </li>
          </ul>

          <h3 className='text-lg font-medium mt-6 mb-2'>
            {i18nInit === 'th' ? '6. สิทธิของผู้ใช้' : '6. Your Rights'}
          </h3>
          <ul className='list-disc pl-5'>
            <li>
              {i18nInit === 'th'
                ? 'ขอเข้าถึง / ลบ / แก้ไขข้อมูลส่วนตัวของคุณ'
                : 'Access, delete, or modify your personal data'}
            </li>
            <li>
              {i18nInit === 'th'
                ? 'ขอปิดบัญชีหรือถอนความยินยอมได้ทุกเมื่อ'
                : 'Request account deletion or revoke consent at any time'}
            </li>
          </ul>

          <h3 className='text-lg font-medium mt-6 mb-2'>
            {i18nInit === 'th' ? '7. การติดต่อ' : '7. Contact'}
          </h3>
          <p>
            {i18nInit === 'th'
              ? 'หากคุณมีคำถามเกี่ยวกับนโยบายนี้ กรุณาติดต่อเรา:'
              : 'If you have any questions about this policy, please contact us:'}{' '}
            <a
              href='mailto:siamatic.thanesgroup@gmail.com'
              className='text-primary underline'
            >
              siamatic.thanesgroup@gmail.com
            </a>
          </p>
        </div>
      </div>
      <Footer position />
    </div>
  )
}

export default PrivacyPolicy
