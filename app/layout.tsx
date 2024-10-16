import type { Metadata } from "next";
import { config } from '@fortawesome/fontawesome-svg-core'
import "./globals.css";
import '@fortawesome/fontawesome-svg-core/styles.css'
import { Afacad } from "next/font/google"

config.autoAddCss = false

export const metadata: Metadata = {
  title: "NanyangNerds",
  description: "Generated by create next app",
};

const afacad = Afacad({subsets: ["latin"]})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${afacad.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
