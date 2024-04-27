import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    username: String;
    userType: String;
  }
  interface Session {
    user: User & {
      username: String;
      userType: String;
      userId: String;
    };
    token: {
      username: String;
      userType: String;
    };
  }
}
