import mongoose from "mongoose";
 
const boatSchema = new mongoose.Schema({
  name: String,
  type: String,
  capacity: Number,
  pricePerDay: Number,
  description: String,
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isActive: { type: Boolean, default: true }
});
 
export default mongoose.model("Boat", boatSchema);
 