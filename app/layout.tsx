import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";
import Header from "@/components/header";
export const metadata: Metadata = {
  title: "Community — A little closer to local",
  description:
    "Discover music, workshops, food and more in your neighbourhood.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Providers>
          <Header />
          {children}
          <footer>
            <LinkFooter />
          </footer>
        </Providers>
      </body>
    </html>
  );
}
function LinkFooter() {
  return (
    <div className="footer-inner">
      <span>
        <strong>community</strong> · Good things happen nearby.
      </span>
      <a href="/admin">Admin access ↗</a>
    </div>
  );
}
