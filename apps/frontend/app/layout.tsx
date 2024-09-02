import type { Metadata } from "next";
import PrivyProviderWrapper from "../components/privy-provider-wrapper";
import '../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link
        rel="preload"
        href="/fonts/AdelleSans-Regular.woff"
        as="font"
        crossOrigin=""
      />
      <link
        rel="preload"
        href="/fonts/AdelleSans-Regular.woff2"
        as="font"
        crossOrigin=""
      />
      <link
        rel="preload"
        href="/fonts/AdelleSans-Semibold.woff"
        as="font"
        crossOrigin=""
      />
      <link
        rel="preload"
        href="/fonts/AdelleSans-Semibold.woff2"
        as="font"
        crossOrigin=""
      />

      <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
      <link rel="icon" href="/favicons/icon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
      <link rel="manifest" href="/favicons/manifest.json" />
      <body>
        <PrivyProviderWrapper>
            {children}
        </PrivyProviderWrapper>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "Privy Auth Starter",
  description: "Privy Auth Starter",
};
