'use client'

import Script from 'next/script'
import { CartProvider } from '@/contexts/cart-context'
import { ToastProvider } from '@/contexts/toast-context'
import { CartDrawer } from '@/components/shell/CartDrawer'
import { ToastContainer } from '@/components/ui/toast-container'
import { PageViewTracker } from '@/components/shell/PageViewTracker'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Meta Pixel is scoped to the retail (/store) tenant ONLY — initialised here,
  // not in the root layout — so the academy (/edu) and admin load no tracking at
  // all. NEXT_PUBLIC_* is inlined at build time, so reading it in this client
  // component is fine.
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID

  return (
    <CartProvider>
      <ToastProvider>
        {/* Meta Pixel base snippet — fires the initial PageView on full load.
            afterInteractive lets Next inject it without blocking render. */}
        {pixelId && (
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}

        <div className="min-h-screen bg-paper text-ink flex flex-col">
          <main id="main" className="flex-1">
            {children}
          </main>
          <CartDrawer />
          <ToastContainer />
        </div>

        {/* PageView on SPA route changes within /store (skips the initial load,
            which the snippet above already sent). */}
        <PageViewTracker />

        {/* Meta Pixel noscript fallback */}
        {pixelId && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        )}
      </ToastProvider>
    </CartProvider>
  )
}
