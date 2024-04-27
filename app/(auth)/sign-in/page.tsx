import { cn } from "@/lib/utils";
import Link from "next/link";
import { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";
import SignInForm from "@/components/form/signInForm";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

const AuthenticationPage = async () => {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/");
  return (
    <>
      <div className="container relative grid min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/sign-up"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Sign up
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute z-10 object-cover top-0 left-0 w-full h-screen brightness-75">
            <Image
              src="/auth.jpg"
              fill
              className="object-cover w-full"
              alt="Authentication"
            />
          </div>
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            The Dream Kitchen
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;One place to manage all your data.&rdquo;
              </p>
              <footer className="text-sm">The Dream Kitchen</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Login to existing account.
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email and password to login.
              </p>
            </div>
            <SignInForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthenticationPage;
