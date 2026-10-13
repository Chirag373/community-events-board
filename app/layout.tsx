import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";
import AdminHeader from "@/components/admin-header";
export const metadata: Metadata = {
  title: "Community — Admin UI",
  description: "Community Events Board admin interface preview.",
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
          <AdminHeader />
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
