import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "חוסך לי אוכל",
  description:
    "תפריט יומי אוטומטי לסטודנטים בתקופת מבחנים — חוסך זמן, משביע, מהיר וזול.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
