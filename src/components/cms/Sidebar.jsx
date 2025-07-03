import React from 'react';
import { useCMS } from '../../contexts/CMSContext';
import { logoIcon } from '../../sections/all/allpics';
import { 
  GlobeAltIcon,
  HandRaisedIcon,
  InformationCircleIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  UserGroupIcon,
  BellAlertIcon,
  LanguageIcon
} from '@heroicons/react/24/outline';

function Sidebar({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen }) {
  const { unreadRequests } = useCMS();

  const menuItems = [
    {
      id: 'overview',
      name: 'Dashboard Overview',
      icon: <BellAlertIcon className="h-5 w-5" />
    },
    {
      id: 'visa-abroad',
      name: 'Visa Assistance Abroad',
      icon: <GlobeAltIcon className="h-5 w-5" />
    },
    {
      id: 'visa-bali',
      name: 'Visa Assistance in Bali',
      icon: <GlobeAltIcon className="h-5 w-5" />
    },
    {
      id: 'services',
      name: 'Services',
      icon: <HandRaisedIcon className="h-5 w-5" />
    },
    {
      id: 'about',
      name: 'About Us',
      icon: <InformationCircleIcon className="h-5 w-5" />
    },
    {
      id: 'gallery',
      name: 'Gallery',
      icon: <PhotoIcon className="h-5 w-5" />
    },
    {
      id: 'testimonials',
      name: 'Testimonials',
      icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: <BellAlertIcon className="h-5 w-5" />
    },
    {
      id: 'uitext',
      name: 'UI Text Editor',
      icon: <LanguageIcon className="h-5 w-5" />
    },
    {
      id: 'contact-requests',
      name: 'Contact Requests',
      icon: <EnvelopeIcon className="h-5 w-5" />,
      badge: unreadRequests > 0 ? unreadRequests : null
    },
    {
      id: 'admin-manager',
      name: 'Admin Manager',
      icon: <UserGroupIcon className="h-5 w-5" />
    }
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="flex fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="flex relative flex-col flex-1 w-full max-w-xs bg-white">
            <div className="absolute top-0 right-0 pt-2 -mr-12">
              <button
                className="flex justify-center items-center ml-1 w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SidebarContent menuItems={menuItems} activeSection={activeSection} setActiveSection={setActiveSection} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-1 h-0 bg-white border-r border-gray-200">
            <SidebarContent menuItems={menuItems} activeSection={activeSection} setActiveSection={setActiveSection} />
          </div>
        </div>
      </div>
    </>
  );
}

function SidebarContent({ menuItems, activeSection, setActiveSection }) {
  return (
    <>
      <div className="flex flex-shrink-0 items-center px-4 h-16 bg-orange-600">
        <img className="w-auto h-8" src={logoIcon} alt="BCS" />
        <span className="ml-2 text-lg font-semibold text-white">Dashbard</span>
      </div>
      <div className="flex overflow-y-auto flex-col flex-1">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`${
                activeSection === item.id
                  ? 'bg-orange-100 text-orange-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors duration-150`}
            >
              <span className={`${
                activeSection === item.id ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'
              } mr-3 flex-shrink-0`}>
                {item.icon}
              </span>
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span className="ml-3 inline-block py-0.5 px-2 text-xs font-medium rounded-full bg-red-100 text-red-800">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}

export default Sidebar;