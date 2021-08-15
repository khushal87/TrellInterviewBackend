import mongoose, { Document, Schema } from "mongoose";

type BookingSchemaType = Document & {
  user: string;
  movie: string;
  timing: string;
};

const bookingSchema = new Schema({
  timing: {
    type: mongoose.Types.ObjectId,
    required: [true, "Movie timing is reuqired"],
    ref: "Timing",
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: [true, "User is required"],
    ref: "User",
  },
  movie: {
    type: mongoose.Types.ObjectId,
    required: [true, "Movie is required"],
    ref: "Movie",
  },
});

export type { BookingSchemaType };
export default mongoose.model<BookingSchemaType>("Booking", bookingSchema);
