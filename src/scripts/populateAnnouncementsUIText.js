// Script to populate announcements UI text in Firebase
import { db } from '../config/firebase.js';
import { doc, setDoc, getDoc } from 'firebase/firestore';

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

export const populateAnnouncementsUIText = async () => {
  try {
    // Check if announcements UI text already exists
    const uiTextDoc = await getDoc(doc(db, 'content', 'uiText'));
    const existingData = uiTextDoc.exists() ? uiTextDoc.data() : {};
    
    // Add announcements section if it doesn't exist
    if (!existingData.announcements) {
      const updatedData = {
        ...existingData,
        announcements: defaultAnnouncementsText
      };
      
      await setDoc(doc(db, 'content', 'uiText'), updatedData, { merge: true });
      console.log('✅ Announcements UI text populated successfully');
      return true;
    } else {
      console.log('ℹ️ Announcements UI text already exists');
      return false;
    }
  } catch (error) {
    console.error('❌ Error populating announcements UI text:', error);
    throw error;
  }
};

// Run the population if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  populateAnnouncementsUIText()
    .then(() => {
      console.log('Script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}