"use client";

import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

function RoleRedirect({ children }: { children: React.ReactNode }) {
    const currentUser = useQuery(api.users.getCurrentUser);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (currentUser && pathname !== '/') {
            if (currentUser.role === 'none' && pathname !== '/role-selection') {
                router.push('/role-selection');
            } else if (currentUser.role !== 'none' && pathname === '/role-selection') {
                router.push('/dashboard');
            } else if (currentUser.role === 'mentor' && currentUser.mentorStatus === 'none' && pathname !== '/become-mentor') {
                router.push('/become-mentor');
            } else if (currentUser.role === 'mentor' && currentUser.mentorStatus !== 'none' && pathname === '/become-mentor') {
                router.push('/dashboard');
            }
        }
    }, [currentUser, pathname, router]);

    if (currentUser && pathname !== '/' && ((currentUser.role === 'none' && pathname !== '/role-selection') || (currentUser.role === 'mentor' && currentUser.mentorStatus === 'none' && pathname !== '/become-mentor'))) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}


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
        <RoleRedirect>{children}</RoleRedirect>
        <Toaster />
      </ThemeProvider>
    </ConvexClientProvider>
  );
}
