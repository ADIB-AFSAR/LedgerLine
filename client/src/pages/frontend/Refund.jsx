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
            <p className="text-slate-300 text-sm">Last Updated: January 1, 2025</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">

          {/* Intro */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <p className="text-slate-700 text-sm leading-relaxed">
              Welcome to <strong>Powerfiling.com</strong>. We are glad to have you on board. We thank you for purchasing our services/products. Our focus is to achieve customer satisfaction. However, we have a standard operating procedure for processing the refund, which has been outlined below.
            </p>
          </div>

          {/* Section 1 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-slate-900 pb-3 mb-5 border-b border-slate-100">
              Refund at the Choice of the Client Without Any Reason
            </h2>
            <ul className="space-y-3">
              {[
                "We will refund 100% of the amount received if you notify us within 4 hours of the purchase or payment via email to Contact@Powerfiling.com. If you place a refund request after 4 hours from the payment, no refund will take place.",
                "No refund shall be made once the order is assigned to the network of professionals (CA, CS, Lawyers, Engineers, Management Consultants, and Other Professionals).",
                "If you do not respond to the email/call/WhatsApp for more than thirty (30) days, then the order shall be deemed cancelled, and no refund will occur under any circumstances.",
                "Refund is subject to approval from the consultant; therefore, in case any dispute arises between the client and consultant, then it will be considered an individual dispute between the client and consultant, and Powerfiling will not be liable for it.",
                "You understand and undertake that before the purchase of services from our website, www.powerfiling.com, you have completely understood the applicable government fees, government compliance requirements, documents required, and any other document or facilities or infrastructure or land or commercial premises may be required to secure such license or registration or certification, or government approvals/clearance.",
                "You have to furnish all the necessary documents and required information to obtain such a license, registration, certification or government approvals/clearance as requested by the network of professionals. In case you are unable to provide such information for a maximum period of 45 days, then the services you have availed from our website, Powerfiling.com, will be deemed to be completed, and you will be required to pay the balance amount.",
                "In professional services, time has a cost; hence every piece of advice or time spent during a call has a cost and time engagement.",
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
              Refund in Case Our Network of Professionals Is Unable to Deliver the Services
            </h2>
            <ul className="space-y-3">
              {[
                "If the network of professionals cannot deliver the services due to a change in the law and is not able to fulfil the revised regulatory norms of the government under such circumstances, no refund shall be made.",
                "Under any ordinary case, you have provided all documents, necessary qualifications, and facilities and still the network of professionals either does not have experience in providing the said services or denies to work on your assignment, then as an aggregator of the professionals, we may assign the same service order to the other professionals in our network. If none of the professionals can deliver the services within a cooling period of 30 days, you may request a refund by writing your request to contact@Powerfiling.com",
                "In situations where the service needs to be delivered before a deadline (e.g., tax filing), Powerfiling will clarify the estimated time required to fulfil the service to the customer. The customer is expected to cooperate with Powerfiling to enable us to deliver the services on time. In case of any delay in order fulfilment, Powerfiling shall not bear the cost of any interest or penalty that may be imposed on customers by other parties.",
                "Delay from the end of regulators/Government departments has been excluded from seeking refund requests. Any delay from the end of regulatory authorities shall not be considered a delay from the consultant's end. Consultant shall provide the right legal advice as and when required.",
                "No refund request shall be entertained in case of rejection of the application by the government authorities due to any reason not in the control of the professional. If the client wishes to reapply after rejection by the government authorities, they will have to pay 70% of the professional fees and 100% of the government fees and any other travel/miscellaneous fees as required to cover expenses for the purpose of delivering the assignment. If the client agreed to this, professionals will be required to create a fresh order after approval from the client.",
                "You understand that government authorities may levy any penalty or fee on you for any reason; you shall bear all such penalties, and the consultant or Powerfiling.com shall not be held responsible for any such action or imposition by the government authorities.",
                "By purchasing services from our website, you undertake that you are not an agent, middleman, or unregistered legal professional in any manner; you are aware that Powerfiling.com is a legal platform solely designed for businesses or individuals who are seeking legal services. In case any service order is received from the middleman or unregistered professionals or professionals outside the Powerfiling network, such orders shall be considered a violation of platform principles and under such circumstances, the order shall be marked as cancelled, and no refund shall take place.",
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
            <ul className="space-y-3">
              {[
                "We will refund you to the original mode from which we received the fees from you, and shall not be refunded to any third party in any case.",
                "Eligible refund shall be processed within a minimum of 30 days from the approval by the network of professionals (Powerfiling.com)",
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
                    Email the designated professionals (CA/CS/other professionals) and keep cc'd to <a href="mailto:contact@Powerfiling.com" className="text-blue-600 hover:underline">contact@Powerfiling.com</a>. This may take a week time to finalise the decision.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <p className="font-semibold text-slate-800 text-sm mb-1">Level 2</p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    If you are unhappy or unsatisfied with level 1, you may appeal to our nodal officer at <a href="mailto:Contact@Powerfiling.com" className="text-blue-600 hover:underline">Contact@Powerfiling.com</a>. This may take seven (7) working days to conclude. The decision of the nodal officer is final.
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
                "Enquiry posted on our website (Powerfiling.com)",
                "You have made the payment online in the Bank Account of Powerfiling Private Limited and the payment gateways. We have received the payment.",
                "A professional from our network, based on the package selected by you, shall be assigned within 30 minutes of the payment confirmation.",
                "While making payment, we assume you know your service requirement and the documents required for obtaining such registration, licenses, or approval.",
                "The documents required by the professionals or government agencies shall be final, and you undertake to provide the same as and when required.",
                "Dispute Settlement – In case of a dispute among the parties, the Jaipur court shall have exclusive jurisdiction to solve disputes among the parties.",
                "Powerfiling reserves the right to refuse any order that it cannot fulfil within the legal and regulatory framework of the country.",
                "The Powerfiling has the right to make amendments to the information provided on the website, at any time and without prior notice. Thus, we recommend that you review this information periodically for changes.",
              ].map((term, i) => (
                <li key={i} className="text-slate-700 text-sm leading-relaxed pl-1">
                  {term}
                </li>
              ))}
            </ol>
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}

export default Refund
