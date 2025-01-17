import Iyzipay from "iyzipay";
import { Payment } from "../models/PaymentModel.js";
import dotenv from "dotenv";

dotenv.config();

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_BASE_URL,
});

export const createPayment = async (req, res) => {
  const request = req.body;

  iyzipay.payment.create(request, async (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err });
    }
    try {
      const payment = new Payment({ ...request, status: result.status });
      await payment.save();
      res.status(201).json({ success: true, payment, result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
};

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
