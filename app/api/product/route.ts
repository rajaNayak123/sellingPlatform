import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product, { IProduct } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";

export async function GET(){
    try {
        await connectToDatabase();

       const products = await Product.find({}).lean(); // the lean Returns a plain JavaScript object if we not use it Returns a Mongoose document with additional methods

       if(!products || products.length === 0){
        return NextResponse.json(
            {error: "Product not found"},
            {status:404}
        )
       }

       return NextResponse.json({products},{status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {error:"something went wrong"},
            {status:500}
        )
    }
}

export async function POST(request:NextRequest){
    try {
        const session = await getServerSession(authOptions);
    
        if(!session || session.user?.role !== "admin"){
            return NextResponse.json(
                {error: "Unthorized"},
                {status:401}
            )
        }

        await connectToDatabase();

        const body:IProduct = await request.json();

        if(
            !body.name || 
            !body.description ||
            !body.imageUrl || 
            body.variants.length === 0
        ){
            return NextResponse.json(
                {error:"All fields are required"},
                {status:400}
            )
        }

       const newProduct = await Product.create(body);

       return NextResponse.json({newProduct},{status:201});
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {error: "Unable to post product"},
            {status:500}
        )
    }
}