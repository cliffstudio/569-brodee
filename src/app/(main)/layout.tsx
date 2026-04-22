import '@/styles/style.scss'
import { cookies } from 'next/headers'
import { Suspense } from 'react'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LazyLoadInitializer from '@/components/LazyLoadInitializer'
import ViewportDetection from '@/components/ViewportDetection'
import ScrollSmootherProvider from '@/components/ScrollSmootherProvider'
import { client } from '@/sanity/client'
import { DEFAULT_LOCALE, LOCALE_COOKIE } from '@/lib/locale'
import { headerMenuQuery } from '@/sanity/lib/queries'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const locale = cookieStore.get(LOCALE_COOKIE)?.value ?? DEFAULT_LOCALE

  const data = await client.fetch(headerMenuQuery)
  const headerMenu = data?.headerMenu ?? []
  const showLanguageSwitcher =
    data?.showLanguageSwitcher === undefined
      ? true
      : Boolean(data.showLanguageSwitcher)
  const footer = {
    title: data?.footer ?? null,
    menu: data?.footerMenu ?? [],
    text: data?.footerText ?? null,
  }

  return (
    <div id="main-layout">
      <Suspense fallback={null}>
        <ViewportDetection />
        <Header
          menu={headerMenu}
          locale={locale}
          showLanguageSwitcher={showLanguageSwitcher}
        />
        <ScrollSmootherProvider>
          <LazyLoadInitializer />
          {children}
          <Footer footer={footer} locale={locale} />
        </ScrollSmootherProvider>
      </Suspense>
      <Script src="https://scripts.withcabin.com/hello.js" strategy="afterInteractive" />
    </div>
  )
}
