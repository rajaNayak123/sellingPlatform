import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest, props:{params:Promise<{id:string}>}){
    try {
        const {id} = await props.params;
        
        await connectToDatabase();

        const product = await Product.findById(id);

        if(!product){
            return NextResponse.json(
                {error:"Product not found"},
                {status:404}
            )
        }

        return NextResponse.json(
            {product},
            {status:200}
        )
    } catch (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        error) {
        return NextResponse.json(
            {error:"Failed to fetch product"},
            {status:500}
        )
    }
}