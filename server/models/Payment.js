import mongoose from "mongoose";
 
const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  amount: Number,
  method: String, // carte, paypal, etc.
  status: { type: String, default: "pending" } // pending, completed
});
 
export default mongoose.model("Payment", paymentSchema);