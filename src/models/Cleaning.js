import mongoose from "mongoose";

const CleaningSchema = new mongoose.Schema({
  lastCleanedBy: String,
  lastCleanedDate: String,
});

export default mongoose.models.Cleaning ||
  mongoose.model("Cleaning", CleaningSchema);