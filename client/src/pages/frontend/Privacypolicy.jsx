import Navbar from './Navbar'
import Footer from './Footer'

const sections = [
  {
    id: 1,
    title: "1. Information We Collect",
    items: [
      '1.1 When you use our Platform or avail the Services, we seek or collect, amongst others information such as your name, mother\'s name, father\'s name, password, date of birth, gender, Permanent Account Number (PAN), signature, marital status, nominee details, cancelled cheque, photograph and video recording, email id, phone number, educational or professional qualification, business name, business address, nature of business, Goods and Services Tax Identification Number (\u201cGSTIN\u201d), Tax Deduction and Collection Account Number (TAN), bank account details, United Payments Interface (UPI) ID, and/or other payment and investment information and copies of KYC documents that helps us confirm your identity and facilitate provision of the Services through our Platform. No liability pertaining to the authenticity/genuineness of the information disclosed will lie on the Company. Further, the Company will not be in any way responsible to verify any information obtained from you.',
      "1.2 In case you are required to provide your Aadhaar details to us during account creation, you acknowledge and agree that the act of providing your Aadhaar details to us is voluntary. We require Aadhaar details solely for the purpose of carrying out KYC and for filing of ITRs.",
      "1.3 We collect mobile numbers, e-mail addresses that you provide us on the Platform and use the same for sending various communications to you.",
      "1.4 When you visit our Platform or avail the Services, we collect certain information about your interaction with our Platform including the pages that you view, your internet protocol address, the links you select or actions you take, browser type, the unique identifier of your device and device information such as operating system, operating system version, browser plug-ins, crashes, system activity, hardware settings, location based information, date and time of your request and referral URL, and cookies that may uniquely identify your browser and mobile application and the previously visited webpage.",
      '1.5 We may retrieve your information and records available with third party provider including credit score and liabilities information or information from the KYC Registration Agency, Goods and Services Tax Network (\u201cGSTN\u201d) and National Informatics Centre such as name, KYC details, KYC status, father\'s name, occupation, address details and related documents. You hereby authorise the Company to download and retrieve any information from governmental and other statutory bodies including but not limited to GSTN and NIC.',
      "1.6 When you avail the Services, we may after obtaining consent, access and read information from your device such as information from your SMS storage for providing the Services. Further, certain Services require us to obtain access to the ability to make phone calls or send messages using your device. If you choose to avail such Services, by agreeing to this Policy and Terms you are providing your express consent to permit the Company to access the calling and messaging functionalities of your device.",
      '1.7 In order to prepare your income tax return, to file your e-return, to assist on your tax matters, and/or to provide an audit defense service, we collect information about your income, deductions, credits, dependents, etc. Collectively, this information is referred as \u201cTax Return Information\u201d.',
    ],
  },
  {
    id: 2,
    title: "2. How We Use the Information",
    intro: "We do not sell or share your personal or financial information to anyone. However, notwithstanding anything contained in this Policy, you expressly acknowledge, consent and agree to the following terms on information use and further authorise us to access and use your information in the manner set out below:",
    items: [
      "a. To use your information to manage your account, to contact you and to operate, improve, and deliver our Platform and Services.",
      "b. To use your information for maintaining a record of such information and your transactions in a secure and confidential manner, and as required under the applicable laws.",
      "c. To use services of third parties to provide the Platform and Services for you, who are bound to keep such information confidential.",
      "d. To troubleshoot software bugs and operational issues, to conduct data analysis, testing and research and to monitor and analyse usage and activity trends.",
      "e. To use the data in an aggregated/compiled form to produce statistical/demographic analyses for marketing, strategy and other business purposes.",
      "f. To share your information with judicial, administrative and regulatory entities to comply with any legal and regulatory requirements.",
      "g. To summarize information about your usage and combine it with that of others to learn about the use of the Platform and Services.",
      "h. To retain copies of your completed and filed ITRs, including retrieving information from governmental and other statutory bodies including but not limited to GSTN and NIC.",
      "i. To use your information for market research, project planning, product development, troubleshoot problems, analyse user behaviour, marketing purposes, and promotions.",
      "j. To use your information to compute the charges for the products and services you purchase.",
      "k. To use the contact information to communicate with you, including sending messages, calls, and other communications for providing Services and for marketing and promotional purposes.",
      "l. To (by using your Tax Return Information) prepare and file your IT return, and provide related assistance and services.",
      "m. To use third-party advertising companies to display advertisements about goods and services of interest to you.",
      "n. To share your information with identified Strategic Partners, our third party service providers and our affiliates to host, use, copy, transmit, process, store, share, analyse, display, make derivations, and back up all data you submit to us through the Services.",
      "o. To conduct audit of your records without any notice in case of apprehension of fraud.",
      "p. To retain/store your data and confidential information in the Company's servers or cloud or otherwise in any other medium.",
    ],
    extras: [
      "2.2 You acknowledge, agree and authorise us to collect, store, process your information and further transfer and share information (including personal information) with third parties, including Securities Exchange Board of India, National Stock Exchange of India Limited, Bombay Stock Exchange, CERSAI, payment gateways, banks, KYC Registration Agencies, Asset Management Companies, Registrar and Transfer Agents, Mutual Funds, Income Tax Department etc.",
      "2.3 You acknowledge, agree and authorise our partners and entities for who we act as a technology facilitator (including BMS TAX CONSULTANCY SERVICES, having its office at 96 Vipra Vihar, Sawai Gaitor, Near Shani Mandir, Malviya Nagar, Jaipur-302017 Rajasthan) to collect, store, process, transfer your information including for the purpose of providing Services to you through the Platform.",
      "2.4 If you choose to use Services provided by our Strategic Partners or our third-party service providers through the Platform, your information may be governed by the terms of the privacy policy of such Strategic Partners and the third-party service providers.",
      "2.5 We may share/transfer/assign all of your information with any other business entities, including in the event of a merger, sale, re-organization, amalgamation, joint ventures, assignment, restructuring of business or transfer or disposition of all or any portion of our business.",
    ],
  },
  {
    id: 3,
    title: "3. ERI Services for E-Filing",
    body: "ERI Services for filing your ITR are provided by BMS TAX CONSULTANCY SERVICES through our Platform. BMS Tax Consultancy Services is an authorised ERI as per the Electronic Furnishing of Return of Income Scheme, 2007. You authorise BMS Tax Consultancy Services to request and collect your personal and other information in order to provide e-filing services to you, add you as a client of the ERI, retrieve your income tax return information using ERI services, E-File access of your ITR, access, store and process your Form-16, perform other additional functions as necessary to discharge its responsibilities as ERI.",
  },
  {
    id: 4,
    title: "4. Cookie Policy",
    body: "Like many websites, we use cookies, flash cookies, web beacons or similar technologies. \"Cookies\" are small text files that are stored on your computer or other device when you visit certain online pages that record your preferences and actions. We use cookies for a variety of purposes, including remembering you and your preferences, tracking your use of our Platform, and facilitating your use of Platform. Most web browsers automatically accept cookies, but, if you prefer, you can usually modify your browser setting to decline cookies. However, please note that refusing a cookie may limit your access and/or use of Platform and Services.",
  },
  {
    id: 5,
    title: "5. Identity Theft",
    items: [
      "5.1 There may be instances when you receive a seemingly legitimate looking e-mail asking your personal information from you such as your credit card details, bank account details, one-time passwords, contact information, etc. The Company will never ask for such information from you via e-mail.",
      "5.2 Such activities are usually carried on by unauthorized individuals and are illegal in nature. They are called phishing or identity theft. In case of any suspicion of such activity or on receiving such an e-mail you are certain it was not sent by us. We advise you to not respond to such mail and to take whatever action you see fit.",
    ],
  },
  {
    id: 6,
    title: "6. Links to Other Sites",
    body: "Our Platform provides links to other websites and third-party platforms (\"Third-Party Platforms\"). Such Third-Party Platforms may collect information about you. We are not responsible for the privacy practices or the content of those linked websites and Third-Party Platforms. We recommend you to review the privacy policies of such Third-Party Platforms. In case you choose to log-in through your Google account, we will access information from your Google accounts once they give us permission to do so whilst using the Google-related functionality of the Platform.",
  },
  {
    id: 7,
    title: "7. Data Retention by Us",
    items: [
      "7.1 We will retain your information only for as long as is necessary for the purposes set out in this Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.",
      "7.2 We encourage you to review the information and inform about any discrepancies and information found to be inaccurate shall be corrected or amended. Please reach out to us at contact@Powerfiling.com in case you would like to review the information collected by us.",
      "7.3 You shall at all times, take adequate necessary precautions, at your end, to preserve the integrity and security of your data which shall include and not be limited to your personal information.",
    ],
  },
  {
    id: 8,
    title: "8. Log Data",
    body: "We want to inform you that whenever you use our Platform or avail the Services, we collect data from your device called Log Data. This Log Data may include information such as your device's Internet Protocol (\"IP\") address, device name, operating system version, configuration of the app when utilising the Service, the time and date of your use of the Service, and other statistics.",
  },
  {
    id: 9,
    title: "9. Information Security",
    body: "We work to protect your information from loss, misuse or unauthorized alteration by using industry-recognized security safeguards, coupled with carefully developed security procedures and practices. We maintain electronic and procedural safeguards of all information. We use both internal and external resources to review our security procedures.",
  },
  {
    id: 10,
    title: "10. Disclaimer",
    items: [
      "10.1 We make no representation as to providing or storing back-up copies of any information submitted to us. You shall be solely responsible to ensure that you maintain back-up copies of such information.",
      "10.2 Although we take appropriate steps to maintain the security of information we collect from you, we assume no responsibility of whatsoever nature as to make good the losses and damages you may incur, due to privacy and/or security breach of your information.",
      "10.3 When payment information is being transmitted on or through the Platform, it will be protected by encryption technology of a third-party payment services providers, including payment gateways. The Company does not guarantee that the transmissions of your payment-related information or other information will always be secure.",
      "10.4 GSTN shall have the sole right and discretion, without any liability of any nature of the Company, to accept/reject any User's data from being transmitted to the GST system from our Platform.",
    ],
  },
  {
    id: 11,
    title: "11. Changes to This Policy",
    body: "Please note that this Policy may change from time to time. We reserve the right to modify or amend the terms of our Policy from time to time. We will endeavour to post any changes to this Policy on our webpage and, if the changes are significant, to provide a more prominent notice. Your continued use of the Platform and Services will signify your acceptance of the modified Policy.",
  },
  {
    id: 12,
    title: "12. Withdrawal of Consent by You",
    body: "You may choose to withdraw your consent provided hereunder at any point in time. Such withdrawal of consent must be sent in writing to contact@Powerfiling.com. In case you later withdraw your consent, we request you not to access the Platform and/or use the Services and also reserve the right to not provide you any Services through the Platform.",
  },
  {
    id: 13,
    title: "13. Governing Law",
    body: "This Policy is governed by all laws applicable within the territory of India. By using the Platform and Services, you are agreeing to the terms of the Policy thereby consenting to the exclusive jurisdiction and venue of courts in Jaipur, India, in all disputes arising out of or relating to the use of the Platform or this Policy.",
  },
];

