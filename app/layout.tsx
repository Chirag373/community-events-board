import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";
import Header from "@/components/header";
export const metadata: Metadata = {
  title: "Community — UI preview",
  description: "Community Events Board interface preview.",
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
            <div className="footer-inner">
              <span>
                <strong>community</strong> · Good things happen nearby.
              </span>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
