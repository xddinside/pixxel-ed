"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/ModeToggle";

import { BookOpenText } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-5 flex items-center justify-between ">
      <div className="flex items-center gap-6 px-4 sm:px-6">
        <h1 className="text-xl font-extrabold md:text-3xl flex gap-6">

          <Link href={"/"} className="flex gap-2">
            <BookOpenText className="size-6 md:size-8 text-blue-500" />
            <span>Pixxel<span className="text-blue-500">Ed</span></span>
          </Link>

          <div>
            <Link href="/dashboard" className="text-lg font-normal md:text-xl hover:underline decoration-blue-500">Dashboard</Link>
          </div>

        </h1>
      </div>

      <div className="flex items-center gap-4 px-4 sm:px-6">
        <ModeToggle />

        {!isSignedIn ? (
          <div>

            <div className="hidden md:flex items-center gap-4">
              <Button asChild>
                <Link href="/sign-in">Login</Link>
              </Button>
              <Button variant={"ghost"} asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>

            <div className="md:hidden">
              <Button asChild size={"sm"}>
                <Link href="/sign-in">Login</Link>
              </Button>
              <Button variant={"ghost"} asChild size={"sm"}>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>

          </div>
        ) : (
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        )}
      </div>
    </nav>
  );
}
