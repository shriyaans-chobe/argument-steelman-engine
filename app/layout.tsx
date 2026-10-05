import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Argument Steelman Engine",
  description: "Strengthen an argument and see exactly how it improves.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}
