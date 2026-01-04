// Seed script for dummy data
// Run with: node scripts/seed.js

const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODBURI || "";

// Define schemas directly here to avoid import issues
const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    desc: String,
    password: String,
    pp: String,
    bookmark: [{ type: mongoose.Types.ObjectId, ref: "posts" }],
});

const bookSchema = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    title: String,
    notes: String,
    time: String,
    cover: String,
    tag: String,
});

const User = mongoose.models.user || mongoose.model("user", userSchema);
const Book = mongoose.models.book || mongoose.model("book", bookSchema);

const bookTitles = [
    "Panduan Belajar JavaScript Modern",
    "Mengenal React dari Dasar",
    "Tips Produktivitas untuk Developer",
    "Cara Membangun API dengan Node.js",
    "Pengenalan TypeScript untuk Pemula",
    "Tutorial MongoDB untuk Aplikasi Web",
    "Memahami Git dan GitHub",
    "Belajar CSS Grid dan Flexbox",
    "Mengoptimalkan Performa Website",
    "Pengenalan Machine Learning",
    "Dasar-Dasar Python Programming",
    "Membangun Aplikasi Mobile dengan React Native",
    "Keamanan Aplikasi Web Modern",
    "Cloud Computing untuk Pemula",
    "Pengenalan Docker dan Containerization",
    "Algoritma dan Struktur Data",
    "Next.js: Framework React untuk Production",
    "Database Design Best Practices",
    "Mengelola State dengan Redux",
    "Testing Aplikasi JavaScript",
    "GraphQL vs REST API",
    "Tailwind CSS untuk UI Modern",
    "Microservices Architecture",
    "CI/CD Pipeline untuk Developer",
    "Web Accessibility (a11y) Guide",
];

const questionTitles = [
    "Bagaimana cara mengatasi error CORS?",
    "Apa perbedaan let dan const di JavaScript?",
    "Mengapa React hooks penting?",
    "Bagaimana cara deploy ke Vercel?",
    "Apa itu Server Side Rendering?",
    "Cara mengoptimalkan query MongoDB?",
    "Bagaimana implementasi authentication JWT?",
    "Apa perbedaan SQL dan NoSQL?",
    "Cara mengatasi memory leak di Node.js?",
    "Bagaimana cara belajar coding yang efektif?",
    "Apa itu clean code dan SOLID principles?",
    "Bagaimana cara menangani error di JavaScript?",
    "Apa keuntungan TypeScript dibanding JavaScript?",
    "Kapan harus menggunakan useEffect vs useMemo?",
    "Bagaimana cara membuat responsive design?",
];

const dummyNotes = [
    "<p>Ini adalah konten placeholder untuk artikel ini. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>",
    "<p>Materi pembelajaran yang komprehensif untuk membantu kamu memahami konsep-konsep fundamental dalam programming.</p><p>Dengan mengikuti tutorial ini, kamu akan dapat:</p><ul><li>Memahami dasar-dasar</li><li>Menerapkan konsep</li><li>Membuat project sendiri</li></ul>",
    "<p>Dalam artikel ini kita akan membahas berbagai tips dan trik yang berguna untuk meningkatkan skill programming kamu.</p><p>Ingat, practice makes perfect!</p>",
];

const coverImages = [
    "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&h=400&fit=crop",
    "",
    "",
];

function getRandomDate() {
    const days = Math.floor(Math.random() * 30) + 1;
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const month = months[Math.floor(Math.random() * 12)];
    const year = 2024;
    return `${days} ${month} ${year}`;
}

async function seedDatabase() {
    try {
        console.log("Connecting to MongoDB...");
        console.log("URI:", MONGODB_URI.substring(0, 30) + "...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected!");

        // Create a dummy user
        console.log("Creating dummy user...");
        const user = await User.create({
            name: "Penulis Demo",
            username: "penulis_demo",
            desc: "<p>Akun demo untuk testing pagination. Saya suka menulis tentang teknologi.</p>",
            password: "$2b$10$dummyhashforseeding12345678901234567890",
            pp: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
        });
        console.log("Dummy user created:", user.username);

        const books = [];

        // Create Publish books
        for (let i = 0; i < bookTitles.length; i++) {
            books.push({
                user: user._id,
                title: bookTitles[i],
                notes: dummyNotes[i % dummyNotes.length],
                time: getRandomDate(),
                cover: coverImages[i % coverImages.length],
                tag: "Publish",
            });
        }

        // Create Question books
        for (let i = 0; i < questionTitles.length; i++) {
            books.push({
                user: user._id,
                title: questionTitles[i],
                notes: dummyNotes[i % dummyNotes.length],
                time: getRandomDate(),
                cover: coverImages[(i + 3) % coverImages.length],
                tag: "Question",
            });
        }

        // Create some private books
        for (let i = 0; i < 10; i++) {
            books.push({
                user: user._id,
                title: `Draft Artikel ${i + 1}`,
                notes: dummyNotes[i % dummyNotes.length],
                time: getRandomDate(),
                cover: "",
                tag: "",
            });
        }

        console.log(`Inserting ${books.length} books...`);
        await Book.insertMany(books);
        console.log("Done! Books inserted successfully.");

        console.log("\n=== Summary ===");
        console.log(`User: ${user.username}`);
        console.log(`Publish books: ${bookTitles.length}`);
        console.log(`Question books: ${questionTitles.length}`);
        console.log(`Private books: 10`);
        console.log(`Total: ${books.length}`);

    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await mongoose.disconnect();
        console.log("\nDisconnected from MongoDB");
    }
}

seedDatabase();
