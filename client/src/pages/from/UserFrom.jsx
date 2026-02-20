import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, AlertCircle, ArrowLeft, UploadCloud } from 'lucide-react';
import Footer from "../frontend/Footer";
import Navbar from "../frontend/Navbar";
import { getFormConfig } from '../../data/formFieldsData';
import { individualServices, businessServices, registrationServices, otherServices } from '../../data/servicesData';
import api from '../../api/axios';

const UserForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const serviceId = searchParams.get('service') || 'default';
  const purchaseId = searchParams.get('purchaseId'); // Get purchaseId from query params

  const formConfig = getFormConfig(serviceId);

  // Find the service details
  const allServices = [
    ...individualServices,
    ...businessServices,
    ...registrationServices,
    ...otherServices
  ];

  const serviceDetails = allServices.find(s => s.id === serviceId);

  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(''); // 'uploading', 'submitting', 'success', 'error'

  useEffect(() => {
    // Optional: Can add a check here if purchaseId is valid via API
    if (!purchaseId) {
      // Maybe redirect if required, but staying on page with error message is safer
    }
  }, [purchaseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e, field) => {
    const { name } = e.target;
    const selectedFiles = field.multiple ? Array.from(e.target.files) : e.target.files[0];

    // Validation logic
    const validateFile = (file) => {
      if (file.size > field.maxSize) {
        return `File size exceeds ${(field.maxSize / (1024 * 1024)).toFixed(0)}MB`;
      }
      return null;
    };

    if (field.multiple) {
      const fileErrors = [];
      selectedFiles.forEach(file => {
        const err = validateFile(file);
        if (err) fileErrors.push(err);
      });
      if (fileErrors.length > 0) {
        setErrors(prev => ({ ...prev, [name]: fileErrors[0] }));
        return;
      }
    } else if (selectedFiles) {
      const err = validateFile(selectedFiles);
      if (err) {
        setErrors(prev => ({ ...prev, [name]: err }));
        return;
      }
    }

    setFiles(prev => ({
      ...prev,
      [name]: selectedFiles
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = (field, value) => {
    if (field.type === 'file') {
      if (field.required && !files[field.name]) {
        return `${field.label} is required`;
      }
      return '';
    }
    if (field.required && !value) {
      return `${field.label} is required`;
    }
    if (value && field.validation) {
      if (field.validation.pattern && !field.validation.pattern.test(value)) {
        return field.validation.message || `Invalid ${field.label}`;
      }
      if (field.validation.minLength && value.length < field.validation.minLength) {
        return `${field.label} must be at least ${field.validation.minLength} characters`;
      }
      if (field.validation.maxLength && value.length > field.validation.maxLength) {
        return `${field.label} must not exceed ${field.validation.maxLength} characters`;
      }
    }
    return '';
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data.data._id; // Based on assumption that response structure is { success: true, data: { _id: ... } }
    } catch (error) {
      console.error("File upload failed:", error);
      throw new Error(`Failed to upload ${file.name}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus('');

    // 1. Validation
    const newErrors = {};
    formConfig.sections.forEach(section => {
      section.fields.forEach(field => {
        const error = validateField(field, formData[field.name]);
        if (error) {
          newErrors[field.name] = error;
        }
      });
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!purchaseId) {
      setErrors({ general: "Payment verification failed. Please complete the payment process first." });
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      // 2. Upload Documents
      setSubmissionStatus('uploading');
      const uploadedDocIds = [];

      for (const key in files) {
        const fileOrFiles = files[key];
        if (Array.isArray(fileOrFiles)) {
          for (const file of fileOrFiles) {
            const docId = await uploadFile(file);
            uploadedDocIds.push(docId);
          }
        } else if (fileOrFiles) {
          const docId = await uploadFile(fileOrFiles);
          uploadedDocIds.push(docId);
        }
      }

      // 3. Submit ITR
      setSubmissionStatus('submitting');
      const itrPayload = {
        purchaseId,
        formType: serviceId,
        personalInfo: formData,
        uploadedDocs: uploadedDocIds
      };

      const { data } = await api.post('/itr', itrPayload);

      if (data.success) {
        setSubmissionStatus('success');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }

    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ general: error.response?.data?.message || "Something went wrong. Please try again." });
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    const hasError = errors[field.name];
    const value = formData[field.name] || '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'date':
      case 'number':
        return (
          <div key={field.id} className="mb-6">
            <label htmlFor={field.id} className="block text-sm font-semibold text-slate-700 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type}
              id={field.id}
              name={field.name}
              value={value}
              onChange={handleInputChange}
              placeholder={field.placeholder}
              className={`w-full px-4 py-3 border ${hasError ? 'border-red-500' : 'border-slate-300'
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
            />
            {hasError && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{hasError}</span>
              </div>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="mb-6">
            <label htmlFor={field.id} className="block text-sm font-semibold text-slate-700 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id={field.id}
              name={field.name}
              value={value}
              onChange={handleInputChange}
              placeholder={field.placeholder}
              rows={field.rows || 4}
              className={`w-full px-4 py-3 border ${hasError ? 'border-red-500' : 'border-slate-300'
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none`}
            />
            {hasError && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{hasError}</span>
              </div>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="mb-6">
            <label htmlFor={field.id} className="block text-sm font-semibold text-slate-700 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              id={field.id}
              name={field.name}
              value={value}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border ${hasError ? 'border-red-500' : 'border-slate-300'
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
            >
              <option value="">Select an option</option>
              {field.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {hasError && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{hasError}</span>
              </div>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex gap-6">
              {field.options.map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={value === option.value}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700">{option.label}</span>
                </label>
              ))}
            </div>
            {hasError && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{hasError}</span>
              </div>
            )}
          </div>
        );

      case 'file':
        return (
          <div key={field.id} className="mb-6 col-span-2">
            <label htmlFor={field.id} className="block text-sm font-semibold text-slate-700 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.description && (
              <p className="text-xs text-slate-500 mb-2">{field.description}</p>
            )}
            <div className="relative">
              <input
                type="file"
                id={field.id}
                name={field.name}
                onChange={(e) => handleFileChange(e, field)}
                accept={field.accept}
                multiple={field.multiple}
                className="block w-full text-sm text-slate-500
                                  file:mr-4 file:py-3 file:px-6
                                  file:rounded-xl file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-blue-50 file:text-blue-700
                                  hover:file:bg-blue-100
                                  file:cursor-pointer cursor-pointer
                                  border border-slate-300 rounded-xl
                                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {files[field.name] && (
                <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>
                    {field.multiple
                      ? `${files[field.name].length} file(s) selected`
                      : files[field.name].name
                    }
                  </span>
                </div>
              )}
            </div>
            {hasError && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{hasError}</span>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>

          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle size={20} />
              <p>{errors.general}</p>
            </div>
          )}

          {serviceDetails && (
            <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                      Filing For
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{serviceDetails.title}</h2>
                  <p className="text-blue-100 mb-3">{serviceDetails.description}</p>

                  {!purchaseId && (
                    <div className="bg-yellow-500/20 px-4 py-2 rounded-lg inline-block">
                      <p className="text-sm font-semibold text-yellow-100 flex items-center gap-2">
                        <AlertCircle size={16} />
                        Payment pending. You must complete payment to file.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              {formConfig.title}
            </h1>
            <p className="text-slate-600">
              {formConfig.description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            {formConfig.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {section.title}
                  </h2>
                  {section.note && (
                    <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <p className="text-sm text-blue-800">{section.note}</p>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {section.fields.map(field => renderField(field))}
                </div>
              </div>
            ))}

            <div className="flex gap-4 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !purchaseId}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {submissionStatus === 'uploading' ? 'Uploading Files...' : 'Submitting ITR...'}
                  </>
                ) : !purchaseId ? (
                  'Payment Required'
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Submit ITR
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserForm;
