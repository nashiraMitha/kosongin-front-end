# Proyek Capstone: Kosongin (Frontend Web)

## 1. Tentang Proyek

Aplikasi ini merupakan *Frontend Web Application* yang dibangun menggunakan **Next.js 14, React 18, TypeScript, dan Tailwind CSS** sebagai bagian dari proyek akhir (Capstone Project) program Veteran Tech 2026.

**Kosongin** hadir sebagai platform "rem digital" dan ruang refleksi bagi Gen Z dan Milenial untuk membangun kebiasaan belanja yang lebih sadar (*mindful consumption*). Aplikasi web ini fokus pada intervensi perilaku sebelum transaksi (melalui *Impulse Shield*), pelacakan riwayat konsumsi, dan penyediaan wadah aksi nyata melalui *Community Challenges* untuk mengatasi *eco-guilt*.

🧾 **Informasi Proyek**
- **Program/Acara:** Capstone Project - Veteran Tech 2026
- **Tema:** SDG 12 (Responsible Consumption) x SDG 9 (Industry, Innovation and Infrastructure)
- **Kelompok:** Kelompok 1

👥 **Anggota Kelompok**

| No | Nama Lengkap | Peran / Role |
|---|---|---|
| 1 | Tania Syarofina Aliyah | Product Manager |
| 2 | Jeremia Marco Namara | Product Manager |
| 3 | Nawra Nashiramitha Fawza | Front-End Developer |
| 4 | Andhika Rahman | Front-End Developer |
| 5 | Kemal Satya Wibowo | Back-End Developer |
| 6 | Radya Muhammad Ikmal | Back-End Developer |
| 7 | Prasasti Nurul Septiana | UI/UX Designer |

---

## 2. Tech Stack

Project ini dibangun dengan arsitektur modern berbasis React dan Next.js:
- **Language:** TypeScript
- **Frontend Framework:** Next.js 14.x (App Router)
- **UI Library:** React 18.x
- **Styling:** Tailwind CSS + PostCSS
- **UI Components:** Radix UI (unstyled accessible components)
- **HTTP Client:** Axios
- **Icons:** Lucide React + React Icons
- **Charts/Visualizations:** Recharts
- **Authentication:** JWT (json-web-token) + js-cookie
- **Code Quality:** ESLint + Prettier
- **Deployment:** Vercel

---

## 3. Prerequisites & Requirements

