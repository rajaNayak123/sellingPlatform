"use client"
import { apiClient } from "@/lib/api-client"
import { IProduct } from "@/models/Product"
import { useEffect, useState } from "react"
import ImageGallery from "./components/ImageGallery"

export default function Home(){
  const [product, setProduct] = useState<IProduct[]>([])

  useEffect(()=>{
    const fetchProducts = async () => {
      try {
        const data = await apiClient.getProducts();
        setProduct(data);
      } catch (error) {
        console.log(error);
        
      }
    }
    fetchProducts()
  },[])
  return(
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ImageKit Shop</h1>
      <ImageGallery products={product} />
    </main>
  )
}

