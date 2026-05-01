import Navbar from './Navbar'
import Footer from './Footer'

const Refund = () => {
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
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Refund Policy</h1>
            {/* <p className="text-slate-300 text-sm">Last Updated: January 1, 2025</p> */}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">

          {/* Intro */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <p className="text-slate-700 leading-relaxed">
              Welcome to <strong>Powerfiling.com</strong>; we are glad to have you on board. We thank you for purchasing our services/products from our website (<strong>www.Powerfiling.com</strong>). Our focus is to achieve customer satisfaction. However, we have a standard operating procedure for processing the refund, which has been outlined below.
            </p>
          </div>

          {/* Section 1 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-slate-900 pb-3 mb-5 border-b border-slate-100">
              1. Refund at the Choice of the Client Without Any Reason
            </h2>
            <ul className="space-y-4">
              {[
                "Refund by the purchaser – We will refund 100% of the amount received if you notify us within 4 hours of the purchase or payment via email to Contact@Powerfiling.com. If you place a refund request after 4 hours from the payment, no refund will take place.",
                "No refund shall be made once the order is assigned to the network of professionals (CA, CS, Lawyers, Engineers, Management Consultants, and Other Professionals).",
                "If you do not respond to the email/call/WhatsApp for more than 30 days, then the order shall be deemed cancelled, and no refund will occur under any circumstances.",
                "Refund is subject to approval from the consultant; therefore, in case any dispute arises between the client and consultant, then it will be considered an individual dispute between the client and consultant, and Powerfiling will not be liable for it.",
                "You understand and undertake that before the purchase of services from our website, www.powerfiling.com, you have completely understood the applicable government fees, government compliance requirements, documents required, and any other document or facilities or infrastructure or land or commercial premises may be required to secure such license or registration or certification, or government approvals/clearance.",
                "You have to furnish all the necessary documents and required information to obtain such license or registration or certification or government approvals/clearance as requested by the network of professionals. In case you are unable to provide such information for a maximum period of 45 days, then the services you have availed from our website, Powerfiling.com will be deemed to be completed, and you will be required to pay the balance amount.",
                "In professional services, time has a cost — hence every piece of advice or time spent during a call has a cost and time engagement.",
              ].map((point, i) => (
                <li key={i} className="flex gap-3 text-slate-700 text-sm leading-relaxed">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-slate-900 pb-3 mb-5 border-b border-slate-100">
              2. Refund in Case Our Network of Professionals Is Unable to Deliver the Services
            </h2>
            <ul className="space-y-4">
              {[
                "If the network of professionals cannot deliver the services due to a change in the law and is not able to fulfill the revised regulatory norms of the government, under such circumstances no refund shall be made.",
                "Under any ordinary case where you have provided all documents, necessary qualification, and facilities and still the network of professionals either does not have experience in providing the said services or is denying to work on your assignment, then as an aggregator of the professionals, we may assign the same service order to other professionals in our network. If none of the professionals can deliver the services in a cooling period of 30 days, you may request a refund by writing your request at contact@Powerfiling.com.",
                "Delay from the end of regulators/Government departments has been excluded from seeking refund requests. Any delay from the end of regulatory authorities shall not be considered a delay from the consultant's end. Consultant shall provide the right legal advice as and when required.",
                "No refund request shall be entertained in case of rejection of the application by the government authorities due to any reason not in the control of the professional. If the client wishes to re-apply after rejection by the government authorities, they will have to pay 70% of the professional fees and 100% of the government fees and any other travel/miscellaneous fees as required.",
                "You understand that government authorities may levy any penalty or fee on you for any reason; you shall bear all such penalties, and the consultant or Powerfiling.com shall not be held responsible for any such action or imposition by the government authorities.",
                "By purchasing services from our website, you undertake that you are not an agent, middleman, or un-registered legal professional in any manner. You are aware that Powerfiling.com is a legal platform solely designed for businesses or individuals who are seeking legal services. Orders received from middlemen or unregistered professionals shall be considered a violation of platform principles and such orders shall be marked as cancelled with no refund.",
                "Refunds shall not be entertained when documents required for delivering the service order have been shared with you via email or WhatsApp.",
              ].map((point, i) => (
                <li key={i} className="flex gap-3 text-slate-700 text-sm leading-relaxed">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Refund Method */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-slate-900 pb-3 mb-5 border-b border-slate-100">
              Refund Method
            </h2>
            <ul className="space-y-4">
              {[
                "We will refund you to the original mode from which we received the fees from you and shall not be refunded to any third party in any case.",
                "Eligible refund shall be processed within a minimum of 30 days from the approval by the network of professionals (Powerfiling.com).",
              ].map((point, i) => (
                <li key={i} className="flex gap-3 text-slate-700 text-sm leading-relaxed">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Escalation Matrix */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-slate-900 pb-3 mb-5 border-b border-slate-100">
              Escalation Matrix
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <p className="font-semibold text-slate-800 text-sm mb-1">Level 1</p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Email the designated professionals (CA/CS/other professionals) and keep CC'd to <a href="mailto:contact@Powerfiling.com" className="text-blue-600 hover:underline">contact@Powerfiling.com</a>. This may take up to one week to finalize the decision.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <p className="font-semibold text-slate-800 text-sm mb-1">Level 2</p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    If you are unhappy or unsatisfied with Level 1, you may appeal to our nodal officer at <a href="mailto:Contact@Powerfiling.com" className="text-blue-600 hover:underline">Contact@Powerfiling.com</a>. This may take seven (7) working days to conclude. The decision of the nodal officer is final.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Other Terms */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-slate-900 pb-3 mb-5 border-b border-slate-100">
              Other Terms
            </h2>
            <ol className="space-y-3 list-decimal list-inside">
              {[
                "Enquiry posted on our website (Powerfiling.com).",
                "You have made the payment online in the Bank Account of BMS Tax Consultancy and Payment gateways. We have received the payment.",
                "A professional from our network based on the package selected by you shall be assigned within 30 minutes from the payment confirmation.",
                "While making payment, we assume you know your service requirement and the documents required for obtaining such registration, licenses, or approval.",
                "The documents required by the professionals or government agencies shall be final, and you undertake to provide the same as and when required.",
                "Dispute Settlement – In case of a dispute among the parties, the Jaipur court shall have exclusive jurisdiction to solve disputes among the parties.",
              ].map((term, i) => (
                <li key={i} className="text-slate-700 text-sm leading-relaxed pl-1">
                  {term}
                </li>
              ))}
            </ol>
          </div>

          {/* Amendment Notice */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <p className="text-slate-700 text-sm leading-relaxed">
              <strong>Powerfiling</strong> reserves the right to make amendments to the information provided on the website, at any time and without prior notice. Thus, we recommend you to review this information periodically for changes.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}

export default Refund
