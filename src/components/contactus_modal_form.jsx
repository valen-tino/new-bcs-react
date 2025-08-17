import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCMS } from '../contexts/CMSContext';
import { toast } from 'react-toastify';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Province from '../data/dataProvinces';
import OurServices from '../data/dataServices';
import { content } from '../data/dataContactForm';

export default function ContactUsModal({ hide }) {
  const { language } = useLanguage();
  const { submitContactRequest } = useCMS();
  const lang = language === "Indonesia" ? content.Indonesia : content.English;

  const [formFields, setFormFields] = useState({
    name: '',
    phone: '',
    email: '',
    province: '',
    service: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formFields.name.trim()) newErrors.name = 'Name is required';
    if (!formFields.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formFields.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formFields.email)) newErrors.email = 'Email is invalid';
    if (!formFields.province) newErrors.province = 'Province is required';
    if (!formFields.service) newErrors.service = 'Service is required';
    if (!formFields.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await submitContactRequest({
        name: formFields.name,
        email: formFields.email,
        phone: formFields.phone,
        service: formFields.service,
        province: formFields.province,
        message: formFields.message,
      });
      
      // Reset form
      setFormFields({
        name: '',
        phone: '',
        email: '',
        province: '',
        service: '',
        message: '',
      });
      setErrors({});
      
      toast.success('Your request has been submitted successfully!');
      hide(); // Close the modal
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event) => {
    setFormFields({ ...formFields, [event.target.name]: event.target.value });

    if (errors[event.target.name]) {
      setErrors({ ...errors, [event.target.name]: '' });
    }
  };

  useEffect(() => {
    AOS.init();
  }, []);

  const provinces = Array.isArray(Province) ? Province : [];
  const serviceOptions = Array.isArray(OurServices) ? OurServices : [];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="relative w-auto max-w-3xl mx-auto my-6 mt-36">
          <div className="relative flex flex-col w-full bg-orange-100 border-0 rounded-lg shadow-lg outline-none focus:outline-none" data-aos="fade-down">
            <div className="relative flex-auto p-4">
              <form className='flex flex-wrap text-left md:pt-10 xl:p-18 lg:p-12' onSubmit={handleSubmit}>
                <div className='w-full p-2'>
                  <h5 className="mb-2 text-4xl tracking-tight text-center text-gray-900 text-bold">{lang.title}</h5>
                </div>

                <div className='w-1/2 p-2'>
                  <div className="relative">
                    <label htmlFor="name" className="text-sm leading-7 text-gray-600">{lang.name}</label>
                    <input 
                      placeholder='' 
                      type="text" 
                      id="name" 
                      name="name" 
                      className="w-full px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-white border-2 rounded-lg outline-none border-neutral-500 focus:border-red-500" 
                      value={formFields.name} 
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    {errors.name && <p className="text-xs italic text-red-500">{errors.name}</p>}
                  </div>
                </div>

                <div className="w-1/2 p-2">
                  <div className="relative">
                    <label htmlFor="phone" className="text-sm leading-7 text-gray-600">{lang.phone}</label>
                    <input
                      placeholder='Ex. +6281807082004'
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-white border-2 rounded-lg outline-none border-neutral-500 focus:border-red-500"
                      value={formFields.phone} 
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    {errors.phone && <p className="text-xs italic text-red-500">{errors.phone}</p>}
                  </div>
                </div>

                <div className="w-full p-2">
                  <div className="relative">
                    <label htmlFor="email" className="text-sm leading-7 text-gray-600">{lang.email}</label>
                    <input
                      placeholder='Ex. admin@bcsvisa.com'
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-white border-2 rounded-lg outline-none border-neutral-500 focus:border-red-500"
                      value={formFields.email} 
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    {errors.email && <p className="text-xs italic text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div className="w-1/2 p-2">
                  <div className="relative">
                    <label htmlFor="province" className="text-sm leading-7 text-gray-600">{lang.province}</label>
                    <select 
                      name="province" 
                      id="province" 
                      className="w-full px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-white border-2 rounded-lg outline-none border-neutral-500 focus:border-red-500" 
                      value={formFields.province} 
                      onChange={handleChange}
                      disabled={isSubmitting}
                    >
                      <option value="" disabled>--Select your province--</option>
                      {provinces.map((item, key) => (
                        <option value={item.name} key={key}>{item.name}</option>
                      ))}
                    </select>
                    {errors.province && <p className="text-xs italic text-red-500">{errors.province}</p>}
                  </div>
                </div>

                <div className="w-1/2 p-2">
                  <div className="relative">
                    <label htmlFor="service" className="text-sm leading-7 text-gray-600">{lang.services}</label>
                    <select 
                      name="service" 
                      id="service" 
                      className="w-full px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-white border-2 rounded-lg outline-none border-neutral-500 focus:border-red-500" 
                      value={formFields.service} 
                      onChange={handleChange}
                      disabled={isSubmitting}
                    >
                      <option value="" disabled>--Please Choose an Option--</option>
                      {serviceOptions.map((item, key) => (
                        <option value={item.services} key={key}>{item.services}</option>
                      ))}
                    </select>
                    {errors.service && <p className="text-xs italic text-red-500">{errors.service}</p>}
                  </div>
                </div>

                <div className="w-full p-2">
                  <div className="relative">
                    <label htmlFor="message" className="text-sm leading-7 text-gray-600">{lang.help}</label>
                    <textarea 
                      placeholder='' 
                      id="message" 
                      name="message" 
                      className="w-full h-32 px-3 py-1 text-base leading-6 text-gray-700 transition-colors duration-200 ease-in-out bg-white border-2 rounded-lg outline-none border-neutral-500 focus:border-red-500" 
                      value={formFields.message} 
                      onChange={handleChange}
                      disabled={isSubmitting}
                    ></textarea>
                    {errors.message && <p className="text-xs italic text-red-500">{errors.message}</p>}
                  </div>
                </div>

                <div className="w-full p-2">
                  <button 
                    type="submit" 
                    className="flex mx-auto text-lg rounded submit focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
            <div className="flex items-center justify-start p-4 border-t border-orange-200 border-solid rounded-b md:justify-end">
              <button 
                className="text-xs font-bold text-red-500 uppercase outline-none background-transparent focus:outline-none hover:text-red-500 disabled:opacity-50" 
                type="button" 
                onClick={hide}
                disabled={isSubmitting}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  );
}
