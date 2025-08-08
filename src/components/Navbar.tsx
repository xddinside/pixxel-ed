"use client";

import Link from "next/link";
import { Button } from "./ui/button"; // shadcn Button
import { ModeToggle } from "./mode-toggle";

import { UserButton, useUser } from "@clerk/nextjs";
import { ChefHat } from "lucide-react";

export default function Navbar() {
  const { isSignedIn } = useUser();

  // We no longer need useClerk or openSignIn/openSignUp
  // const { openSignIn, openSignUp } = useClerk();

  return (
    <nav className="border-b border-border py-5 flex items-center justify-between ">
      <div className="flex items-center gap-6 px-4 sm:px-6">
        <h1 className="text-3xl font-semibold">
          <Link href={"/"} className="flex gap-2">
            <ChefHat className="size-8" />
            <span><span className="text-amber-500">Flavor</span>Flow</span>
          </Link>
        </h1>
      </div>

      <div className="flex items-center gap-4 px-4 sm:px-6">
        <ModeToggle />

        {!isSignedIn ? (
          <div className="hidden md:flex items-center gap-4">
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button variant={"ghost"} asChild>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        ) : (
          <UserButton afterSignOutUrl="/" />
        )}
      </div>
    </nav>
  );
}

