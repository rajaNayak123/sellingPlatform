import { IProduct,ImageVariant } from "@/models/Product";
import { IOrder } from "@/models/Order";
export type ProductFormData = Omit<IProduct, "_id">;
import { Types } from "mongoose";

export interface CreateOrderData {
  productId: Types.ObjectId | string;
  variant: ImageVariant;
}

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(endpoint, {
      method,
      body: JSON.stringify(body),
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json();
  }

  //get all the products
  async getProducts() {
    return this.fetch<IProduct[]>("/api/product");
  }

  // get only one product using the product id
  async getProduct(id: string) {
    return this.fetch<IProduct>(`/api/product/${id}`);
  }

  async createProduct(productData: ProductFormData) {
    return this.fetch<IProduct>("/product", {
      method: "POST",
      body: productData,
    });
  }

  async getUserOrders() {
    return this.fetch<IOrder[]>("/orders/users");
  }

  async createOrder(orderData: CreateOrderData) {
    const sanitizedOrderData = {
      ...orderData,
      productId: orderData.productId.toString(),
    };

    return this.fetch<{ orderId: string; amount: number }>("/orders", {
      method: "POST",
      body: sanitizedOrderData,
    });
  }
}

export const apiClient = new ApiClient();
