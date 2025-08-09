"use client";

import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Navbar />
        {children}
        <Toaster />
      </ThemeProvider>
    </ConvexClientProvider>
  );
}
