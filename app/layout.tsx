import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/AuthProvider";
import DeviceGuard from "@/components/DeviceGuard";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";
import SplashScreen from "@/components/SplashScreen";

export const metadata: Metadata = {
  title: "Upskill Preparation for Students",
  description: "Upskill Preparation for Students – practice tool for caregiver students in Nepal.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Upskill Prep" },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0d2067",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts — Manrope + Public Sans + Material Symbols */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Public+Sans:wght@400;500;600;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body>
        <SplashScreen />
        <ServiceWorkerRegistrar />
        <AuthProvider>
          <DeviceGuard>
            <div
              style={{
                maxWidth: 480,
                margin: "0 auto",
                minHeight: "100dvh",
                background: "#f8f9fa",
                position: "relative",
              }}
            >
              {children}
            </div>
          </DeviceGuard>
        </AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: { maxWidth: 340, fontSize: 14, fontFamily: "'Public Sans', system-ui, sans-serif" },
          }}
        />
      </body>
    </html>
  );
}
