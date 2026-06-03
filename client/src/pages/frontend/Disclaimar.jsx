import Navbar from './Navbar'
import Footer from './Footer'

const sections = [
  {
    title: "1. General Disclaimer",
    body: "The Information And Services Provided By Powerfiling Are Intended For General Informational And Compliance Purposes Only. While We Strive To Keep All Information Accurate And Up To Date, We Make No Representations Or Warranties Of Any Kind Regarding Completeness, Accuracy, Reliability, Or Suitability.\n\nUsers Are Advised To Seek Professional Advice Before Making Any Financial, Legal, Or Tax-Related Decisions.",
  },
  {
    title: "2. No Professional Guarantee",
    items: [
      "We Do Not Guarantee Approval Of Any Registration (GST, Company, LLP, Etc.)",
      "We Do Not Guarantee Acceptance Of Filings By Government Authorities",
      "We Do Not Guarantee Specific Tax Refunds Or Financial Outcomes",
      "All Services Are Subject To Applicable Laws, Rules, And Approvals By Respective Authorities.",
    ],
  },
  {
    title: "3. Limitation Of Warranties",
    intro: "All Services Provided By Powerfiling Are On An \"As Is\" And \"As Available\" Basis.\n\nWe Do Not Warrant That:",
    items: [
      "Services Will Be Uninterrupted, Timely, Or Error-Free",
      "Results Obtained Will Be Accurate Or Reliable",
      "Defects Or Technical Issues Will Be Corrected",
    ],
    extra: "We Expressly Disclaim All Warranties, Including But Not Limited To:\n- Merchantability\n- Fitness For A Particular Purpose\n- Non-Infringement",
  },
  {
    title: "4. Limitation Of Liability",
    intro: "To The Maximum Extent Permitted By Law, Powerfiling Shall Not Be Liable For:",
    items: [
      "Any Direct, Indirect, Incidental, Or Consequential Damages",
      "Loss Of Profits, Business, Goodwill, Or Data",
      "Delays Or Errors Caused By Third-Party Systems (Including Government Portals)",
      "Any Reliance Placed On Information Or Services Provided",
    ],
    note: "Users Are Responsible For Providing Accurate Information And Maintaining The Confidentiality Of Their Login Credentials.",
  },
  {
    title: "5. Third-Party Dependencies",
    intro: "Many Of Our Services Depend On External Platforms Such As Government Portals. We Are Not Responsible For:",
    items: [
      "Portal Downtime Or Technical Issues",
      "Delays From Government Authorities",
      "Changes In Laws, Rules, Or Regulations",
      "Rejections Due To Incorrect Or Incomplete Information Provided By Users",
    ],
  },
  {
    title: "6. Intellectual Property Rights",
    body: "All Content On This Website, Including But Not Limited To Text, Graphics, Logos, Design, And Layout, Is The Property Of Powerfiling Private Limited And Is Protected Under Applicable Intellectual Property Laws.\n\nUnauthorized Use, Reproduction, Or Distribution Is Strictly Prohibited.",
  },
  {
    title: "7. Termination Of Use",
    intro: "We Reserve The Right To Suspend Or Terminate Access To Our Services Without Prior Notice If:",
    items: [
      "There Is A Violation Of Terms",
      "Fraudulent, Illegal, Or Abusive Activity Is Suspected",
    ],
    note: "Upon Termination, Your Access To Services And Related Data May Be Restricted Or Removed.",
  },
  {
    title: "8. Governing Law & Jurisdiction",
    body: "This Website Is Operated From Rajasthan, India. All Disputes Arising Out Of Or Related To The Use Of This Website Shall Be Governed By The Laws Of India.\n\nJurisdiction Shall Lie Exclusively With The Courts Located In Rajasthan.",
  },
  {
    title: "9. No Guarantee Clause",
    body: "Unless Explicitly Stated In Writing, Powerfiling Does Not Provide Any Guarantees Or Warranties Regarding The Outcome Of Services.",
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
            <p className="text-slate-300 text-sm">Last Updated: January 1, 2025</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">

          {sections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-lg font-bold text-slate-900 pb-3 mb-5 border-b border-slate-100">
                {section.title}
              </h2>

              {/* Body text */}
              {section.body && (
                <div className="text-slate-700 text-sm leading-relaxed space-y-3 whitespace-pre-line">
                  {section.body.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}

              {/* Intro text */}
              {section.intro && (
                <p className="text-slate-700 text-sm leading-relaxed mb-4">
                  {section.intro}
                </p>
              )}

              {/* Bullet items */}
              {section.items && (
                <ul className="space-y-2.5 mt-4">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex gap-3 text-slate-700 text-sm leading-relaxed">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Extra content */}
              {section.extra && (
                <div className="mt-4 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                  {section.extra}
                </div>
              )}

              {/* Note */}
              {section.note && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-sm text-blue-900">{section.note}</p>
                </div>
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
