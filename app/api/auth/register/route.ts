import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";
// import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
    console.log("Received a request at /api/auth/register");

  try {
    const { email, password } = await request.json();
    console.log("User Data:", { email, password });

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    console.log("Connected to MongoDB");

    const existUser = await User.findOne({ email });

    if (existUser) {
        console.log("User already exists:", email);
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    console.log("Creating user...");
    const newUser = await User.create({
        email: email,
        password,
        role: "user",
      });

    console.log("User registered successfully", newUser);
    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    // console.log(error);

    // return NextResponse.json(
    //     {message:" Failed while user register"},
    //     {status:500}
    // )
    console.error("Error during registration:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}