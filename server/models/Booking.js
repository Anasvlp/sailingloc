import mongoose from "mongoose";
 
const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  boatId: { type: mongoose.Schema.Types.ObjectId, ref: "Boat" },
  startDate: Date,
  endDate: Date,
  status: { type: String, default: "pending" } // pending, confirmed, canceled
});
 
export default mongoose.model("Booking", bookingSchema);