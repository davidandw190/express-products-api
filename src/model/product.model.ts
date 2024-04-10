import { customAlphabet } from "nanoid";
import { UserDocument } from "./user.model";
import mongoose from "mongoose";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export interface ProductData {
  user: UserDocument["_id"];
  title: string;
  description: string;
  price: number;
  image: string;
}

export interface ProductDocument extends ProductData, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      default: () => `product_${nanoid()}`
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const ProductModel = mongoose.model<ProductDocument>('Product', productSchema);
