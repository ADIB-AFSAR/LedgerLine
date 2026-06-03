import Navbar from '../frontend/Navbar'
import Footer from '../frontend/Footer'

const Security = () => {
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
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Security & Terms of Use</h1>
            <p className="text-slate-300 text-sm">Last Updated: January 1, 2025</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">

          {/* Section 1 - General */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-slate-900 pb-3 mb-5 border-b border-slate-100">
              1. General
            </h2>
            <ul className="space-y-3">
              {[
                "This document is an electronic record in terms of the Information Technology Act, 2000 and rules thereunder as applicable and the amended provisions about electronic records in various statutes as amended by the Information Technology Act, 2000. A computer system generates this electronic record and requires no physical or digital signatures.",
                "This document is published in accordance with the provisions of Rule 3(1) of the Information Technology (Intermediaries guidelines) Rules, 2011 that require publishing the rules and regulations, privacy policy and Terms of Use for access or usage.",
                "The domain name www.Powerfiling.com (\"Website\") is owned and operated by Powerfiling Private Limited (\"Company\"), incorporated under the provisions of the Indian Companies Act 2013, and having its registered office at FF25, JAIPUR TEXTILE MARKET, Jagatpura, Jaipur, Rajasthan, India, 302017.",
                "For this Policy, wherever the context so requires: (i) The term 'You' & 'User' shall mean any legal person or entity accessing or using the services provided on this Website, who is competent to enter into binding contracts, as per the provisions of the Indian Contract Act, 1872; (ii) The terms 'We', 'Us' & 'Our' shall mean the Website and/or the Company, as the context so requires; (iii) The terms 'Party' & 'Parties' shall respectively be used to refer to the User and the Company individually and collectively, as the context so requires.",
                "The headings of each section in this Policy are only for the purpose of organising the various provisions under this Policy in an orderly manner, and shall not be used by either Party to interpret the provisions contained herein in any manner.",
                "The use of the Website by the User is solely governed by this Policy as well as the Terms of Use of the Website (available at www.Powerfiling.com), and any modifications or amendments made thereto by the Company from time to time, at its sole discretion.",
                "The User unequivocally agrees that this Policy and the aforementioned Terms constitute a legally binding agreement between the User and the Company.",
                "The Parties expressly agree that the Company retains the sole and exclusive right to amend or modify the Policy and the aforementioned Terms without any prior permission or intimation to the User.",
              ].map((point, i) => (
                <li key={i} className="flex gap-3 text-slate-700 text-sm leading-relaxed">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2 - Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-slate-900 pb-3 mb-5 border-b border-slate-100">
              2. Collection of Personal and Other Information
            </h2>
            <ul className="space-y-3">
              {[
                "The User expressly agrees and acknowledges that the company collects and stores the User's personal information, which is provided by the User from time to time on the Website, including but not limited to username, passwords, email address, name, address, age, date of birth, sex, nationality, shopping preferences, browsing history, etc., as well as any images or other information uploaded/published by the User on the Website.",
                "The User is aware that the company/Website may automatically track certain information about the User based upon the User's IP address and the User's behaviour on the Website, and the User expressly consents to the same.",
                "If the User chooses to purchase products/services from the Website, the User consents to allowing the company/Website to collect information about the User's buying behaviour and trends.",
                "If the User chooses to post messages/reviews/feedback anywhere on the Website, the User is aware that any such information provided/uploaded will be collected and stored by the company indefinitely.",
                "The User is aware that any information about the User collected by the company may be collected and compiled by the company/Website into a file/folder specifically created for the User.",
                "The User is aware that while he/she can browse some sections of the Website without being a registered user, certain activities (such as placing an order) require the User to provide valid personal information to the company/Website for registration.",
                "The User is aware that the company/Website may occasionally request the User to complete optional online surveys requiring contact information and demographic information.",
                "The User is further aware that the company/Website may occasionally request the User to write reviews for products/services purchased/availed of by the User from the Website.",
                "Nothing contained herein shall be deemed to compel the Website/company to store, upload, publish, or display in any manner content/reviews/surveys/feedback submitted by the User.",
                "As you access and use our services, we collect certain information from you, including but not limited to phone number, email address, device make and model details, and IP address. By accessing and using our services, you expressly consent to the sharing and disclosure of your information so collected with our third-party service providers, business partners, and agents.",
              ].map((point, i) => (
                <li key={i} className="flex gap-3 text-slate-700 text-sm leading-relaxed">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3 - Cookies */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-slate-900 pb-3 mb-5 border-b border-slate-100">
              3. Cookies
            </h2>
            <ul className="space-y-3">
              {[
                "The User is aware that a 'Cookie' is a small piece of information stored by a web server on a web browser so it can later be traced back from that particular browser, and that cookies are useful for enabling the browser to remember information specific to a given user, including but not limited to a User's login identification, password, etc.",
                "The User is further aware that the Website uses data collection devices such as cookies on certain pages of the Website to help analyse web page flow, measure promotional effectiveness, and promote trust and safety.",
                "Additionally, the User is aware that he/she might encounter cookies or other similar devices on certain pages of the Website that are placed by third parties or affiliates of the Company/Website.",
                "A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added, and the cookie helps analyse web traffic or lets you know when you visit a particular site.",
                "Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.",
                "Overall, cookies help us provide you with a better website by enabling us to monitor which pages you find useful and which you do not.",
                "You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer.",
              ].map((point, i) => (
                <li key={i} className="flex gap-3 text-slate-700 text-sm leading-relaxed">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Links to Other Websites */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-slate-900 pb-3 mb-5 border-b border-slate-100">
              Links to Other Websites
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed">
              Our website may contain links to other websites of interest. However, once you have used these links to leave our site, you should note that we do not have any control over that other website. Therefore, we cannot be responsible for the protection and privacy of any information which you provide whilst visiting such sites and such sites are not governed by this privacy statement. You should exercise caution and look at the privacy statement applicable to the website in question.
            </p>
          </div>

          {/* Section 4 - Divulging/Sharing */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-slate-900 pb-3 mb-5 border-b border-slate-100">
              4. Divulging/Sharing of Personal Information
            </h2>
            <ul className="space-y-3">
              {[
                "The User is aware that the Website/Company may share the User's personal information with other corporate entities and affiliates to help detect and prevent identity theft, fraud and other potentially illegal acts.",
                "The User is aware that the Website/Company may disclose personal information if required to do so by law or if the Website/Company in good faith believes that such disclosure is reasonably necessary to respond to subpoenas, court orders, or other legal processes.",
                "The User is further aware that the Website/Company and its affiliates may share/sell some or all of the User's personal information with other business entities should the Company/Website plan to merge with, or be acquired by such business entity, or in the event of re-organisation, amalgamation, or restructuring of the Company's business.",
              ].map((point, i) => (
                <li key={i} className="flex gap-3 text-slate-700 text-sm leading-relaxed">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Section 5 - Security */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-slate-900 pb-3 mb-5 border-b border-slate-100">
              5. Security
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed">
              Transactions on the Website are secure and protected. Any information entered by the User when transacting on the Website is encrypted to protect the User against unintentional disclosure to third parties. The User's credit and debit card information is not received, stored by or retained by the Company/Website in any manner. This information is supplied by the User directly to the relevant payment gateway, which is authorised to handle the information provided, and is compliant with the regulations and requirements of various banks and institutions and payment franchisees with which it is associated.
            </p>
          </div>

          {/* Section 6 - Third Party Advertisements */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-slate-900 pb-3 mb-5 border-b border-slate-100">
              6. Third Party Advertisements / Promotions
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed">
              The User is aware that the Company/Website uses third-party advertising companies to serve ads to the users of the Website. The User is aware that these companies may use information relating to the User's visits to the Website and other websites in order to provide customised advertisements to the User. Furthermore, the Website may contain links to other websites that may collect personally identifiable information about the User. The Company/Website is not responsible for the privacy practices or the content of any of the aforementioned linked websites, and the User expressly acknowledges the same and agrees that any risks associated will be borne entirely by the User.
            </p>
          </div>

          {/* Section 7 - User's Consent */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-slate-900 pb-3 mb-5 border-b border-slate-100">
              7. User's Consent
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed">
              By using the Website and/or by providing information to the Company through the Website, the User consents to the collection and use of the information disclosed by the User on the Website in accordance with this Policy, including but not limited to the User's consent to the Company/Website sharing/divulging the User's information, as per the terms contained hereinabove.
            </p>
          </div>

          {/* Section 8 - Grievance Officer */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-slate-900 pb-3 mb-5 border-b border-slate-100">
              8. Grievance Officer
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed mb-4">
              In accordance with the Information Technology Act 2000 and rules made thereunder, the name and contact details of the Grievance Officer are provided below:
            </p>
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
              <div className="space-y-2 text-sm text-slate-700">
                <div>
                  <span className="font-medium text-slate-500 block mb-0.5">Name</span>
                  Shubham Sharma
                </div>
                <div>
                  <span className="font-medium text-slate-500 block mb-0.5">Email</span>
                  <a href="mailto:Shubhambeing12@gmail.com" className="text-blue-600 hover:underline">
                    Shubhambeing12@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 9 - Dispute Resolution */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-slate-900 pb-3 mb-5 border-b border-slate-100">
              9. Dispute Resolution and Jurisdiction
            </h2>
            <ul className="space-y-3">
              {[
                "It is expressly agreed to by the Parties hereto that the formation, interpretation and performance of this Policy and any disputes arising herefrom will be resolved through a two-step Alternate Dispute Resolution (\"ADR\") mechanism.",
                "Mediation: In case of any dispute between the parties, the Parties will attempt to resolve the same amicably amongst themselves, to the mutual satisfaction of both Parties. If the Parties are unable to reach such an amicable solution within thirty (30) days of one Party communicating the existence of a dispute to the other Party, the dispute will be resolved by arbitration.",
                "Arbitration: If the Parties are unable to amicably resolve a dispute by mediation, said dispute will be referred to arbitration by a sole arbitrator to be appointed by the company, and the award passed by such sole arbitrator will be valid and binding on both Parties. The arbitration shall be conducted in English, and the seat of Arbitration shall be the city of Jaipur in the state of Rajasthan, India.",
                "The Parties expressly agree that the Terms, Policy and any other agreements entered into between the Parties are governed by the laws, rules and regulations of India, and that the Courts at Jaipur, Rajasthan, shall have exclusive jurisdiction over any disputes arising between the Parties.",
              ].map((point, i) => (
                <li key={i} className="flex gap-3 text-slate-700 text-sm leading-relaxed">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}

export default Security
