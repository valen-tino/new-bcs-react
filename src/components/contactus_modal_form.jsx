import React, { useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Province from '../data/dataProvinces';
import OurServices from '../data/dataServices';
import { content } from '../data/dataContactForm';

export default function ContactUsModal({ hide }, props) {
  const lang = props.language === "Indonesia" ? content.Indonesia : content.English;

  const [formFields, setFormFields] = useState({
    name: '',
    phone_number: '',
    email: '',
    province: '',
    services: '',
    message: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formFields.name.trim()) newErrors.name = 'Name is required';
    if (!formFields.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    if (!formFields.email.trim()) newErrors.email = 'Email is required';
    if (!formFields.province) newErrors.province = 'Province is required';
    if (!formFields.services) newErrors.services = 'Service is required';
    if (!formFields.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;
  };

  const handleChange = (event) => {
    setFormFields({ ...formFields, [event.target.name]: event.target.value });

    if (errors[event.target.name]) {
      setErrors({ ...errors, [event.target.name]: '' });
    }
  };

  AOS.init();

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="relative w-auto max-w-3xl mx-auto my-6 mt-36">
          <div className="relative flex flex-col w-full bg-orange-100 border-0 rounded-lg shadow-lg outline-none focus:outline-none" data-aos="fade-down">
            <div className="relative flex-auto p-4">
              <form className='flex flex-wrap text-left md:pt-10 xl:p-18 lg:p-12' action="https://formsubmit.co/admin@bcsvisa.com" method="POST" onSubmit={handleSubmit}>
                <div className='w-full p-2'>
                  <h5 className="mb-2 text-4xl tracking-tight text-center text-gray-900 text-bold">{lang.title}</h5>
                </div>

                <div className='w-1/2 p-2'>
                  <div className="relative">
                    <label htmlFor="name" className="text-sm leading-7 text-gray-600">{lang.name}</label>
                    <input placeholder='' type="text" id="name" name="name" className="w-full px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-white border-2 rounded-lg outline-none border-neutral-500 focus:border-red-500" value={formFields.name} onChange={handleChange} />
                    {errors.name && <p className="text-xs italic text-red-500">{errors.name}</p>}
                  </div>
                </div>

                <div className="w-1/2 p-2">
                  <div className="relative">
                    <label htmlFor="tel" className="text-sm leading-7 text-gray-600">{lang.phone}</label>
                    <input
                      placeholder='Ex. +6281807082004'
                      type="tel"
                      id="tel"
                      name="phone_number"
                      className="w-full px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-white border-2 rounded-lg outline-none border-neutral-500 focus:border-red-500"
                      value={formFields.phone_number} onChange={handleChange}
                    />
                    {errors.phone_number && <p className="text-xs italic text-red-500">{errors.phone_number}</p>}
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
                      value={formFields.email} onChange={handleChange}
                    />
                    {errors.email && <p className="text-xs italic text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div className="w-1/2 p-2">
                  <div className="relative">
                    <label htmlFor="province" className="text-sm leading-7 text-gray-600">{lang.province}</label>
                    <select name="province" id="province" className="w-full px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-white border-2 rounded-lg outline-none border-neutral-500 focus:border-red-500" value={formFields.province} onChange={handleChange}>
                      <option value="" disabled>--Select your province--</option>
                      {Province.map((item, key) => (
                        <option value={item.name} key={key}>{item.name}</option>
                      ))}
                    </select>
                    {errors.province && <p className="text-xs italic text-red-500">{errors.province}</p>}
                  </div>
                </div>

                <div className="w-1/2 p-2">
                  <div className="relative">
                    <label htmlFor="services" className="text-sm leading-7 text-gray-600">{lang.services}</label>
                    <select name="services" id="services" className="w-full px-3 py-1 text-base leading-8 text-gray-700 transition-colors duration-200 ease-in-out bg-white border-2 rounded-lg outline-none border-neutral-500 focus:border-red-500" value={formFields.services} onChange={handleChange}>
                      <option value="" disabled>--Please Choose an Option--</option>
                      {OurServices.map((item, key) => (
                        <option value={item.services} key={key}>{item.services}</option>
                      ))}
                    </select>
                    {errors.services && <p className="text-xs italic text-red-500">{errors.services}</p>}
                  </div>
                </div>

                <div className="w-full p-2">
                  <div className="relative">
                    <label htmlFor="message" className="text-sm leading-7 text-gray-600">{lang.help}</label>
                    <textarea placeholder='' id="message" name="message" className="w-full h-32 px-3 py-1 text-base leading-6 text-gray-700 transition-colors duration-200 ease-in-out bg-white border-2 rounded-lg outline-none border-neutral-500 focus:border-red-500" value={formFields.message} onChange={handleChange}></textarea>
                    {errors.message && <p className="text-xs italic text-red-500">{errors.message}</p>}
                  </div>
                </div>

                <div className="w-full p-2">
                  <button type="submit" className="flex mx-auto text-lg rounded submit focus:outline-none">Submit</button>
                </div>
              </form>
            </div>
            <div className="flex items-center justify-start p-4 border-t border-orange-200 border-solid rounded-b md:justify-end">
              <button className="text-xs font-bold text-red-500 uppercase outline-none background-transparent focus:outline-none hover:text-red-500" type="button" onClick={hide}>
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
