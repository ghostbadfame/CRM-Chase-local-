import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcrypt";
import * as z from "zod";

const userSchema = z.object({
  username: z.string().min(1, "username is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have more than 8 characters"),
  userType: z.string().min(1, "Usertype is required").max(100),
});

interface UserPass {
  password: string;
  restricted:boolean;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password, userType } = userSchema.parse(body);

    //check email already exists
    const existingUserbyEmail: UserPass | null = await db.user.findUnique({
      where: {
        email: email,
        username: username,
        userType: userType,
        password: "1234",
      },
      select: {
        password: true,
        restricted:true
      },
    });

    if (existingUserbyEmail?.restricted) {
      return NextResponse.json(
        { user: null, message: "User not restricted " },
        { status: 409 }
      );
    }

    if (!existingUserbyEmail) {
      return NextResponse.json(
        { user: null, message: "Invalid Credentials" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await db.user.update({
      where: {
        username: username,
        email: email,
      },
      data: {
        username: username,
        email: email,
        password: hashedPassword,
        userType: userType,
      },
    });

    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      { new: newUser, message: "User Created Successfully " },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something Went Wrong " },
      { status: 500 }
    );
  }
}
