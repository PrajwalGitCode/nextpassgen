import mongoose from "mongoose";

const VaultItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    username: { type: String },
    password: { type: String, required: true },
    url: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("VaultItem", VaultItemSchema);
