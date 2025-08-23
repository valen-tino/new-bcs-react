import React, { useState } from 'react';
import { db } from '../../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const defaultAnnouncementsText = {
  English: {
    pageTitle: "Announcements",
    pageDescription: "Stay updated with the latest news and important announcements from BCS",
    allAnnouncements: "All Announcements",
    active: "Active",
    scheduled: "Scheduled",
    noAnnouncements: "No announcements found",
    readMore: "Read Full Announcement",
    backToHome: "Back to Home",
    backToAnnouncements: "Back to Announcements",
    published: "Published",
    scheduledFor: "Scheduled for",
    lastUpdated: "Last updated",
    featured: "Featured",
    loading: "Loading announcements..."
  },
  Indonesia: {
    pageTitle: "Pengumuman",
    pageDescription: "Tetap terupdate dengan berita terbaru dan pengumuman penting dari BCS",
    allAnnouncements: "Semua Pengumuman",
    active: "Aktif",
    scheduled: "Terjadwal",
    noAnnouncements: "Tidak ada pengumuman ditemukan",
    readMore: "Baca Pengumuman Lengkap",
    backToHome: "Kembali ke Beranda",
    backToAnnouncements: "Kembali ke Pengumuman",
    published: "Dipublikasikan",
    scheduledFor: "Dijadwalkan untuk",
    lastUpdated: "Terakhir diperbarui",
    featured: "Unggulan",
    loading: "Memuat pengumuman..."
  }
};

function AnnouncementsUITextPopulator({ onPopulated }) {
  const [isPopulating, setIsPopulating] = useState(false);

  const handlePopulate = async () => {
    setIsPopulating(true);
    try {
      // Check if announcements UI text already exists
      const uiTextDoc = await getDoc(doc(db, 'content', 'uiText'));
      const existingData = uiTextDoc.exists() ? uiTextDoc.data() : {};
      
      // Add announcements section
      const updatedData = {
        ...existingData,
        announcements: defaultAnnouncementsText
      };
      
      await setDoc(doc(db, 'content', 'uiText'), updatedData, { merge: true });
      toast.success('Announcements UI text populated successfully!');
      
      // Notify parent component to refresh
      if (onPopulated) {
        onPopulated();
      }
      
    } catch (error) {
      console.error('Error populating announcements UI text:', error);
      toast.error('Failed to populate announcements UI text');
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h4 className="text-sm font-medium text-blue-800">
            📢 Announcements UI Text Setup
          </h4>
          <div className="mt-2 text-sm text-blue-700">
            <p>Initialize the announcements section with default English and Indonesian text values.</p>
            <p className="mt-1 text-xs">
              This will add 14 text fields for announcements pages including page titles, buttons, status labels, and navigation text.
            </p>
          </div>
          <div className="mt-3">
            <button
              onClick={handlePopulate}
              disabled={isPopulating}
              className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPopulating ? (
                <>
                  <svg className="inline w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Populating...
                </>
              ) : (
                'Populate Announcements UI Text'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementsUITextPopulator;