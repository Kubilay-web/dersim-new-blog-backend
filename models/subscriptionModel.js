import mongoose from "mongoose";

// Subscription Schema
const subscriptionSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
