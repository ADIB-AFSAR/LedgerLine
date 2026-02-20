import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Navbar from '../../frontend/Navbar';
import Footer from '../../frontend/Footer';
import { businessServices } from '../../../data/servicesData';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/axios';

const BusinessITR = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [purchasedPlanNames, setPurchasedPlanNames] = useState([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!isLoggedIn) return;
      try {
        const { data } = await api.get('/payments/my-orders');
        if (data.success) {
          const names = data.data
            .filter(order => order.planId && order.planId.name)
            .map(order => order.planId.name);
          setPurchasedPlanNames(names);
        }
      } catch (err) {
        console.error("Error fetching purchases:", err);
      }
    };
    fetchPurchases();
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
              Business ITR Filing Services
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Professional tax filing services for businesses, traders, and specialized income sources
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businessServices.map((service, index) => {
              const ServiceIcon = service.icon;
              const isPurchased = purchasedPlanNames.includes(service.title);

              return (
                <div key={index} className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 ${service.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <ServiceIcon className={`w-8 h-8 ${service.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                    <p className="text-slate-600 mb-4 text-sm">{service.description}</p>
                    <div className="text-2xl font-extrabold text-slate-900 mb-6">{service.price}</div>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        </div>
                        <span className="text-slate-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    {isPurchased ? (
                      <div className="space-y-3">
                        <div className="bg-green-100 text-green-700 py-3 rounded-2xl font-bold text-center flex items-center justify-center gap-2 text-sm">
                          <CheckCircle size={18} />
                          Current Plan
                        </div>
                        <Link
                          to={`/services/${service.id}`}
                          className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-2xl font-bold hover:from-green-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 group text-sm"
                        >
                          View Plan
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    ) : (
                      <Link
                        to={`/services/${service.id}`}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-2xl font-bold hover:from-green-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 group text-sm"
                      >
                        View Plan
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    )}
                  </div>


                </div>
              );
            })}
          </div>

          {/* Help Section */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Need Business Tax Consultation?</h3>
              <p className="text-slate-600 mb-6">
                Complex business income? Our CA experts specialize in business tax planning and compliance.
              </p>
              <Link
                to="/login"
                className="inline-block bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors"
              >
                Get Business Tax Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BusinessITR;