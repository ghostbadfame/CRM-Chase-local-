"use client";
import React from "react";
import { signOut } from "next-auth/react";

export default function SignoutBtn() {
  function handleSignout() {
    signOut({ callbackUrl: "/", redirect: true });
  }
  return <span onClick={() => handleSignout()}>Logout</span>;
}
