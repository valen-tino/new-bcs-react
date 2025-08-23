import { db } from '../config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Populate UI Text Editor with existing content from the site
 * This script takes all the existing static content and puts it into the UI Text system
 */
export const populateUITextContent = async () => {
  try {
    console.log('🚀 Starting UI Text population...');

    // Complete UI Text content structure with all existing content
    const uiTextContent = {
      // Hero section (from header/content.jsx)
      hero: {
        English: {
          heading: "Make a Visa Abroad?",
          subheading: "Get consultation with us now!",
          wa: "Contact Us Today!",
          lm: "Learn More"
        },
        Indonesia: {
          heading: "Cari Visa Keluar Negeri?",
          subheading: "Dapatkan konsultasi visa dengan kami sekarang!",
          wa: "Hubungi hari ini!",
          lm: "Layanan Kami"
        }
      },

      // Navigation section (from nav/content.jsx)
      nav: {
        English: {
          home: "Home",
          services: "Services",
          about: "About Us",
          team: "Team",
          gallery: "Gallery",
          testi: "Testimonials",
          contactus: "Contact Us",
          email: "Request Form"
        },
        Indonesia: {
          home: "Home",
          services: "Services",
          about: "About Us",
          team: "Tim",
          gallery: "Gallery",
          testi: "Testimoni / Kata Mereka",
          contactus: "Contact Us",
          email: "Request Form"
        }
      },

      // Services section (from services/content.jsx)
      services: {
        English: {
          vaa: "Visa Assistance Abroad",
          vaadesc: "We serve the processing of visa applications abroad through the embassies of foreign countries in Indonesia.<br>We will help and provide free consultation at the office, for all visa applications to any country with an embassy in Indonesia.<br>For more than 20 years we have taken care of and helped submission of visa applications for the following countries.",
          vaasub: "Where do you want to go?",
          vab: "Visa Assistance in Bali",
          vabdesc: "We also offer visa assistance services in Bali, Indonesia. Our services range from helping you apply for a visa to providing the necessary documents for your application. We also assist with any enquiries around the process of obtaining a visa.",
          wedding: "Wedding Ceremony Organizer",
          weddingsub: "For Bali Only.",
          weddingdesc: "A Wedding is a very important event in Indonesia, especially in Bali. Getting married in Bali for Indonesian and Expat couples.<br><br>To get legally married in Bali, please kindly Contact Us. We will guide you from A to Z until you have a successful outcome. To be legally married in Indonesia requires a religious ceremony.<br>Our Company can organize religious ceremony as follows :<br>- As Moslem<br>- As Christians<br>- As Hindu<br>- As Buddhist",
          weddingbtn: "Our Gallery",
          translate: "Translation Documents",
          translatedesc: "BCS will also provide the services of Translation any documents into any languages with a certified translator Sworn in Indonesia.<br><br>Provided by Sworn Translation Services in Indonesia for Bahasa Indonesia, English, Chinese, Japanese, Korean, German, Arabic, Thai, Vietnamese, Russian, Spanish, French, Dutch, Italian, etc.",
          travel: "Travel Insurance",
          traveldesc: "Learn more about our product and get some travel tips while you are preparing for your next vacation.<br><br>To reserve and book your travel insurance online, kindly please contact us",
          others: "Other Services",
          otherssub: "We provide document management",
          email: "Request Form",
          wa: "Lets Talk"
        },
        Indonesia: {
          vaa: "Visa Liburan, Visa Bisnis Keluar Negeri",
          vaadesc: "Kami melayani pengurusan visa aplikasi keluar negeri melalui kedutaan - kedutaan Negara Asing di Indonesia.<br>Kami akan membantu dan memberikan konsultasi gratis di kantor, untuk semua permohonan visa aplikasi ke Negara manapun yang ada kedutaannya di Indonesia.<br>Lebih dari 20 tahun kami mengurusi dan membantu pengajuan visa aplikasi untuk negara negara berikut ini.",
          vaasub: "Mau kemana?",
          vab: "Visa di Indonesia / Bali",
          vabdesc: "Kami juga mengurusi dan melayani pengurusan semua jenis visa dan dokumen bagi Expatriat/Warga Negara Asing / Turis yang datang dan tingat di Indonesia.<br>Lebih dari 15 tahun kami telah berpengalaman mengurusi jasa pengurusan kelengkapan dokumen melalui kantor Imigrasi dan kantor Pemerintahan yang terkait lainnya.",
          wedding: "Upacara Pernikahan",
          weddingsub: "Khusus untuk Acara Nikah Bali",
          weddingdesc: "Pernikahan atau perkawinan adalah hal yang sangat penting dan Sakral (suci), Pernikahan campur atau tidak campur bisa dilaksanakan proses pernikahan di Bali, bisa dilaksanakan Pernikahan di tempat Ibadah atau dilaksanakan di Hotel/Villa atau tempat yang bisa ditentukan oleh pengantin/pasangan calon Pernikahan.<br><br>Kantor kami akan membantu dan memperlancar proses administrasi perkawinan yang resmi dan sah baik menurut Agama maupun sesuai Undang-undang / hukum Negara.<br>Kami, BCS akan membantu proses pernikahan sebagai berikut:<br>- Agama Islam<br>- Agama Kristen Katolik / Protestant<br>- Agama Hindu<br>- Agama Budha<br>- Agama Konghucu",
          weddingbtn: "Our Gallery",
          translate: "Terjemahkan Dokumen",
          translatedesc: "BCS juga akan menyediakan jasa Penerjemahan dokumen apapun ke dalam bahasa apapun dengan penerjemah tersumpah bersertifikat di Indonesia.<br><br>Disediakan oleh Layanan Terjemahan Tersumpah di Indonesia untuk Bahasa Indonesia, Inggris, Mandarin, Jepang, Korea, Jerman, Arab, Thailand, Vietnam, Rusia, Spanyol, Prancis, Belanda, Italia, dll.",
          travel: "Asuransi Perjalanan",
          traveldesc: "Pelajari lebih lanjut tentang produk kami dan dapatkan beberapa tips perjalanan saat Anda mempersiapkan liburan berikutnya.<br><br>Untuk memesan dan memesan asuransi perjalanan Anda secara online, silakan hubungi kami",
          others: "Layanan Lainnya",
          otherssub: "Kami melayani pengurusan dokumen",
          email: "Request Form",
          wa: "Hubungi Kami"
        }
      },

      // About section (from about/content.jsx)
      about: {
        English: {
          heading: "About Us",
          desc: "BCS ( CV. Bali Connection Service) was established in 2005 until now. Our company has many years of experience assisting with visa processing abroad and within the country for both Domestic Tourists and Expatriates / Foreign Residents in Indonesia.<br><br>We have more than 20 years of experience helping with all types of travel documents, including visas abroad and permits in Bali / Indonesia. Especially visa assistance abroad, as we know that the Embassy refuses many Visa applicants access because their documents are incomplete.<br><br>That's why We, BCS, specialize in all aspects of visa requirements. We can guide you step by step into your visa application until you get a successful outcome—the Indonesian Immigration Office.<br><br>Our friendly staff will assist you and provide a proper and complete consultation, especially in;<br>Holiday Visa,<br>Business Visa,<br>Retirement Visa,<br>Spouse Visa in Australia,<br>Visa Extension,<br>Social Visa,<br>Etc.<br>We, BCS, will guarantee that 99% of visas will be approved.<br><br>WE SERVE YOU SINCERELY BECAUSE YOUR SATISFACTION IS OUR GOAL."
        },
        Indonesia: {
          heading: "Tentang Kami",
          desc: "BCS ( CV. Bali Connection Service), didirikan sejak tahun 2005 sampai saat ini. Perusahaan kami tentunya telah memiliki pengalaman bertahun-tahun dalam membantu pengurusan visa keluar negeri dan dalam Negeri baik untuk Wisatawan Domestik maupun dan Warga Ekspatriat/ Warga Asing di Indonesia.<br><br>Dengan memiliki pengalaman lebih dari 20 tahun itulah, kami sungguh mengetahui dokumen dokumen yang diperlukan untuk pengurusan visa keluar Negeri, dengan Jaminan 99 % semua visa aplikasi disetujui oleh pihak Kedutaan.Teristimewa pengurusan Visa aplikasi keluar negeri. Seperti yang kita ketahui bahwa banyak pemohon Visa yang ditolak visanya oleh Kedutaan dikarenakan alasan dokumen visa aplikasi tidak lengkap.<br><br>Oleh karena itu Kantor kami, BCS akan memberikan konsultasi dan saran yang benar untuk melengkapi semua persyaratan dokumen aplikasi sebelum diajukan ke Kedutaan / Konsulat terkait. Disamping itu, kami juga membantu untuk pengurusan visa kunjungan ke Indonesia, terutama Bali seperti:<br>Perpanjangan VOA,<br>Visa B211,<br>Visa Social Budaya,<br>Kitas Pensiun/Kerja/Family,<br>PMA,<br>Dan Lain-lain.<br><br>KAMI MELAYANI ANDA DENGAN SETULUS HATI KARENA KEPUASAN ANDA ADALAH TUJUAN KAMI."
        }
      },

      // Team section (from team/content.jsx)
      team: {
        English: {
          heading: "Our Team"
        },
        Indonesia: {
          heading: "Tim Kami"
        }
      },

      // Gallery section (from gallery/content.jsx)
      gallery: {
        English: {
          heading: "Our Gallery"
        },
        Indonesia: {
          heading: "Galeri Kami"
        }
      },

      // Testimonial section
      testimonial: {
        English: {
          heading: "Guest Testimonies",
          seeall: "See More Testimonials"
        },
        Indonesia: {
          heading: "Testimoni Tamu",
          seeall: "Lihat Semua Testimoni"
        }
      },

      // Footer section (from footer/content.jsx)
      footer: {
        English: {
          desc: "Don't Hesitate to Contact Us for further inquiries!",
          email: "Request Form",
          wa: "Lets Talk",
          desc2: "We arrange all your visa applications to abroad or visas in Bali with a guarantee 99% approved!",
          legal: "Legal And Payment Details",
          legaldetails: "All the payment can be settled by Cash or Transfer to our Bank company account:<br><br>BANK BCA, CAB/ SANUR<br>ACCOUNT NO: 7730316083<br>ACCOUNT NAME: VINSENSIUS JEHAUT<br>SWIFT CODE: CENAIDJA<br>With Business license (SIUP) : 2017/22-08/BPPT/SIUP-K/IV/2016<br>Business Registration Number (NIB) : 0290010222619<br>NPWP : 02.970.886.4-905.000",
          sub: "Legal compliance assured",
          firstlink: "Home",
          secondlink: "Our Services",
          thirdlink: "About Us",
          fourthlink: "Gallery",
          fifthlink: "Testimonial",
          akte: "Notarial Deed",
          copy: "All Rights Reserved"
        },
        Indonesia: {
          desc: "Jangan Ragu untuk Menghubungi Kami untuk info lebih lanjut!",
          email: "Request Form",
          wa: "Hubungi Kami",
          desc2: "Kami mengatur semua aplikasi visa Anda ke luar negeri atau visa di Bali dengan jaminan 99% disetujui!",
          legal: "Detail Hukum Dan Pembayaran",
          legaldetails: "Semua pembayaran dapat diselesaikan secara Tunai atau Transfer ke rekening perusahaan Bank kami:<br><br>BANK BCA, CAB/ SANUR<br>NO REKENING: 7730316083<br>NAMA AKUN: VINSENSIUS JEHAUT<br>KODE SWIFT: CENAIDJA<br>Dengan Surat Izin Usaha (SIUP) : 2017/22-08/BPPT/SIUP-K/IV/2016<br>Nomor Induk Berusaha (NIB) : 0290010222619<br>NPWP : 02.970.886.4-905.000",
          sub: "Kepatuhan hukum terjamin",
          firstlink: "Halaman Utama",
          secondlink: "Layanan Kami",
          thirdlink: "Tentang Kami",
          fourthlink: "Galeri",
          fifthlink: "Testimoni / Kesaksian",
          akte: "Akta Notaris",
          copy: "Hak Cipta Dilindungi"
        }
      },

      // Gallery Page
      galleryPage: {
        English: {
          heading: "Gallery",
          noImages: "No images available yet.",
          backToHome: "Back to Home"
        },
        Indonesia: {
          heading: "Galeri",
          noImages: "Belum ada gambar tersedia.",
          backToHome: "Kembali ke Beranda"
        }
      },

      // Testimonials Page
      testimonialsPage: {
        English: {
          heading: "Guest Testimonies",
          description: "Read what our valued clients have to say about their experiences with our services.",
          backToHome: "Back to Home",
          noTestimonials: "No testimonials available yet."
        },
        Indonesia: {
          heading: "Testimoni Tamu",
          description: "Baca apa yang dikatakan klien kami tentang pengalaman mereka dengan layanan kami.",
          backToHome: "Kembali ke Beranda",
          noTestimonials: "Belum ada testimoni yang tersedia."
        }
      },

      // Contact Form (from dataContactForm.jsx)
      contactForm: {
        English: {
          title: "Contact Us For More Information",
          name: "Name",
          phone: "Phone Number",
          email: "Email Address",
          province: "Select Province",
          services: "Select Services",
          help: "Write a message..."
        },
        Indonesia: {
          title: "Hubungi Kami Untuk Informasi Lebih Lanjut",
          name: "Nama",
          phone: "Nomor Telepon",
          email: "Alamat Email",
          province: "Pilih Provinsi",
          services: "Pilih Layanan",
          help: "Tuliskan pesan disini..."
        }
      },

      // Notification section (from notif/content.jsx)
      notif: {
        English: {
          update: "Need a Easy, Simple, Cheap & Trusted Agent?",
          ck: "Click Here",
          title: "Latest News",
          sub: "Click anywhere to close",
          desc: "Starting March 7, 2022, Indonesia will reopen for all international tourists from 23 countries with Visa On Arrival ( VOA ) to visit BALI<br>(The Visa on Arrival Scheme is only valid for citizens of 23 registered countries).<br><br>Further information :<br>✅ Foreign travelers still have to meet certain requirements to enter Bali during this trial period,<br>✅ Visa on Arrival will return for 23 selected countries, but at this stage it is not a FREE entry that you may use to enter. It appears the visa will be IDR 500,000 ($50 AUD) per person and will allow you to stay up to 30 days (you can also choose to pay for an extension which will give you a 60 day stay). If you are from a country not on the list, you can still visit but you must apply for a B211A visa prior to arrival.<br>Such as proof of payment for a minimum 4 days accommodation booking (proof of residency for KITAS holders), Four nights at one of the approved hotels by the government and must ordered before arriving. After the PCR test at the airport, you go straight to the hotel. Once your results come back, if you are negative, you are free to explore Bali (this only takes a few hours). If you are positive, you will need to isolate (apparently for a period of 3 days but waiting for full confirmation where).<br>*Hotel from the list approved by the Government*<br>✅ PCR test on arrival (tourists are required to wait for a negative result at the accommodation pre-ordered).<br>✅ Fully vaccinated or booster injection, negative PCR test result again on the 3rd day as a guarantee to be virus free.<br>✅ If positive, travelers with virus symptoms, and especially the elderly, will be transferred to the hospital for isolation and treatment.<br>✅ On the 3rd day the traveler has to do the 2nd PCR test at one of the approved hotels by the government to make sure it is virus free. If the test result is negative, the traveler can check-out from the hotel on the 4th day.<br>✅ The traveler must have health insurance that covers covid-19. (Minimum $25,000 USD)<br><br>🔥 BALI IS BACK"
        },
        Indonesia: {
          update: "Perlu Pelayanan yang Mudah, Sederhana, Murah dan Terpercaya?",
          ck: "Klik Disini",
          title: "Berita Terkini",
          sub: "Klik dimanapun untuk tutup",
          desc: "Mulai 7 Maret 2022, Indonesia akan dibuka kembali untuk semua wisatawan internasional dari 23 negara dengan Visa On Arrival ( VOA ) untuk mengunjungi BALI<br>(Skema Visa on Arrival hanya berlaku untuk warga negara dari 23 negara yang terdaftar).<br><br>Informasi lebih lanjut :<br>✅ Wisatawan asing masih harus memenuhi persyaratan tertentu untuk masuk ke Bali selama masa percobaan ini,<br>✅ Visa on Arrival akan kembali untuk 23 negara terpilih, tetapi pada tahap ini bukan entri GRATIS yang dapat Anda gunakan untuk masuk. Tampaknya visa akan menjadi Rp 500.000 ($50 AUD) per orang dan akan memungkinkan Anda untuk tinggal hingga 30 hari (Anda juga dapat memilih untuk membayar perpanjangan yang akan memberi Anda masa tinggal 60 hari). Jika Anda berasal dari negara yang tidak ada dalam daftar, Anda tetap dapat berkunjung tetapi Anda harus mengajukan visa B211A sebelum kedatangan.<br>Seperti bukti pembayaran untuk pemesanan akomodasi minimal 4 hari (bukti tempat tinggal bagi pemegang KITAS), Empat malam di salah satu hotel yang disetujui oleh pemerintah dan harus dipesan sebelum tiba. Setelah tes PCR di bandara, Anda langsung menuju hotel. Setelah hasil Anda kembali, jika Anda negatif, Anda bebas menjelajahi Bali (ini hanya membutuhkan waktu beberapa jam). Jika Anda positif, Anda perlu mengisolasi (ternyata untuk jangka waktu 3 hari tetapi menunggu konfirmasi penuh di mana).<br>*Hotel dari daftar yang disetujui oleh Pemerintah*<br>✅ Tes PCR pada saat kedatangan (turis diharuskan untuk tunggu hasil negatif di penginapan yang dipesan sebelumnya).<br>✅ Vaksin lengkap atau booster injeksi, hasil tes PCR negatif lagi pada hari ke-3 sebagai jaminan bebas virus.<br>✅ Jika positif, pelancong dengan gejala virus, dan terutama orang tua, akan dipindahkan ke rumah sakit untuk isolasi dan perawatan.<br>✅ Pada hari ke-3 traveler harus melakukan tes PCR ke-2 di salah satu hotel yang disetujui oleh pemerintah untuk memastikan bebas virus. Jika hasil tes negatif, traveler bisa check-out dari hotel pada hari ke-4.<br>✅ Traveler harus memiliki asuransi kesehatan yang mengcover covid-19. (Minimum $25.000 USD)<br><br>🔥 BALI KEMBALI"
        }
      }
    };

    // Save to Firebase
    await setDoc(doc(db, 'content', 'uiText'), {
      ...uiTextContent,
      updatedAt: serverTimestamp(),
      populatedAt: serverTimestamp()
    });

    console.log('✅ UI Text content populated successfully!');
    console.log(`📝 Populated ${Object.keys(uiTextContent).length} sections:`);
    Object.keys(uiTextContent).forEach(section => {
      const englishFields = Object.keys(uiTextContent[section].English || {}).length;
      const indonesianFields = Object.keys(uiTextContent[section].Indonesia || {}).length;
      console.log(`   - ${section}: ${englishFields} English fields, ${indonesianFields} Indonesian fields`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Error populating UI Text content:', error);
    throw error;
  }
};