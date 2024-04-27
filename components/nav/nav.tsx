import React from "react";
import { ModeToggle } from "./mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignoutBtn from "./signout-btn";
import Logo from "../logo";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import SideNav from "../side-nav/sidenav";

export default async function Nav() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }
  return (
    <header className="top-0 z-50 border-b max-w-screen border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky">
      <div className="container flex h-16 max-w-screen-2xl items-center md:justify-end justify-between relative">
        <div className="block md:hidden">
          <Logo className="max-h-14 w-auto" />
        </div>
        <div className="flex gap-2">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="uppercase">
                  {session.user.username[0]}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-3 mr-3">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={"/profile"} className="w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SignoutBtn />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Sheet>
            <SheetTrigger className="block md:hidden">
              <HamburgerMenuIcon />
            </SheetTrigger>
            <SheetContent side={"left"} className="max-h-screen overflow-auto">
              <div className="w-full flex items-center">
                <SideNav />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
