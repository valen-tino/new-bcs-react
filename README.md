# BCS React Frontend

## Project Overview
BCS React is the web client for Bali Connection Services (BCS), built as a single page application for showcasing visa and travel services. The site features a dynamic landing page, announcement listings, testimonial management, image galleries and an administrative CMS login. Content, media and UI text are fetched from cloud services to allow live updates without redeploying the site.

## Architecture
- **Component based UI** – Pages under `src/pages` assemble section components from `src/sections` and reusable widgets from `src/components`.
- **Context driven state** – Global state such as language, authentication, CMS data, notifications and announcements is handled via React Context providers in `src/contexts`.
- **Remote data sources** – Firebase supplies authentication, Firestore database access and Cloud Storage, while Cloudinary manages optimized media assets.
- **Static generation** – Vite bundles the application with code‑splitting and TailwindCSS styling for efficient deployment.

## Technologies & Libraries
- React 18, React Router DOM and Vite for SPA development
- TailwindCSS for utility‑first styling
- Firebase (`auth`, `firestore`, `storage`) for backend services
- Cloudinary for image uploads and delivery
- AOS, React Responsive Carousel, React Scroll, React Toastify and Heroicons for UI/UX enhancements
- TinyMCE for rich text editing within the CMS

## Project Structure
```
root
├─ src/
│  ├─ pages/             # Route level pages (Announcements, Gallery, Testimonials, CMS login…)
│  ├─ sections/          # Landing page sections (header, footer, services, about, team…)
│  ├─ components/        # Reusable UI components and image upload tools
│  ├─ contexts/          # React Context providers (Auth, CMS, Language, Notification…)
│  ├─ services/          # API services (e.g. CloudinaryService)
│  ├─ utils/             # Helpers (slug utils, SEO generator, Firebase lazy loader…)
│  ├─ scripts/           # Data migration and Firebase population scripts
│  ├─ data/              # Static JSON/JS data sources
│  └─ assets/            # Static image assets
├─ public/               # Static files served directly
├─ docs/                 # Troubleshooting and deployment notes
└─ app.yaml              # Wasmer deployment configuration
```

## Running the Project
1. **Prerequisites**
   - Node.js ≥14 and npm
   - Cloudinary and Firebase project credentials
2. **Clone and install**
   ```bash
   git clone <repo-url>
   cd new-bcs-react
   npm install
   ```
3. **Configure environment**
   Create a `.env` file and supply the Firebase keys (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_MEASUREMENT_ID`) and Cloudinary settings (`VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_API_KEY`, `VITE_CLOUDINARY_API_SECRET`, optional `VITE_CLOUDINARY_UPLOAD_PRESET`).
4. **Start development server**
   ```bash
   npm run dev
   ```
5. **Create production build**
   ```bash
   npm run build
   ```
6. **Preview production build**
   ```bash
   npm run preview
   ```

## Notes
The project currently has no automated test suite. Build output is generated into the `dist/` directory for deployment.
