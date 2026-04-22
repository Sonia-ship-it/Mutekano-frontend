import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Mutekano - Umuhinzi wumutekano',
  description: 'Mutekano Platform for managing cameras and security',
  icons: {
    icon: '/mu_2.jpg',
    shortcut: '/mu_2.jpg',
    apple: '/mu_2.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="rw" className={`${outfit.variable} font-sans h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
