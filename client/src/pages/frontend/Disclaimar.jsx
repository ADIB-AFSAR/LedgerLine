import Navbar from './Navbar'
import Footer from './Footer'

const sections = [
  {
    title: "Limitation of Warranties",
    items: [
      "Nothing in these terms shall exclude or limit Powerfiling warranty or liability for losses which may not be lawfully excluded or limited by applicable law. Some jurisdictions do not allow the exclusion of certain warranties or conditions or the limitation or exclusion of liability for loss or damage caused by negligence, breach of contract or breach of implied terms, or incidental or consequential damages. Accordingly, only the limitations which are lawful in your jurisdiction will apply to you and our liability will be limited to the maximum extent permitted by law.",
      "You expressly understand and agree that your use of the services is at your sole risk and that the services are provided \"as is\" and \"as available.\"",
      {
        text: "In particular, Powerfiling, its subsidiaries and affiliates, and its licensors do not represent or warrant to you that:",
        sub: [
          "Your use of the services will meet your requirements,",
          "Your use of the services will be uninterrupted, timely, secure or free from error,",
          "Any information obtained by you as a result of your use of the services will be accurate or reliable, and",
          "That defects in the operation or functionality of any software provided to you as part of the services will be corrected.",
        ],
      },
      "Any material downloaded or otherwise obtained through the use of the services is done at your own discretion and risk and that you will be solely responsible for any damage to your computer system or other device or loss of data that results from the download of any such material.",
      "No advice or information, whether oral or written, obtained by you from Powerfiling or through or from the services shall create any warranty not expressly stated in the terms.",
      "Powerfiling further expressly disclaims all warranties and conditions of any kind, whether express or implied, including, but not limited to the implied warranties and conditions of merchantability, fitness for a particular purpose and non-infringement.",
    ],
  },
  {
    title: "Limitation of Liabilities",
    items: [
      {
        text: "Subject to overall provision in paragraph above, you expressly understand and agree that Powerfiling, its subsidiaries and affiliates, and its licensors shall not be liable to you for:",
        sub: [
          "Any direct, indirect, incidental, special consequential or exemplary damages which may be incurred by you, however caused and under any theory of liability. This shall include, but not be limited to, any loss of profit (whether incurred directly or indirectly), any loss of goodwill or business reputation, any loss of data suffered, cost of procurement of substitute goods or services, or other intangible loss.",
          "Any loss or damage which may be incurred by you, including but not limited to loss or damage as a result of: (i) any reliance placed by you on the completeness, accuracy or existence of any advertising, or as a result of any relationship or transaction between you and any advertiser or sponsor whose advertising appears on the services; (ii) any changes which Powerfiling may make to the services, or for any permanent or temporary cessation in the provision of the services; (iii) the deletion of, corruption of, or failure to store, any content and other communications data maintained or transmitted by or through your use of the services; (iv) your failure to provide Powerfiling with accurate account information; (v) your failure to keep your password or account details secure and confidential.",
        ],
      },
      "The limitations on Powerfiling liability above shall apply whether or not Powerfiling has been advised of or should have been aware of the possibility of any such losses arising.",
    ],
  },
  {
    title: "Copyrights & Trademarks",
    body: "All content and materials available on www.Powerfiling.com, including but not limited to text, graphics, website name, code, images and logos are the intellectual property of BMS Tax Consultancy Services, and are protected by applicable copyright and trademark law. Any inappropriate use, including but not limited to the reproduction, distribution, display or transmission of any content on this site is strictly prohibited, unless specifically authorized by BMS Tax Consultancy Services.",
  },
  {
    title: "Termination of Uses",
    body: "You agree that we may, at our sole discretion, suspend or terminate your access to all or part of our website and Resources with or without notice and for any reason, including, without limitation, breach of this User Agreement. Any suspected illegal, fraudulent or abusive activity may be grounds for terminating your relationship and may be referred to appropriate law enforcement authorities. Upon suspension or termination, your right to use the Resources we provide will immediately cease, and we reserve the right to remove or delete any information that you may have on file with us, including any account or login information.",
  },
  {
    title: "Governing Law",
    body: "This website is controlled by BMS Tax Consultancy Services from our offices located in the state of Rajasthan, India. It can be accessed by most countries around the world. As each country has laws that may differ from those of Rajasthan, India, by accessing our website, you agree that the statutes and laws of Rajasthan, India without regard to the conflict of laws, will apply to all matters relating to the use of this website and the purchase of any products or services through this site. Furthermore, any action to enforce this User Agreement shall be brought in the federal or state courts located in Rajasthan, India. You hereby agree to personal jurisdiction by such courts, and waive any jurisdictional, venue, or inconvenient forum objections to such courts.",
  },
  {
    title: "Guarantee",
    body: "Unless otherwise expressed, www.Powerfiling.com expressly disclaims all warranties and conditions of any kind, whether express or implied, including, but not limited to the implied warranties and conditions of merchantability, fitness for a particular purpose and non-infringement.",
  },
]

const Disclaimar = () => {
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
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Disclaimer</h1>
            {/* <p className="text-slate-300 text-sm">Last Updated: January 1, 2025</p> */}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">

          {sections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-lg font-bold text-slate-900 pb-3 mb-5 border-b border-slate-100">
                {section.title}
              </h2>

              {section.body && (
                <p className="text-slate-700 text-sm leading-relaxed">{section.body}</p>
              )}

              {section.items && (
                <ol className="space-y-4 list-decimal list-outside pl-5">
                  {section.items.map((item, i) =>
                    typeof item === 'string' ? (
                      <li key={i} className="text-slate-700 text-sm leading-relaxed pl-1">
                        {item}
                      </li>
                    ) : (
                      <li key={i} className="text-slate-700 text-sm leading-relaxed pl-1">
                        <span>{item.text}</span>
                        <ul className="mt-3 space-y-2 list-[lower-alpha] list-outside pl-5">
                          {item.sub.map((s, j) => (
                            <li key={j} className="text-slate-600 text-sm leading-relaxed pl-1">
                              {s}
                            </li>
                          ))}
                        </ul>
                      </li>
                    )
                  )}
                </ol>
              )}
            </div>
          ))}

        </div>
      </main>

      <Footer />
    </>
  )
}

export default Disclaimar
