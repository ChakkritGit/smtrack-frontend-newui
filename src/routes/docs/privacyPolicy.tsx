import { useTranslation } from 'react-i18next'
import { readingTime } from 'reading-time-estimator'
import { privacy } from '../../components/docs/constants'
import { RiLinkM } from 'react-icons/ri'
import NavbarForTCPP from '../../components/docs/navbarForTCPP'
import Footer from '../../components/footer/footer'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'

const PrivacyPolicy = () => {
  const { t } = useTranslation()
  const { i18nInit } = useSelector((state: RootState) => state.utils)
  const result = readingTime(privacy, 300)

  return (
    <div>
      <NavbarForTCPP />
      <div className='flex items-center justify-end gap-1 p-3 border-b border-base-content/15'>
        <span className='text-[12px] md:text-[14px]'>
          {i18nInit === 'th'
            ? 'มีผลบังคับใช้ตั้งแต่วันที่ 4 ตุลาคม 2024'
            : 'Effective October 04, 2024'}
        </span>
        <div className='divider divider-horizontal mx-0'></div>
        <span className='text-[12px] md:text-[14px]'>
          {i18nInit === 'th' ? 'อ่าน 2 นาที' : result.text}
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
      <div className='max-w-[720px] mx-auto py-14 px-5'>
        <div className='flex items-center justify-center'>
          <p className='text-[24px] font-normal tracking-wide'>
            {t('privacy')}
          </p>
        </div>
        <div className='mt-7'>
          <p className='text-base font-medium leading-7 tracking-wide'>
            {i18nInit === 'th' ? 'นโยบายความเป็นส่วนตัว' : 'Privacy Policy'}
          </p>
          <p className='block mt-2 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `นโยบายความเป็นส่วนตัวนี้ใช้กับแอปพลิเคชัน SMTrack+ (ต่อไปนี้เรียกว่า "แอปพลิเคชัน") สำหรับอุปกรณ์เคลื่อนที่ที่สร้างขึ้นโดยบริษัท SIAMATIC COMPANY LIMITED (ต่อไปนี้เรียกว่า "ผู้ให้บริการ") ในฐานะบริการฟรี บริการนี้มีวัตถุประสงค์เพื่อใช้ "ตามที่เป็น"`
              : `This privacy policy applies to the SMTrack+ app (hereby referred to
            as "Application") for mobile devices that was created by SIAMATIC
            COMPANY LIMITED (hereby referred to as "Service Provider") as a Free
            service. This service is intended for use "AS IS".`}
          </p>
          <p className='text-base font-medium block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? 'การรวบรวมและการใช้ข้อมูล'
              : 'Information Collection and Use'}
          </p>
          <p className='block mt-2 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `แอปพลิเคชันจะรวบรวมข้อมูลเมื่อคุณดาวน์โหลดและใช้งาน ข้อมูลนี้อาจรวมถึงข้อมูล เช่น`
              : `he Application collects information when you download and use it.
            This information may include information such as`}
          </p>
          <ul className='list-disc pl-5 block mt-5 leading-7 tracking-wide'>
            <li>
              {i18nInit === 'th'
                ? `ที่อยู่โปรโตคอลอินเทอร์เน็ตของอุปกรณ์ของคุณ (เช่น ที่อยู่ IP)`
                : `Your device's Internet Protocol address (e.g. IP address)`}
            </li>
            <li>
              {i18nInit === 'th'
                ? `หน้าแอปพลิเคชันที่คุณเยี่ยมชม เวลาและวันที่คุณเยี่ยมชม เวลาที่ใช้ในหน้าเหล่านั้น`
                : `The pages of the Application that you visit, the time and date of
              your visit, the time spent on those pages`}
            </li>
            <li>
              {i18nInit === 'th'
                ? `เวลาที่ใช้ในแอปพลิเคชัน`
                : `The time spent on the Application`}
            </li>
            <li>
              {i18nInit === 'th'
                ? `ระบบปฏิบัติการที่คุณใช้บนอุปกรณ์มือถือของคุณ`
                : `The operating system you use on your mobile device`}
            </li>
          </ul>
          <p className='block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `แอปพลิเคชันไม่รวบรวมข้อมูลที่ชัดเจนเกี่ยวกับตำแหน่งของอุปกรณ์มือถือของคุณ ผู้ให้บริการอาจใช้ข้อมูลที่คุณให้ไว้เพื่อติดต่อคุณเป็นครั้งคราวเพื่อแจ้งข้อมูลสำคัญ ประกาศที่จำเป็น และโปรโมชั่นทางการตลาดให้คุณทราบ เพื่อประสบการณ์ที่ดีขึ้น ขณะใช้แอปพลิเคชัน ผู้ให้บริการอาจขอให้คุณให้ข้อมูลส่วนบุคคลบางอย่างแก่เรา ข้อมูลที่ผู้ให้บริการร้องขอจะถูกเก็บไว้โดยผู้ให้บริการและใช้ตามที่อธิบายไว้ในนโยบายความเป็นส่วนตัวนี้`
              : `The Application does not gather precise information about the
            location of your mobile device. The Service Provider may use the
            information you provided to contact you from time to time to provide
            you with important information, required notices and marketing
            promotions. For a better experience, while using the Application,
            the Service Provider may require you to provide us with certain
            personally identifiable information. The information that the
            Service Provider request will be retained by them and used as
            described in this privacy policy.`}
          </p>
          <p className='text-base font-medium block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `การเข้าถึงของบุคคลที่สาม`
              : `Third Party Access`}
          </p>
          <p className='block mt-2 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `เฉพาะข้อมูลรวมที่ไม่ระบุตัวตนเท่านั้นที่จะถูกส่งไปยังบริการภายนอกเป็นระยะๆ เพื่อช่วยให้ผู้ให้บริการปรับปรุงแอปพลิเคชันและบริการของตนได้ ผู้ให้บริการอาจแบ่งปันข้อมูลของคุณกับบุคคลที่สามในลักษณะที่อธิบายไว้ในคำชี้แจงความเป็นส่วนตัวนี้`
              : `Only aggregated, anonymized data is periodically transmitted to
            external services to aid the Service Provider in improving the
            Application and their service. The Service Provider may share your
            information with third parties in the ways that are described in
            this privacy statement.`}
          </p>
          <p className='block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `โปรดทราบว่าแอปพลิเคชันใช้บริการของบุคคลที่สามซึ่งมีนโยบายความเป็นส่วนตัวของตนเองเกี่ยวกับการจัดการข้อมูล ด้านล่างนี้คือลิงก์ไปยังนโยบายความเป็นส่วนตัวของผู้ให้บริการบุคคลที่สามที่แอปพลิเคชันใช้:`
              : `Please note that the Application utilizes third-party services that
            have their own Privacy Policy about handling data. Below are the
            links to the Privacy Policy of the third-party service providers
            used by the Application.`}
          </p>
          <ul className='list-disc pl-5 block mt-5 leading-7 tracking-wide'>
            <li>
              {i18nInit === 'th'
                ? `บริการ Google Play ผู้ให้บริการอาจเปิดเผยข้อมูลที่ผู้ใช้ให้มาและรวบรวมโดยอัตโนมัติ:`
                : `Google Play Services The Service Provider may disclose User
              Provided and Automatically Collected Information.`}
            </li>
            <li>
              {i18nInit === 'th'
                ? `ตามที่กฎหมายกำหนด เช่น การปฏิบัติตามหมายเรียก หรือกระบวนการทางกฎหมายที่คล้ายคลึงกัน`
                : `as required by law, such as to comply with a subpoena, or similar
              legal process.`}
            </li>
            <li>
              {i18nInit === 'th'
                ? `เมื่อพวกเขาเชื่อโดยสุจริตใจว่าการเปิดเผยเป็นสิ่งจำเป็นเพื่อปกป้องสิทธิของพวกเขา ปกป้องความปลอดภัยของคุณหรือความปลอดภัยของผู้อื่น สืบสวนการฉ้อโกง หรือตอบสนองต่อคำขอของรัฐบาล`
                : `when they believe in good faith that disclosure is necessary to
              protect their rights, protect your safety or the safety of others,
              investigate fraud, or respond to a government request.`}
            </li>
            <li>
              {i18nInit === 'th'
                ? `กับผู้ให้บริการที่เชื่อถือได้ซึ่งทำงานในนามของพวกเขา จะไม่สามารถใช้ข้อมูลที่เราเปิดเผยให้พวกเขาได้อย่างอิสระ และตกลงที่จะปฏิบัติตามกฎที่กำหนดไว้ในแถลงการณ์ความเป็นส่วนตัวนี้`
                : `with their trusted services providers who work on their behalf, do
              not have an independent use of the information we disclose to
              them, and have agreed to adhere to the rules set forth in this
              privacy statement.`}
            </li>
          </ul>
          <p className='text-base font-medium block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th' ? `สิทธิ์ในการไม่เข้าร่วม` : `Opt-Out Rights`}
          </p>
          <p className='block mt-2 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `คุณสามารถหยุดการรวบรวมข้อมูลทั้งหมดโดยแอปพลิเคชันได้อย่างง่ายดายโดยการถอนการติดตั้ง คุณสามารถใช้กระบวนการถอนการติดตั้งมาตรฐานที่มีให้เป็นส่วนหนึ่งของอุปกรณ์เคลื่อนที่ของคุณหรือผ่านทางตลาดแอปพลิเคชันมือถือหรือเครือข่าย`
              : `You can stop all collection of information by the Application easily
            by uninstalling it. You may use the standard uninstall processes as
            may be available as part of your mobile device or via the mobile
            application marketplace or network.`}
          </p>
          <p className='text-base font-medium block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `นโยบายการเก็บรักษาข้อมูล`
              : `Data Retention Policy`}
          </p>
          <p className='block mt-2 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `ผู้ให้บริการจะเก็บรักษาข้อมูลที่ผู้ใช้ให้ไว้ตราบเท่าที่คุณใช้แอปพลิเคชันและเป็นระยะเวลาที่เหมาะสมหลังจากนั้น หากคุณต้องการให้ผู้ให้บริการลบข้อมูลที่ผู้ใช้ให้ไว้ที่คุณให้ไว้ผ่านแอปพลิเคชัน โปรดติดต่อที่ `
              : `The Service Provider will retain User Provided data for as long as
            you use the Application and for a reasonable time thereafter. If
            you'd like them to delete User Provided Data that you have provided
            via the Application, please contact them at`}{' '}
            <a
              href='mailto:siamatic.thanesgroup@gmail.com'
              target='_blank'
              className='link link-primary'
            >
              siamatic.thanesgroup@gmail.com
            </a>{' '}
            {i18nInit === 'th'
              ? `และผู้ให้บริการจะตอบกลับภายในระยะเวลาที่เหมาะสม`
              : `and they will respond in a reasonable time.`}
          </p>
          <p className='text-base font-medium block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th' ? `เด็กและเยาวชน` : `Children`}
          </p>
          <p className='block mt-2 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `ผู้ให้บริการจะไม่ใช้แอปพลิเคชันเพื่อขอข้อมูลหรือทำการตลาดกับเด็กอายุต่ำกว่า 13 ปีโดยเจตนา`
              : `The Service Provider does not use the Application to knowingly
            solicit data from or market to children under the age of 13.`}
          </p>
          <p className='block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `แอปพลิเคชันนี้ไม่ได้มุ่งเป้าไปที่ผู้ที่มีอายุต่ำกว่า 13 ปี ผู้ให้บริการจะไม่รวบรวมข้อมูลส่วนตัวที่สามารถระบุตัวตนได้จากเด็กอายุต่ำกว่า 13 ปีโดยเจตนา ในกรณีที่ผู้ให้บริการพบว่าเด็กอายุต่ำกว่า 13 ปีได้ให้ข้อมูลส่วนบุคคล ผู้ให้บริการจะลบข้อมูลดังกล่าวออกจากเซิร์ฟเวอร์ทันที หากคุณเป็นผู้ปกครองหรือผู้ดูแล และคุณทราบว่าบุตรหลานของคุณได้ให้ข้อมูลส่วนบุคคลแก่เรา โปรดติดต่อผู้ให้บริการ`
              : `The Application does not address anyone under the age of 13. The
            Service Provider does not knowingly collect personally identifiable
            information from children under 13 years of age. In the case the
            Service Provider discover that a child under 13 has provided
            personal information, the Service Provider will immediately delete
            this from their servers. If you are a parent or guardian and you are
            aware that your child has provided us with personal information,
            please contact the Service Provider`}{' '}
            (
            <a
              href='mailto:siamatic.thanesgroup@gmail.com'
              target='_blank'
              className='link link-primary'
            >
              siamatic.thanesgroup@gmail.com
            </a>
            ){' '}
            {i18nInit === 'th'
              ? `เพื่อให้พวกเขาสามารถดำเนินการที่จำเป็นได้`
              : `so that they will be able to take the necessary actions.`}
          </p>
          <p className='text-base font-medium block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th' ? 'ความปลอดภัย' : 'Security'}
          </p>
          <p className='block mt-2 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `ผู้ให้บริการมีความกังวลเกี่ยวกับการปกป้องความลับของข้อมูลของคุณ ผู้ให้บริการจัดให้มีการป้องกันทางกายภาพ อิเล็กทรอนิกส์ และตามขั้นตอน เพื่อปกป้องข้อมูลที่ผู้ให้บริการประมวลผลและบำรุงรักษา`
              : `The Service Provider is concerned about safeguarding the
            confidentiality of your information. The Service Provider provides
            physical, electronic, and procedural safeguards to protect
            information the Service Provider processes and maintains.`}
          </p>
          <p className='text-base font-medium block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th' ? 'การเปลี่ยนแปลง' : 'Changes'}
          </p>
          <p className='block mt-2 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `นโยบายความเป็นส่วนตัวนี้อาจได้รับการอัปเดตเป็นครั้งคราวด้วยเหตุผลใดก็ตาม ผู้ให้บริการจะแจ้งให้คุณทราบถึงการเปลี่ยนแปลงใดๆ ของนโยบายความเป็นส่วนตัวโดยการอัปเดตหน้านี้ด้วยนโยบายความเป็นส่วนตัวฉบับใหม่ ขอแนะนำให้คุณตรวจสอบนโยบายความเป็นส่วนตัวนี้เป็นประจำสำหรับการเปลี่ยนแปลงใดๆ เนื่องจากการใช้งานต่อเนื่องจะถือว่าการอนุมัติการเปลี่ยนแปลงทั้งหมด`
              : `This Privacy Policy may be updated from time to time for any reason.
            The Service Provider will notify you of any changes to the Privacy
            Policy by updating this page with the new Privacy Policy. You are
            advised to consult this Privacy Policy regularly for any changes, as
            continued use is deemed approval of all changes.`}
          </p>
          <p className='block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `นโยบายความเป็นส่วนตัวนี้มีผลใช้บังคับตั้งแต่วันที่ 4 ตุลาคม 2567`
              : `This privacy policy is effective as of 2024-10-04`}
          </p>
          <p className='text-base font-medium block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th' ? `ความยินยอมของคุณ` : `Your Consent`}
          </p>
          <p className='block mt-2 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `การใช้งานแอปพลิเคชันถือว่าคุณยินยอมให้มีการประมวลผลข้อมูลของคุณตามที่ระบุไว้ในนโยบายความเป็นส่วนตัวฉบับนี้และตามที่เราแก้ไขเพิ่มเติม`
              : `By using the Application, you are consenting to the processing of
            your information as set forth in this Privacy Policy now and as
            amended by us.`}
          </p>
          <p className='text-base font-medium block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th' ? `ติดต่อเรา` : `Contact Us`}
          </p>
          <p className='block mt-2 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `หากคุณมีคำถามใด ๆ เกี่ยวกับความเป็นส่วนตัวในระหว่างใช้แอปพลิเคชั่นหรือมีคำถามเกี่ยวกับแนวทางปฏิบัติ โปรดติดต่อผู้ให้บริการทางอีเมลที่`
              : `If you have any questions regarding privacy while using the
            Application, or have questions about the practices, please contact
            the Service Provider via email at`}{' '}
            <a
              href='mailto:siamatic.thanesgroup@gmail.com'
              target='_blank'
              className='link link-primary'
            >
              siamatic.thanesgroup@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
      <Footer position />
    </div>
  )
}

export default PrivacyPolicy
