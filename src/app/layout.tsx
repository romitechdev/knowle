import type { Metadata } from "next";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
    // MetadataBase for Vercel
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://knowle.vercel.app"),

    // Basic Meta
    title: "Knowle - Platform Menulis & Berbagi Pengetahuan",
    description: "Knowle adalah platform modern untuk menulis, membaca, dan berbagi pengetahuan. Tuangkan pikiranmu dan temukan insight menarik dari komunitas Indonesia.",

    // Keywords
    keywords: [
        "menulis cerita",
        "baca cerita online",
        "platform penulis",
        "berbagi cerita",
        "komunitas penulis",
        "cerita online gratis",
        "novel online",
        "cerpen",
        "fiksi",
        "Knowle"
    ],

    // Authors
    authors: [{ name: "Romi" }],
    creator: "Romi",
    publisher: "Knowle",

    // Favicon & Icons
    icons: {
        icon: "/favicon.png",
        shortcut: "/favicon.png",
        apple: "/favicon.png",
    },

    // Open Graph
    openGraph: {
        type: "website",
        locale: "id_ID",
        url: "https://knowle.com",
        siteName: "Knowle",
        title: "Knowle - Platform Menulis & Berbagi Cerita",
        description: "Platform modern untuk menulis, membaca, dan berbagi cerita. Tuangkan kreativitasmu bersama Knowle.",
        images: [
            {
                url: "/logo.png",
                width: 1200,
                height: 630,
                alt: "Knowle - Platform Menulis Cerita",
            },
        ],
    },

    // Twitter Card
    twitter: {
        card: "summary_large_image",
        title: "Knowle - Platform Menulis & Berbagi Cerita",
        description: "Platform modern untuk menulis, membaca, dan berbagi cerita.",
        images: ["/logo.png"],
        creator: "@knowle",
    },

    // Robots
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    // Verification (optional - add your own)
    // verification: {
    //     google: "your-google-verification-code",
    // },

    // Alternate languages
    alternates: {
        canonical: "https://knowle.com",
    },

    // Category
    category: "literature",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <meta name="theme-color" content="#6366f1" />
                <meta name="format-detection" content="telephone=no" />
            </head>
            <body>
                <Navbar />
                <main>{children}</main>
            </body>
        </html>
    );
}