Sebelum memulai, pastikan sistem Anda memiliki:
- **Node.js** v18.x atau lebih tinggi ([Download](https://nodejs.org/))
- **npm** v9.x atau lebih tinggi (biasanya disertakan dengan Node.js)
- **Git** untuk cloning repository
- Backend API sudah berjalan (lihat [Backend README](../kosongin-backend/README.md))

Verifikasi instalasi:
```bash
node --version    # Harus v18.x+
npm --version     # Harus v9.x+
```

---

## 4. Struktur Project & Penjelasan Folder

Berikut adalah peta dari direktori src/:

```
src/
├── app/              # Next.js App Router (pages & layouts)
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── [route]/      # Route folders (auth, dashboard, profile, dll)
├── components/       # Reusable React UI components
│   ├── common/       # Common components (Header, Navbar, Footer, Button)
│   ├── dashboard/    # Dashboard-specific components
│   ├── consumption/  # Consumption tracking components
│   ├── wishlist/     # Wishlist-specific components
│   ├── challenges/   # Challenge-specific components
│   └── auth/         # Auth-related components
├── lib/              # Utility functions & helpers
│   ├── api.ts        # Axios instance & API configuration
│   ├── auth.ts       # Authentication helpers
│   └── utils.ts      # Formatter, validators, dll
├── services/         # API service layer
│   ├── authService.ts
│   ├── consumptionService.ts
│   ├── wishlistService.ts
│   ├── challengeService.ts
│   └── ...
├── types/            # TypeScript type definitions
│   ├── user.ts
│   ├── consumption.ts
│   ├── api.ts
│   └── ...
├── assets/           # Static assets (images, icons, fonts)
├── middleware.ts     # Next.js middleware (auth checks, redirects)
└── ...
```

**Penjelasan Folder Penting:**
- `src/app/` - Struktur page aplikasi menggunakan Next.js App Router
- `src/components/` - Reusable UI components yang dapat dipakai di berbagai page
- `src/services/` - Layer komunikasi dengan Backend API
- `src/lib/` - Helper functions untuk formatting, validation, utilities
- `src/types/` - TypeScript interfaces & types untuk type safety
- `src/assets/` - Images, SVG icons, fonts untuk UI

---

## 5. Fitur Utama Aplikasi (UI/UX Perspective)

### 🛡️ **Impulse Shield Page**
- Interface untuk mencatat item yang ingin dibeli
- Countdown timer visual untuk cooling-off period
- Tampilan item dengan deskripsi & kategori
- Button untuk confirm/cancel pembelian setelah cooldown
- Responsive design untuk mobile & desktop

### 📊 **Dashboard & Analytics**
- Overview statistik konsumsi (visual charts menggunakan Recharts)
- Daily/weekly/monthly spending overview
- Category breakdown pie chart
- Trend line chart
- Quick stats cards (total spending, items, challenges done)

### 📝 **Wishlist Page**
- Grid/list view untuk wishlist items
- Item cards dengan image, price, priority
- Filter & search functionality
- Add/remove dari wishlist buttons
- Status indicator (pending, purchased, expired)

### 🏆 **Challenges Page**
- Browse & filter available challenges
- Challenge cards dengan description, participants, progress
- Join challenge button & modal
- Leaderboard view dengan ranking
- Challenge details & history

### 👤 **User Profile & Settings**
- Profile information display & edit form
- Profile picture upload
- Settings panel (notifications, preferences)
- Account security settings
- Activity history / transaction log

---

## 6. Quick Start - Cara Memulai Lokal

### Step 1: Clone Repository
```bash
git clone https://github.com/polaariiss/kosongin-frontend.git
cd kosongin-frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Environment Variables
Salin `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```

Kemudian edit `.env.local` dan isi nilai-nilai berikut:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=Kosongin
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001
```

> **⚠️ Catatan:** 
> - Jangan commit file `.env.local` ke repository
> - Variables dengan prefix `NEXT_PUBLIC_` akan visible di browser
> - Backend API harus sudah berjalan di port yang sesuai

### Step 4: Jalankan Development Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3001`

### Step 5: Buka Browser
```
http://localhost:3001
```

---

## 7. Available Scripts

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Jalankan development server dengan hot reload |
| `npm run build` | Build production-ready aplikasi |
| `npm start` | Jalankan production server |
| `npm run lint` | Cek code style dengan ESLint |

---

## 8. UI Components & Styling

### Component Libraries yang Digunakan
- **Radix UI** - Unstyled, accessible components sebagai base
- **Tailwind CSS** - Utility-first CSS untuk styling
- **Lucide React** - SVG icons library
- **React Icons** - Additional icon sets
- **Recharts** - Charts & visualizations untuk dashboard

### Styling Convention
- Gunakan Tailwind CSS utility classes untuk styling
- Responsive design dengan Tailwind breakpoints (sm, md, lg, xl)
- Dark mode support (optional, configurable)
- Consistent color palette dari design system

### Component Structure Example
```typescript
// src/components/dashboard/DashboardCard.tsx
interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;
}

export default function DashboardCard({ title, value, icon, trend }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && <p className="text-green-600 text-sm mt-1">+{trend}%</p>}
        </div>
        <div className="text-3xl text-blue-600">{icon}</div>
      </div>
    </div>
  );
}
```

---

## 9. API Integration Overview

Frontend terhubung ke Backend API untuk mengambil & mengirim data. Untuk dokumentasi lengkap endpoints & database, lihat [Backend README](../kosongin-backend/README.md).

### Konfigurasi API
```env
# Development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# Production  
NEXT_PUBLIC_API_BASE_URL=https://postgres-production-53aa.up.railway.app/api
```

### Authentication Flow
1. User login via login form
2. Backend mengembalikan JWT token
3. Token disimpan di cookies/localStorage
4. Setiap API request otomatis mengirim token di header
5. Backend verifikasi token & return protected data

Untuk detail API endpoints lengkap, lihat Backend API Documentation di `/api/docs` (Scalar UI)

---

## 10. Environment Variables

### Development (`.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=Kosongin
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001
```

### Production (Vercel)
Set di Vercel Dashboard → Project Settings → Environment Variables:
```env
NEXT_PUBLIC_API_BASE_URL=https://postgres-production-53aa.up.railway.app/api
NEXT_PUBLIC_APP_NAME=Kosongin
NEXT_PUBLIC_APP_URL=https://kosongin.vercel.app
NEXT_PUBLIC_FRONTEND_URL=https://kosongin.vercel.app
```

Untuk dokumentasi lengkap, lihat `.env.example`

---

## 11. Production Deployment (Vercel)

### Production URL
```
🌐 https://kosongin.vercel.app
```

### Deploy via GitHub (Recommended)
1. Push code ke GitHub repository
2. Buka [vercel.com](https://vercel.com) dan sign in
3. Klik "Add New Project"
4. Select repository `kosongin-frontend`
5. Configure environment variables:
   - `NEXT_PUBLIC_API_BASE_URL=https://postgres-production-53aa.up.railway.app/api`
   - `NEXT_PUBLIC_APP_URL=https://kosongin.vercel.app`
   - `NEXT_PUBLIC_FRONTEND_URL=https://kosongin.vercel.app`
6. Click "Deploy"

Automatic deployments terjadi setiap push ke main branch.

### Deploy via CLI
```bash
npm install -g vercel
vercel                  # Preview deployment
vercel --prod          # Production deployment
```

---

## 12. Common Development Tasks

### Membuat Component Baru
```bash
# src/components/MyComponent.tsx
```

### Menambah Page Baru
```bash
# src/app/my-route/page.tsx
# src/app/my-route/layout.tsx (opsional)
```

### Menambah API Service
```typescript
// src/services/myService.ts
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const myService = {
  getData: async () => {
    const response = await axios.get(`${API_BASE}/endpoint`);
    return response.data;
  },

  postData: async (payload) => {
    const response = await axios.post(`${API_BASE}/endpoint`, payload);
    return response.data;
  },
};
```

### Styling dengan Tailwind
```typescript
<div className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
  <p className="text-lg font-bold">Title</p>
  <p className="text-sm text-gray-100 mt-2">Description</p>
</div>
```

---

## 13. Troubleshooting

### Port 3001 sudah terpakai
```bash
PORT=3002 npm run dev
```

### Backend API tidak bisa diakses
- Verifikasi Backend sudah berjalan
- Check `NEXT_PUBLIC_API_BASE_URL` di `.env.local`
- Verifikasi CORS di Backend
- Check network tab di browser DevTools

### Hot reload tidak berfungsi
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### TypeScript build errors
```bash
rm -rf .next
npm run build
```

### Tailwind styling tidak berubah
- Verifikasi file ada di `src/**/*.{tsx,ts}`
- Restart dev server
- Clear browser cache

---

## 14. Kontribusi & Feedback

Untuk reporting bugs atau request features:
```
https://github.com/polaariiss/kosongin-frontend/issues
```

**Hubungi tim Frontend:**
- **Nawra Nashiramitha Fawza** - Front-End Developer
- **Andhika Rahman** - Front-End Developer

---

## 📄 Lisensi

Proyek ini dirilis di bawah lisensi **ISC**. Lihat [LICENSE](LICENSE) untuk detail lebih lanjut.

---

**Last Updated:** May 24, 2026  
**Frontend Production:** https://kosongin.vercel.app/
