import type { Metadata } from "next";
import "./globals.css";
import { CoachProvider } from "@/context/CoachContext";
import { CheckInModal } from "@/components/checkin/CheckInModal";

export const metadata: Metadata = {
  title: "Saathi AI — Adaptive AI Productivity & Learning Coach",
  description:
    "An AI coach that creates personalized roadmaps for DSA, languages, and exams, and automatically adapts your schedule based on your actual daily progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-slate-100 min-h-screen antialiased">
        <CoachProvider>
          {children}
          <CheckInModal />
        </CoachProvider>
      </body>
    </html>
  );
}
