# 📚 Knowle

A knowledge-sharing platform for the Indonesian community. Write, read, and discuss together.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-green?logo=mongodb)

## ✨ Features

- 📝 **Write Articles** - Modern editor with full formatting
- 💬 **Q&A** - Discussion forum and Q&A
- 🔍 **Search** - Find articles easily
- 👤 **Profile** - Manage your profile and view statistics
- 💾 **Private Drafts** - Save your writing before publishing
- 📱 **Responsive** - Optimal display on all devices

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
- ImageKit account (optional)

### Installation

1. Clone the repository
```bash
git clone https://github.com/romitechdev/knowle.git
cd knowle
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
MONGODBURI=mongodb+srv://...
JWT_SECRET_KEY=your-secret-key
publicImg=your-imagekit-public-key
privateImg=your-imagekit-private-key
urlEndpoint=https://ik.imagekit.io/your_id
```

4. Run the development server
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

1. Push to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set the environment variables
4. Deploy!

## 📄 License

MIT License - free to use and modify.

## 👤 Author

**Romi**

- GitHub: [@romitechdev](https://github.com/romitechdev)

---

Made with ❤️ by Romi
