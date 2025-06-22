import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { OfflineBanner } from "@/components/shared/OfflineBanner";
import { TanstackProviders } from "@/components/providers/tanstack-provider";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "700"],
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "LiCoderZ",
  description:
    "An online code editor with live preview and terminal, featuring a coding community and an integrated space-themed idle game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dehydratedState = undefined;
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorBackground: "#00002e",
          colorText: "#f8fafc",
          colorPrimary: "#3b82f6",
          colorInputBackground: "#0f172a",
          colorInputText: "#f1f5f9",
          colorDanger: "#ef4444",
        },
        elements: {
          card: "bg-[#00002e] text-white border border-[#334155]",
          headerTitle: "text-white",
          headerSubtitle: "text-slate-300",
          formFieldInput:
            "bg-[#0f172a] text-white placeholder:text-slate-400 border border-[#475569]",
          formButtonPrimary: "bg-[#3b82f6] hover:bg-[#2563eb] text-white",
          footerActionText: "text-slate-400",
          footerActionLink: "text-blue-400 hover:text-blue-300",
          identityPreview: "bg-[#1e293b] text-white",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${montserrat.className} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <TanstackProviders state={dehydratedState}>
              {children}
              <OfflineBanner />
            </TanstackProviders>
          </ThemeProvider>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            // theme="dark"
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
