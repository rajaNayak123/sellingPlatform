import { authOptions } from "@/lib/authOption";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const session = await getServerSession(authOptions)
        if(!session){
            return NextResponse.json(
                {error:"Could not get server session or unauthorized"},
                {status:401}
            )
        }

        await connectToDatabase();

       const orders = await Order.find({userId:session.user.id})
        .populate({
            path:"productId",
            select:"name imageUrl",
            options:{strictPopulate:false} // its return null if no product is found
        })
        .sort({createdAt:-1})
        .lean()

        return NextResponse.json(
            {orders},
            {status:200}
        )
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {error:"Error while order collection"},
            {status:500}
        ) 
    }
}