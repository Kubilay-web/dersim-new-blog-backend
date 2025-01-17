import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  conversationId: { type: String, required: true }, // Bu alan zorunlu
  price: { type: String, required: false }, // Zorunlu değil
  paidPrice: { type: String, required: false }, // Zorunlu değil
  currency: { type: String, required: false }, // Zorunlu değil
  installment: { type: String, required: false }, // Zorunlu değil
  basketId: { type: String, required: false }, // Zorunlu değil
  paymentChannel: { type: String, required: false }, // Zorunlu değil
  paymentGroup: { type: String, required: false }, // Zorunlu değil
  paymentCard: { type: Object, required: false }, // Zorunlu değil
  buyer: { type: Object, required: false }, // Zorunlu değil
  shippingAddress: { type: Object, required: false }, // Zorunlu değil
  billingAddress: { type: Object, required: false }, // Zorunlu değil
  basketItems: { type: Array, required: false }, // Zorunlu değil
  status: { type: String, default: "Pending" },
});

export const Payment = mongoose.model("Payment", PaymentSchema);
