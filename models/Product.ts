import mongoose from "mongoose";
export const IMAGE_VARIANTS = {
  SQUARE: {
    type: "SQUARE",
    dimensions: { width: 1200, height: 1200 },
    label: "Square (1:1)",
    aspectRatio: "1:1",
  },
  WIDE: {
    type: "WIDE",
    dimensions: { width: 1920, height: 1080 },
    label: "Widescreen (16:9)",
    aspectRatio: "16:9",
  },
  PORTRAIT: {
    type: "PORTRAIT",
    dimensions: { width: 1080, height: 1440 },
    label: "Portrait (3:4)",
    aspectRatio: "3:4",
  },
} as const;

export type ImageVariantType = keyof typeof IMAGE_VARIANTS;

export interface ImageVariant {
  type: ImageVariantType;
  price: number;
  license: "personal" | "commercial";
}

export interface IProduct {
    _id?: mongoose.Types.ObjectId;
    name: string;
    description: string;
    imageUrl: string;
    variants: ImageVariant[];
  }

const imageVariantSchema = new mongoose.Schema<ImageVariant>({
  type: {
    type: String,
    required: true,
    enum: ["SQUARE", "WIDE", "PROTRITE"],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  license: {
    type: String,
    required: true,
    enum: ["personal", "comercial"],
  },
});

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    variants: [imageVariantSchema],
  },
  { timestamps: true }
);

const Product = mongoose.models?.Product || mongoose.model("Product", productSchema);

export default Product;
