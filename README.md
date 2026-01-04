# 📚 Knowle

Platform berbagi pengetahuan untuk komunitas Indonesia. Tulis, baca, dan diskusi bersama.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-green?logo=mongodb)

## ✨ Fitur

- 📝 **Tulis Artikel** - Editor modern dengan formatting lengkap
- 💬 **Tanya Jawab** - Forum diskusi dan Q&A
- 🔍 **Pencarian** - Temukan artikel dengan mudah
- 👤 **Profil** - Kelola profil dan lihat statistik
- 💾 **Draft Privat** - Simpan tulisan sebelum dipublikasi
- 📱 **Responsif** - Tampilan optimal di semua device

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (Access & Refresh Token)
- **Image Storage:** ImageKit
- **Styling:** CSS-in-JS + Bootstrap

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- ImageKit account (opsional)

### Installation

1. Clone repository
```bash
git clone https://github.com/romitechdev/knowle.git
cd knowle
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env
```

Edit `.env` dengan konfigurasi kamu:
```env
MONGODBURI=mongodb+srv://...
JWT_SECRET_KEY=your-secret-key
publicImg=your-imagekit-public-key
privateImg=your-imagekit-private-key
urlEndpoint=https://ik.imagekit.io/your_id
```

4. Run development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── api/          # API routes
│   ├── book/         # Book pages (add, edit, publish, questions)
│   ├── profile/      # User profile
│   └── ...
├── components/       # Reusable components
├── controllers/      # Business logic
├── models/           # Mongoose models
└── utils/            # Utilities
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy!

## 📄 License

MIT License - bebas digunakan dan dimodifikasi.

## 👤 Author

**Romi**

- GitHub: [@romitechdev](https://github.com/romitechdev)

---

Made with ❤️ by Romi
