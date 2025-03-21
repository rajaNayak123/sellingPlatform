import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import nodemailer from 'nodemailer';
export async function POST(req:NextRequest){
    try {
        const body = await req.text();
        const signature = req.headers.get('x-rezorpay-signature');

        const expectedSignature = crypto
        .createHmac('sha256',process.env.REZORPAY_WEBHOOK!)
        .update(body)
        .digest('hex');

        if(expectedSignature != signature){
            return NextResponse.json(
                {error:"Invalid signature"},
                {status:400}
            )
        }

        const event = JSON.parse(body)
        await connectToDatabase();

        if(event.event === "payment.captured"){
            const payment = event.payload.payment.entity;

            const order = await Order.findOneAndUpdate(
                {rezorpayOrderId:payment.order_id},
                {rezorpayPaymentId:payment.id, status:"completed"}
            ).populate([
                {path:"productId", select:"name"},
                {path:"userId", select:"email"}
            ])

            if(order){
               const transporter = nodemailer.createTransport({
                    service:"sandbox.smtp.mailtrap.io",
                    port:2525,
                    auth:{
                        user:process.env.NODEMAILER_USER,
                        pass:process.env.NODEMAILER_PASS
                    }
               }) 
               await transporter.sendMail({
                    from:"nayak@gmail.com",
                    to:order.userId.email,
                    subject:"Order completed",
                    text:`your order${order.productId.name} has been successfully placed`
               })
            }
        }

        return NextResponse.json(
            {message:"success"},
            {status:200}
        )
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {error:"error while payment"},
            {status:500}
        )
    }
}