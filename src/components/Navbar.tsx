"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/ModeToggle";

import { BookOpenText } from "lucide-react";

export default function Navbar() {

  return (
    <nav className="border-b border-border py-5 flex items-center justify-between ">
      <div className="flex items-center gap-6 px-4 sm:px-6">
        <h1 className="text-3xl font-semibold">
          <Link href={"/"} className="flex gap-2">
            <BookOpenText className="size-8" />
            <span>Pixxel<span className="text-blue-500">Ed</span></span>
          </Link>
        </h1>
      </div>

      <div className="flex items-center gap-4 px-4 sm:px-6">
        <ModeToggle />

        <div className="hidden md:flex items-center gap-4">
          <Button asChild>
            <Link href="/sign-in">Login</Link>
          </Button>
          <Button variant={"ghost"} asChild>
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

