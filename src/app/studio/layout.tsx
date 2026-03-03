import type { Metadata } from "next";
// import "../globals.css";

export const metadata: Metadata = {
  title: "Brodee - Studio",
  description: "Content management for Brodee",
};

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
