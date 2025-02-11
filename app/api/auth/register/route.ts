import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";

export async function POST(request:NextRequest){
    try {
        const {email, password} = await request.json();
    
        if(!email || !password){
            return NextResponse.json(
                {error:"Email and password are required"},
                {status:400}
            )
        }

       await connectToDatabase();

     const existUser = await User.findOne({email});

     if(existUser){
        return NextResponse.json(
            {error:"User already exists"},
            {status:400}
        )
     }

    await User.create({
        email: email,
        password: password
     })

     return NextResponse.json(
        {messge:"User created successfully"},
        {status:201}
     )
    } catch (error) {
        console.log(error);
        
        return NextResponse.json(
            {message:" Failed while user register"},
            {status:50}
        )
    }


}