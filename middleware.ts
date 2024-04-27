export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/engineer",
    "/designer",
    "/manager",
    "/lead",
    "/new-lead",
    "/employee",
    "/profile",
    "/telecaller",
    "/api",
  ],
};
