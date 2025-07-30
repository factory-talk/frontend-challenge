import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { DynamicBackground } from "src/components/dynamic-background/dynamic-background";
import { NavigatorPermissions } from "@/lib/navigator-permissions";
import { Toaster } from "sonner";
import { Container } from "@/components/container";

export const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "600", "800", "900"],
});
export const metadata: Metadata = {
  title: "Weather App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-hidden">
      <body className={outfit.className}>
        <Container className={"size-full"}>
          {children}
          <DynamicBackground />
        </Container>
        <NavigatorPermissions />
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            className: "!glass-morphism",
          }}
        />
      </body>
    </html>
  );
}
