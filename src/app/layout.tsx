import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MEAL PILOT | תפריט יומי אישי למייל",
  description:
    "תפריט יומי מותאם אישית, ישירות למייל שלך. חוסך זמן, כסף והתלבטויות.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heebo.className} min-h-screen`}>{children}</body>
    </html>
  );
}
