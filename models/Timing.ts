import mongoose, { Document, Schema } from "mongoose";

type TimingSchemaType = Document & {
  timing: string;
  price: number;
  totalTickets: number;
  movie: string;
};

const timingSchema = new Schema({
  timing: {
    type: String,
    required: [true, "Movie timing is reuqired"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  totalTickets: {
    type: String,
    required: [true, "Total Tickets is required"],
  },
  movie: {
    type: mongoose.Types.ObjectId,
    required: [true, "Duration is required"],
    ref: "Movie",
  },
});

export type { TimingSchemaType };
export default mongoose.model<TimingSchemaType>("Timing", timingSchema);
