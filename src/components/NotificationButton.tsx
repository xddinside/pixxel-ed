"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export function NotificationButton() {
  const unreadCount = useQuery(api.users.getUnreadChatsCount);

  return (
    <Button asChild variant="ghost" size="icon" className="relative">
      <Link href="/dashboard">
        <Bell className="h-[1.2rem] w-[1.2rem]" />
        {unreadCount !== undefined && unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </span>
        )}
        <span className="sr-only">Notifications</span>
      </Link>
    </Button>
  );
}
