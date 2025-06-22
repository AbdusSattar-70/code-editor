import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LiCoderZ",
  description: "An online code editor with live preview and terminal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
