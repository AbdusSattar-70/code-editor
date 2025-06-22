import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Auth | Licoderz",
  description: "Authenticate to access Licoderz features",
};
export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