const Privacypolicy = () => {
  return (
    <>
      <Navbar />

      <main className="bg-slate-50 min-h-screen">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-14 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              Legal
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Privacy Policy</h1>
            {/* <p className="text-slate-300 text-sm">Last Updated: January 1, 2025</p> */}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

          {/* Intro */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
            <p className="text-slate-700 leading-relaxed mb-4">
              We place the highest importance on respecting and protecting your privacy. Our relationship with you is our most important asset. We want you to feel comfortable and confident when using our Platform and Services.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              This Privacy Policy (the <strong>"Policy"</strong>) applies to the use of or access to the website <strong>www.Powerfiling.com</strong> and on its mobile/web applications (hereinafter, collectively referred to as the <strong>"Platform"</strong>), by the User (hereinafter <strong>"you"</strong> or <strong>"your"</strong>).
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              The Platform is provided by <strong>BMS Tax Consultancy Services</strong> (hereinafter <strong>"Firm"</strong> or <strong>"our"</strong> or <strong>"we"</strong> or <strong>"us"</strong>), a Partnership firm incorporated under the Indian Partnership Act 1932, having its registered office at 96 Vipra Vihar, Sawai Gaitor, Near Shani Mandir, Malviya Nagar, Jaipur-302017, Rajasthan.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              This Policy is published in accordance with the provisions of Rule 3(1)(a) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and Rule 4 of the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal data or Information) Rules, 2011 framed under the Information Technology Act, 2000.
            </p>
            <p className="text-slate-700 leading-relaxed">
              By using the Platform or availing the Services, you agree to this Policy. If you do not agree to the terms of this Policy, please do not use our Platform and Services.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
                  {section.title}
                </h2>

                {section.intro && (
                  <p className="text-slate-700 leading-relaxed mb-4">{section.intro}</p>
                )}

                {section.body && (
                  <p className="text-slate-700 leading-relaxed">{section.body}</p>
                )}

                {section.items && (
                  <ul className="space-y-3">
                    {section.items.map((item, i) => (
                      <li key={i} className="text-slate-700 leading-relaxed text-sm pl-4 border-l-2 border-blue-100">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.extras && (
                  <div className="mt-4 space-y-3">
                    {section.extras.map((extra, i) => (
                      <p key={i} className="text-slate-700 leading-relaxed text-sm">
                        {extra}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact / Grievance Officer */}
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl border border-blue-100 p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-2">14. Contact Us</h2>
            <p className="text-slate-600 text-sm mb-6">
              If there are any questions or grievances regarding this Policy or the safety of your information, you may contact us at the address given below.
            </p>
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
              <p className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">Grievance Officer</p>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-700">
                <div>
                  <span className="font-medium text-slate-500 block mb-0.5">Name</span>
                  Shubham Kumar Sharma
                </div>
                <div>
                  <span className="font-medium text-slate-500 block mb-0.5">Email</span>
                  <a href="mailto:shubhambeing12@gmail.com" className="text-blue-600 hover:underline">
                    shubhambeing12@gmail.com
                  </a>
                </div>
                <div className="sm:col-span-2">
                  <span className="font-medium text-slate-500 block mb-0.5">Address</span>
                  96 Vipra Vihar, Sawai Gaitor, Near Shani Mandir, Malviya Nagar, Jaipur, Rajasthan — PIN: 302017
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}

export default Privacypolicy
