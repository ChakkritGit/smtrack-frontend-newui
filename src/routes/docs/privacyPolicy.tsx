import { useTranslation } from 'react-i18next'
import { readingTime } from 'reading-time-estimator'
import { privacy } from '../../components/docs/constants'
import { RiLinkM } from 'react-icons/ri'
import NavbarForTCPP from '../../components/docs/navbarForTCPP'
import Footer from '../../components/footer/footer'
import toast from 'react-hot-toast'

const PrivacyPolicy = () => {
  const { t } = useTranslation()
  const result = readingTime(privacy, 300)

  return (
    <div>
      <NavbarForTCPP />
      <div className='flex items-center justify-end gap-1 p-3 border-b border-base-content/10 shadow-sm'>
        <span className='text-[12px] md:text-[14px]'>
          Effective October 04, 2024
        </span>
        <div className='divider divider-horizontal mx-0'></div>
        <span className='text-[12px] md:text-[14px]'>{result.text}</span>
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
          Copy Link
        </div>
      </div>
      <div className='max-w-[720px] mx-auto py-14 px-5'>
        <div className='flex items-center justify-center'>
          <p className='text-[24px] font-normal tracking-wide'>
            Privacy & Policy
          </p>
        </div>
        <div className='mt-7'>
          <p className='text-base font-bold leading-7 tracking-wide'>
            Privacy Policy
          </p>
          <p className='block mt-2 leading-7 tracking-wide'>
            This privacy policy applies to the SMTrack+ app (hereby referred to
            as "Application") for mobile devices that was created by SIAMATIC
            COMPANY LIMITED (hereby referred to as "Service Provider") as a Free
            service. This service is intended for use "AS IS".
          </p>
          <p className='text-base font-bold block mt-5 leading-7 tracking-wide'>
            Information Collection and Use
          </p>
          <p className='block mt-2 leading-7 tracking-wide'>
            he Application collects information when you download and use it.
            This information may include information such as
          </p>
          <ul className='list-disc pl-5 block mt-5 leading-7 tracking-wide'>
            <li>Your device's Internet Protocol address (e.g. IP address)</li>
            <li>
              The pages of the Application that you visit, the time and date of
              your visit, the time spent on those pages
            </li>
            <li>The time spent on the Application</li>
            <li>The operating system you use on your mobile device</li>
          </ul>
          <p className='block mt-5 leading-7 tracking-wide'>
            The Application does not gather precise information about the
            location of your mobile device. The Service Provider may use the
            information you provided to contact you from time to time to provide
            you with important information, required notices and marketing
            promotions. For a better experience, while using the Application,
            the Service Provider may require you to provide us with certain
            personally identifiable information. The information that the
            Service Provider request will be retained by them and used as
            described in this privacy policy.
          </p>
          <p className='text-base font-bold block mt-5 leading-7 tracking-wide'>
            Third Party Access
          </p>
          <p className='block mt-2 leading-7 tracking-wide'>
            Only aggregated, anonymized data is periodically transmitted to
            external services to aid the Service Provider in improving the
            Application and their service. The Service Provider may share your
            information with third parties in the ways that are described in
            this privacy statement.
          </p>
          <p className='block mt-5 leading-7 tracking-wide'>
            Please note that the Application utilizes third-party services that
            have their own Privacy Policy about handling data. Below are the
            links to the Privacy Policy of the third-party service providers
            used by the Application:
          </p>
          <ul className='list-disc pl-5 block mt-5 leading-7 tracking-wide'>
            <li>
              Google Play Services The Service Provider may disclose User
              Provided and Automatically Collected Information:
            </li>
            <li>
              as required by law, such as to comply with a subpoena, or similar
              legal process;
            </li>
            <li>
              when they believe in good faith that disclosure is necessary to
              protect their rights, protect your safety or the safety of others,
              investigate fraud, or respond to a government request;
            </li>
            <li>
              with their trusted services providers who work on their behalf, do
              not have an independent use of the information we disclose to
              them, and have agreed to adhere to the rules set forth in this
              privacy statement.
            </li>
          </ul>
          <p className='text-base font-bold block mt-5 leading-7 tracking-wide'>
            Opt-Out Rights
          </p>
          <p className='block mt-2 leading-7 tracking-wide'>
            You can stop all collection of information by the Application easily
            by uninstalling it. You may use the standard uninstall processes as
            may be available as part of your mobile device or via the mobile
            application marketplace or network.
          </p>
          <p className='text-base font-bold block mt-5 leading-7 tracking-wide'>
            Data Retention Policy
          </p>
          <p className='block mt-2 leading-7 tracking-wide'>
            The Service Provider will retain User Provided data for as long as
            you use the Application and for a reasonable time thereafter. If
            you'd like them to delete User Provided Data that you have provided
            via the Application, please contact them at
            siamatic.thanesgroup@gmail.com and they will respond in a reasonable
            time.
          </p>
          <p className='text-base font-bold block mt-5 leading-7 tracking-wide'>
            Children
          </p>
          <p className='block mt-2 leading-7 tracking-wide'>
            The Service Provider does not use the Application to knowingly
            solicit data from or market to children under the age of 13.
          </p>
          <p className='block mt-5 leading-7 tracking-wide'>
            The Application does not address anyone under the age of 13. The
            Service Provider does not knowingly collect personally identifiable
            information from children under 13 years of age. In the case the
            Service Provider discover that a child under 13 has provided
            personal information, the Service Provider will immediately delete
            this from their servers. If you are a parent or guardian and you are
            aware that your child has provided us with personal information,
            please contact the Service Provider (siamatic.thanesgroup@gmail.com)
            so that they will be able to take the necessary actions.
          </p>
          <p className='text-base font-bold block mt-5 leading-7 tracking-wide'>
            Security
          </p>
          <p className='block mt-2 leading-7 tracking-wide'>
            The Service Provider is concerned about safeguarding the
            confidentiality of your information. The Service Provider provides
            physical, electronic, and procedural safeguards to protect
            information the Service Provider processes and maintains.
          </p>
          <p className='text-base font-bold block mt-5 leading-7 tracking-wide'>
            Changes
          </p>
          <p className='block mt-2 leading-7 tracking-wide'>
            This Privacy Policy may be updated from time to time for any reason.
            The Service Provider will notify you of any changes to the Privacy
            Policy by updating this page with the new Privacy Policy. You are
            advised to consult this Privacy Policy regularly for any changes, as
            continued use is deemed approval of all changes.
          </p>
          <p className='block mt-5 leading-7 tracking-wide'>
            This privacy policy is effective as of 2024-10-04
          </p>
          <p className='text-base font-bold block mt-5 leading-7 tracking-wide'>
            Your Consent
          </p>
          <p className='block mt-2 leading-7 tracking-wide'>
            By using the Application, you are consenting to the processing of
            your information as set forth in this Privacy Policy now and as
            amended by us.
          </p>
          <p className='text-base font-bold block mt-5 leading-7 tracking-wide'>
            Contact Us
          </p>
          <p className='block mt-2 leading-7 tracking-wide'>
            If you have any questions regarding privacy while using the
            Application, or have questions about the practices, please contact
            the Service Provider via email at siamatic.thanesgroup@gmail.com.
          </p>
        </div>
      </div>
      <Footer position />
    </div>
  )
}

export default PrivacyPolicy
