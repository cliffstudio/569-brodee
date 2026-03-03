import type { Metadata } from "next";
import Script from "next/script";
import { client } from '@/sanity/client'
import { metadataQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/utils/imageUrlBuilder'
import BodyFadeIn from '@/components/BodyFadeIn'
import ViewportDetection from '@/components/ViewportDetection'

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
        {/* Scroll-reset script (Next.js 15 pushState fix, scroll reset, homepage body class) - commented out
        <Script
          id="scroll-reset"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const originalPushState = History.prototype.pushState;
                const originalReplaceState = History.prototype.replaceState;
                const normalizeState = function(state) {
                  if (typeof state === 'string') return state ? { _original: state } : {};
                  if (state === null || state === undefined) return {};
                  if (typeof state === 'object') {
                    try { return Object.assign({}, state); } catch (e) { return {}; }
                  }
                  return {};
                };
                History.prototype.pushState = function(state, title, url) {
                  const safeState = normalizeState(state);
                  if (url && typeof url === 'string' && url.startsWith('//') && !url.startsWith('//www.') && !url.startsWith('//cdn.')) {
                    console.warn('Blocked invalid URL in pushState:', url);
                    return;
                  }
                  try { return originalPushState.call(this, safeState, title, url); } catch (error) { return; }
                };
                History.prototype.replaceState = function(state, title, url) {
                  try { return originalReplaceState.call(this, normalizeState(state), title, url); } catch (error) { return; }
                };
                if (typeof window !== 'undefined' && window.history) {
                  window.history.pushState = History.prototype.pushState;
                  window.history.replaceState = History.prototype.replaceState;
                }
                setTimeout(function() {
                  if (window.history) {
                    window.history.pushState = History.prototype.pushState;
                    window.history.replaceState = History.prototype.replaceState;
                  }
                }, 100);
                setTimeout(function() {
                  if (window.history) {
                    window.history.pushState = History.prototype.pushState;
                    window.history.replaceState = History.prototype.replaceState;
                  }
                }, 1000);
              })();
              window.scrollTo(0, 0);
              if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
              if (window.location.pathname === '/' || window.location.pathname === '') {
                (function() {
                  function runAfterHydration() {
                    requestAnimationFrame(function() {
                      requestAnimationFrame(function() {
                        setTimeout(typeof applyHomepageClasses === 'function' ? applyHomepageClasses : function(){}, 100);
                      });
                    });
                  }
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', runAfterHydration, false);
                  } else {
                    runAfterHydration();
                  }
                })();
              }
            `
          }}
        />
        */}
        <BodyFadeIn />
        <ViewportDetection />
        {children}
      </body>
    </html>
  );
}
