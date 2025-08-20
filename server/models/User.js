import mongoose from "mongoose";
 
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "USER" } // USER ou SELLER
});
 
export default mongoose.model("User", userSchema);
 