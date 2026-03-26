import type { Metadata } from "next";
import { client } from '@/sanity/client'
import { metadataQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/utils/imageUrlBuilder'

export const revalidate = 0

// Generate metadata dynamically from Sanity CMS
export async function generateMetadata(): Promise<Metadata> {
  const metaData = await client.fetch(metadataQuery);
  
  // Build social image URL if available
  let socialImageUrl: string | undefined;
  if (metaData?.socialimage?.asset?._ref) {
    socialImageUrl = urlFor(metaData.socialimage).width(1200).height(630).url();
  }
  
  return {
    title: metaData?.title,
    description: metaData?.description,
    authors: [{ name: "Brodee" }],
    openGraph: {
      title: metaData?.title,
      description: metaData?.description,
      type: "website",
      locale: "en_US",
      ...(socialImageUrl && { images: [socialImageUrl] }),
    },
    twitter: {
      card: "summary_large_image",
      title: metaData?.title,
      description: metaData?.description,
      ...(socialImageUrl && { images: [socialImageUrl] }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Brodee" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="stylesheet" href="https://use.typekit.net/vqy3kes.css" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
