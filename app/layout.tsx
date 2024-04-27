import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Provider from "@/components/hocs/provider";
import SideNav from "@/components/side-nav/sidenav";
import Nav from "@/components/nav/nav";
import { Toaster } from "@/components/ui/sonner";
import { Toaster as EnhToaster } from "@/components/ui/toaster";
import { ErrorDialogProvider } from "@/components/ui/error-dialog";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Dream Kitchen",
  description: "Crm software by steploops technologies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "max-h-screen overflow-hidden")}>
        <Provider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ErrorDialogProvider>
              <main className="flex">
                <div className="hidden md:block max-h-screen">
                  <SideNav />
                </div>
                <section className="flex-1 max-w-screen overflow-hidden max-h-screen overflow-y-auto">
                  <Nav />
                  {children}
                </section>
              </main>
              <EnhToaster />
              <Toaster />
            </ErrorDialogProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
