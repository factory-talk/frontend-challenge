import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CitiesContextProvider } from "./_context/CitiesContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Today Weather",
  description: "Generated with Lauv",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CitiesContextProvider>
          {children}
        </CitiesContextProvider>
      </body>
    </html>
  );
}
