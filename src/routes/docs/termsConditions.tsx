import { useTranslation } from 'react-i18next'
import { readingTime } from 'reading-time-estimator'
import { term } from './constants'
import { RiLinkM } from 'react-icons/ri'
import NavbarForTCPP from './navbarForTCPP'
import Footer from '../../components/footer/footer'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'

const TermsConditions = () => {
  const { t } = useTranslation()
  const { i18nInit } = useSelector((state: RootState) => state.utils)
  const result = readingTime(term, 300)
  document.title = t('terms')

  return (
    <div>
      <NavbarForTCPP />
      <div className='hidden md:flex items-center justify-end gap-1 p-3 border-b border-base-content/15'>
        <span className='text-[12px] md:text-[14px]'>
          {i18nInit === 'th'
            ? `มีผลบังคับใช้ตั้งแต่วันที่ 5 พฤศจิกายน 2024`
            : `Effective November 05, 2024`}
        </span>
        <div className='divider divider-horizontal mx-0'></div>
        <span className='text-[12px] md:text-[14px]'>
          {' '}
          {i18nInit === 'th' ? 'อ่าน 3 นาที' : result.text}
        </span>
        <div className='divider divider-horizontal mx-0'></div>
        <div
          className='flex items-center gap-1 text-[12px] md:text-[14px] cursor-pointer hover:opacity-70 duration-300 ease-out'
          onClick={() => {
            try {
              navigator.clipboard.writeText(
                'https://siamatic.co.th/terms-conditions'
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
          <p className='text-[24px] font-normal tracking-wide'>{t('terms')}</p>
        </div>
        <div className='mt-7'>
          <p className='leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `ข้อกำหนดและเงื่อนไขเหล่านี้ใช้กับแอปพลิเคชัน SMTrack (ต่อไปนี้เรียกว่า "แอปพลิเคชัน") สำหรับอุปกรณ์เคลื่อนที่ที่สร้างขึ้นโดยบริษัท SIAMATIC LIMITED (ต่อไปนี้เรียกว่า "ผู้ให้บริการ") ในรูปแบบบริการฟรี`
              : `These terms and conditions applies to the SMTrack app (hereby
            referred to as "Application") for mobile devices that was created by
            SIAMATIC COMPANY LIMITED (hereby referred to as "Service Provider")
            as a Free service.`}
          </p>
          <p className='block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `เมื่อดาวน์โหลดหรือใช้งานแอปพลิเคชัน แสดงว่าคุณตกลงตามเงื่อนไขต่อไปนี้โดยอัตโนมัติ ขอแนะนำให้คุณอ่านและทำความเข้าใจเงื่อนไขเหล่านี้ให้ละเอียดถี่ถ้วนก่อนใช้งานแอปพลิเคชัน ห้ามคัดลอก ดัดแปลงแอปพลิเคชัน ส่วนใดส่วนหนึ่งของแอปพลิเคชัน หรือเครื่องหมายการค้าของเราโดยไม่ได้รับอนุญาตโดยเด็ดขาด ห้ามพยายามดึงโค้ดต้นฉบับของแอปพลิเคชัน แปลแอปพลิเคชันเป็นภาษาอื่น หรือสร้างเวอร์ชันดัดแปลง เครื่องหมายการค้า ลิขสิทธิ์ สิทธิ์ในฐานข้อมูล และสิทธิ์ในทรัพย์สินทางปัญญาอื่นๆ ที่เกี่ยวข้องกับแอปพลิเคชันยังคงเป็นทรัพย์สินของผู้ให้บริการ`
              : `Upon downloading or utilizing the Application, you are automatically
            agreeing to the following terms. It is strongly advised that you
            thoroughly read and understand these terms prior to using the
            Application. Unauthorized copying, modification of the Application,
            any part of the Application, or our trademarks is strictly
            prohibited. Any attempts to extract the source code of the
            Application, translate the Application into other languages, or
            create derivative versions are not permitted. All trademarks,
            copyrights, database rights, and other intellectual property rights
            related to the Application remain the property of the Service
            Provider.`}
          </p>
          <p className='block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `ผู้ให้บริการมุ่งมั่นที่จะทำให้แน่ใจว่าแอปพลิเคชั่นนั้นมีประโยชน์และมีประสิทธิภาพมากที่สุด ดังนั้น ผู้ให้บริการจึงสงวนสิทธิ์ในการแก้ไขแอปพลิเคชั่นหรือเรียกเก็บเงินค่าบริการได้ตลอดเวลาและด้วยเหตุผลใดๆ ก็ตาม ผู้ให้บริการรับรองว่าจะมีการแจ้งค่าบริการสำหรับแอปพลิเคชั่นหรือบริการให้คุณทราบอย่างชัดเจน`
              : `The Service Provider is dedicated to ensuring that the Application
            is as beneficial and efficient as possible. As such, they reserve
            the right to modify the Application or charge for their services at
            any time and for any reason. The Service Provider assures you that
            any charges for the Application or its services will be clearly
            communicated to you.`}
          </p>
          <p className='block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `แอปพลิเคชันจะจัดเก็บและประมวลผลข้อมูลส่วนบุคคลที่คุณได้ให้ไว้กับผู้ให้บริการเพื่อให้บริการ คุณมีหน้าที่รับผิดชอบในการรักษาความปลอดภัยโทรศัพท์ของคุณและการเข้าถึงแอปพลิเคชัน ผู้ให้บริการขอแนะนำอย่างยิ่งว่าอย่าทำการเจลเบรกหรือรูทโทรศัพท์ของคุณ ซึ่งเกี่ยวข้องกับการลบข้อจำกัดและข้อจำกัดของซอฟต์แวร์ที่กำหนดโดยระบบปฏิบัติการอย่างเป็นทางการของอุปกรณ์ของคุณ การกระทำดังกล่าวอาจทำให้โทรศัพท์ของคุณเสี่ยงต่อมัลแวร์ ไวรัส โปรแกรมที่เป็นอันตราย ทำลายคุณสมบัติด้านความปลอดภัยของโทรศัพท์ของคุณ และอาจส่งผลให้แอปพลิเคชันไม่ทำงานอย่างถูกต้องหรือไม่ทำงานเลย โปรดทราบว่าแอปพลิเคชันใช้บริการของบุคคลที่สามซึ่งมีข้อกำหนดและเงื่อนไขของตนเอง ด้านล่างนี้คือลิงก์ไปยังข้อกำหนดและเงื่อนไขของผู้ให้บริการบุคคลที่สามที่แอปพลิเคชันใช้:`
              : `The Application stores and processes personal data that you have
            provided to the Service Provider in order to provide the Service. It
            is your responsibility to maintain the security of your phone and
            access to the Application. The Service Provider strongly advise
            against jailbreaking or rooting your phone, which involves removing
            software restrictions and limitations imposed by the official
            operating system of your device. Such actions could expose your
            phone to malware, viruses, malicious programs, compromise your
            phone's security features, and may result in the Application not
            functioning correctly or at all. Please note that the Application
            utilizes third-party services that have their own Terms and
            Conditions. Below are the links to the Terms and Conditions of the
            third-party service providers used by the Application:`}
          </p>
          <ul className='list-disc pl-5 block mt-5'>
            <li>
              <a
                href='https://policies.google.com/terms'
                target='_blank'
                className='link link-primary leading-7 tracking-wide'
              >
                {i18nInit === 'th'
                  ? `บริการ Google Play`
                  : `Google Play Services`}
              </a>
            </li>
          </ul>
          <p className='block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `โปรดทราบว่าผู้ให้บริการจะไม่รับผิดชอบต่อบางประเด็น ฟังก์ชันบางอย่างของแอปพลิเคชันต้องใช้การเชื่อมต่ออินเทอร์เน็ตที่ใช้งานได้ ซึ่งอาจเป็น Wi-Fi หรือให้บริการโดยผู้ให้บริการเครือข่ายมือถือของคุณ ผู้ให้บริการจะไม่รับผิดชอบหากแอปพลิเคชันไม่สามารถทำงานได้เต็มประสิทธิภาพเนื่องจากไม่สามารถเข้าถึง Wi-Fi หรือหากคุณใช้ข้อมูลจนหมดโควตาแล้ว`
              : `Please be aware that the Service Provider does not assume
            responsibility for certain aspects. Some functions of the
            Application require an active internet connection, which can be
            Wi-Fi or provided by your mobile network provider. The Service
            Provider cannot be held responsible if the Application does not
            function at full capacity due to lack of access to Wi-Fi or if you
            have exhausted your data allowance.`}
          </p>
          <p className='block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `หากคุณกำลังใช้แอปพลิเคชันนอกพื้นที่ Wi-Fi โปรดทราบว่าข้อตกลงของผู้ให้บริการเครือข่ายมือถือของคุณยังคงมีผลบังคับใช้ ดังนั้น คุณอาจถูกเรียกเก็บค่าบริการจากผู้ให้บริการมือถือของคุณสำหรับการใช้ข้อมูลระหว่างการเชื่อมต่อกับแอปพลิเคชันหรือค่าบริการจากบุคคลที่สามอื่นๆ เมื่อใช้แอปพลิเคชัน คุณยอมรับที่จะรับผิดชอบต่อค่าใช้จ่ายดังกล่าว รวมถึงค่าบริการโรมมิ่งข้อมูลหากคุณใช้แอปพลิเคชันนอกพื้นที่บ้านของคุณ (เช่น ภูมิภาคหรือประเทศ) โดยไม่ได้ปิดการโรมมิ่งข้อมูล หากคุณไม่ใช่ผู้ชำระเงินสำหรับอุปกรณ์ที่คุณใช้แอปพลิเคชัน พวกเขาจะถือว่าคุณได้รับอนุญาตจากผู้ชำระเงินแล้ว`
              : `If you are using the application outside of a Wi-Fi area, please be
            aware that your mobile network provider's agreement terms still
            apply. Consequently, you may incur charges from your mobile provider
            for data usage during the connection to the application, or other
            third-party charges. By using the application, you accept
            responsibility for any such charges, including roaming data charges
            if you use the application outside of your home territory (i.e.,
            region or country) without disabling data roaming. If you are not
            the bill payer for the device on which you are using the
            application, they assume that you have obtained permission from the
            bill payer.`}
          </p>
          <p className='block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `ในทำนองเดียวกัน ผู้ให้บริการไม่สามารถรับผิดชอบต่อการใช้งานแอปพลิเคชันของคุณได้เสมอไป ตัวอย่างเช่น คุณมีหน้าที่รับผิดชอบในการตรวจสอบให้แน่ใจว่าอุปกรณ์ของคุณมีแบตเตอรี่อยู่ หากอุปกรณ์ของคุณหมดแบตเตอรี่และคุณไม่สามารถเข้าถึงบริการได้ ผู้ให้บริการจะไม่สามารถรับผิดชอบได้`
              : `Similarly, the Service Provider cannot always assume responsibility
            for your usage of the application. For instance, it is your
            responsibility to ensure that your device remains charged. If your
            device runs out of battery and you are unable to access the Service,
            the Service Provider cannot be held responsible.`}
          </p>
          <p className='block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `ในแง่ของความรับผิดชอบของผู้ให้บริการสำหรับการใช้งานแอปพลิเคชันของคุณ สิ่งสำคัญคือต้องทราบว่าแม้ว่าพวกเขาจะพยายามอย่างเต็มที่เพื่อให้แน่ใจว่าข้อมูลได้รับการอัปเดตและถูกต้องตลอดเวลา แต่พวกเขาก็พึ่งพาบุคคลที่สามในการให้ข้อมูลแก่พวกเขาเพื่อให้พวกเขาสามารถนำข้อมูลนั้นมาให้คุณใช้ได้ ผู้ให้บริการจะไม่รับผิดชอบต่อการสูญเสียใดๆ ไม่ว่าทางตรงหรือทางอ้อม ที่คุณประสบอันเป็นผลจากการพึ่งพาฟังก์ชันนี้ของแอปพลิเคชันเพียงอย่างเดียว`
              : `In terms of the Service Provider's responsibility for your use of
            the application, it is important to note that while they strive to
            ensure that it is updated and accurate at all times, they do rely on
            third parties to provide information to them so that they can make
            it available to you. The Service Provider accepts no liability for
            any loss, direct or indirect, that you experience as a result of
            relying entirely on this functionality of the application.`}
          </p>
          <p className='block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `ผู้ให้บริการอาจต้องการอัปเดตแอปพลิเคชันในบางจุด แอปพลิเคชันพร้อมใช้งานในขณะนี้ตามข้อกำหนดของระบบปฏิบัติการ (และสำหรับระบบเพิ่มเติมใดๆ ที่ผู้ให้บริการตัดสินใจขยายความพร้อมใช้งานของแอปพลิเคชัน) อาจมีการเปลี่ยนแปลง และคุณจะต้องดาวน์โหลดการอัปเดตหากคุณต้องการใช้แอปพลิเคชันต่อไป ผู้ให้บริการไม่รับประกันว่าจะอัปเดตแอปพลิเคชันเสมอเพื่อให้เกี่ยวข้องกับคุณและ/หรือเข้ากันได้กับเวอร์ชันระบบปฏิบัติการเฉพาะที่ติดตั้งบนอุปกรณ์ของคุณ อย่างไรก็ตาม คุณตกลงที่จะยอมรับการอัปเดตแอปพลิเคชันเสมอเมื่อได้รับการเสนอให้คุณ ผู้ให้บริการอาจต้องการหยุดให้บริการแอปพลิเคชันและอาจยุติการใช้งานได้ตลอดเวลาโดยไม่ต้องแจ้งให้คุณทราบถึงการยกเลิก เว้นแต่ผู้ให้บริการจะแจ้งให้คุณทราบเป็นอย่างอื่น เมื่อมีการยกเลิก (ก) สิทธิ์และใบอนุญาตที่มอบให้กับคุณในข้อกำหนดเหล่านี้จะสิ้นสุดลง (ข) คุณต้องหยุดใช้แอปพลิเคชันและ (หากจำเป็น) ลบแอปพลิเคชันออกจากอุปกรณ์ของคุณ`
              : `The Service Provider may wish to update the application at some
            point. The application is currently available as per the
            requirements for the operating system (and for any additional
            systems they decide to extend the availability of the application
            to) may change, and you will need to download the updates if you
            want to continue using the application. The Service Provider does
            not guarantee that it will always update the application so that it
            is relevant to you and/or compatible with the particular operating
            system version installed on your device. However, you agree to
            always accept updates to the application when offered to you. The
            Service Provider may also wish to cease providing the application
            and may terminate its use at any time without providing termination
            notice to you. Unless they inform you otherwise, upon any
            termination, (a) the rights and licenses granted to you in these
            terms will end; (b) you must cease using the application, and (if
            necessary) delete it from your device.`}
          </p>
          <p className='text-base font-medium block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `การเปลี่ยนแปลงข้อกำหนดและเงื่อนไขเหล่านี้`
              : `Changes to These Terms and Conditions`}
          </p>
          <p className='block mt-3 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `ผู้ให้บริการอาจอัปเดตข้อกำหนดและเงื่อนไขเป็นระยะๆ ดังนั้น เราขอแนะนำให้คุณตรวจสอบหน้านี้เป็นประจำเพื่อดูว่ามีการเปลี่ยนแปลงใดๆ หรือไม่ ผู้ให้บริการจะแจ้งให้คุณทราบถึงการเปลี่ยนแปลงใดๆ โดยการโพสต์ข้อกำหนดและเงื่อนไขใหม่บนหน้านี้`
              : `The Service Provider may periodically update their Terms and
            Conditions. Therefore, you are advised to review this page regularly
            for any changes. The Service Provider will notify you of any changes
            by posting the new Terms and Conditions on this page.`}
          </p>
          <p className='block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `ข้อกำหนดและเงื่อนไขเหล่านี้จะมีผลบังคับใช้ตั้งแต่วันที่ 5 พฤศจิกายน 2567`
              : `These terms and conditions are effective as of 2024-11-05`}
          </p>
          <p className='text-base font-medium block mt-5 leading-7 tracking-wide'>
            {i18nInit === 'th' ? `ติดต่อเรา` : `Contact Us`}
          </p>
          <p className='block mt-3 leading-7 tracking-wide'>
            {i18nInit === 'th'
              ? `หากคุณมีคำถามหรือข้อเสนอแนะเกี่ยวกับข้อกำหนดและเงื่อนไข โปรดอย่าลังเลที่จะติดต่อผู้ให้บริการที่`
              : `If you have any questions or suggestions about the Terms and
            Conditions, please do not hesitate to contact the Service Provider
            at`}{' '}
            <a
              href='mailto:siamatic.thanesgroup@gmail.com'
              target='_blank'
              className='link link-primary'
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

export default TermsConditions
