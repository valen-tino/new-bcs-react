import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCMS } from '../../contexts/CMSContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/cms/Sidebar';
import Header from '../../components/cms/Header';
import VisaAbroadEditor from '../../components/cms/VisaAbroadEditor';
import VisaBaliEditor from '../../components/cms/VisaBaliEditor';
import ServicesEditor from '../../components/cms/ServicesEditor';
import AboutEditor from '../../components/cms/AboutEditor';
import GalleryEditor from '../../components/cms/GalleryEditor';
import TestimonialsEditor from '../../components/cms/TestimonialsEditor';
import ContactRequestsViewer from '../../components/cms/ContactRequestsManager';
import AdminManager from '../../components/cms/AdminManager';
import DashboardOverview from '../../components/cms/Overview';

function Dashboard() {
  const { currentUser, isAdmin, logout } = useAuth();
  const { loading } = useCMS();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser || !isAdmin) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full border-b-2 border-orange-600 animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading CMS...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />;
      case 'visa-abroad':
        return <VisaAbroadEditor />;
      case 'visa-bali':
        return <VisaBaliEditor />;
      case 'services':
        return <ServicesEditor />;
      case 'about':
        return <AboutEditor />;
      case 'gallery':
        return <GalleryEditor />;
      case 'testimonials':
        return <TestimonialsEditor />;
      case 'contact-requests':
        return <ContactRequestsViewer />;
      case 'admin-manager':
        return <AdminManager />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      {/* Main content */}
      <div className="w-full">
        {/* Header */}
        <Header 
          currentUser={currentUser}
          logout={logout}
          setSidebarOpen={setSidebarOpen}
        />
        
        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;