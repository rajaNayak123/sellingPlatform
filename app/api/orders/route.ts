import Rezorpay from 'razorpay'
import { NextRequest,NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOption'
import { connectToDatabase } from '@/lib/db'
import { Currency } from 'lucide-react'
import Order from '@/models/Order'

const rezorpay = new Rezorpay({
    key_id: process.env.REZORPAY_ID!,
    key_secret: process.env.REZORPAY_SECRETk!,
})

export async function POST(req:NextRequest){
    try {
      const session = await getServerSession(authOptions)

      if(!session){
        return NextResponse.json(
            {error:"Unauthorized"},
            {status:401}
        )
      }

      const { productId, variant } = await req.json();

      if(!productId || !variant){
        return NextResponse.json(
          {error:"Please select a variant and image"},
          {status:401}
        )
      }
      await connectToDatabase()

      // create rezorpay order
      const order = await rezorpay.orders.create({
        amount: variant.price*100,
        currency:"USD",
        receipt:`receipt ${Date.now()}`,
        notes:{
          productId: productId.toString(),
        }
      })

      const newOrder = await Order.create({
        userId: session.user.id,
        productId,
        variant,
        rezorpayOrderId: order.id,
        ammount: variant.price*100,
        status:"pending"
      })
      
      return NextResponse.json(
        {
          orderId : order.id,
          ammount: order.amount,
          currency: order.currency,
          dbOrderId: newOrder.id
        },
        {status:201}
      )
    } catch (error) {
        console.log(error);
        return NextResponse.json(
          {error:"something went wrong while creating order"},
          {status:500}
        )
    }
}
