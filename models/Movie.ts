import mongoose, { Document, Schema } from "mongoose";

type MovieSchemaType = Document & {
  name: string;
  description: string;
  director: string;
  duration: number;
};

const movieSchema = new Schema({
  name: {
    type: String,
    required: [true, "Movie name is reuqired"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  director: {
    type: String,
    required: [true, "Director is required"],
  },
  duration: {
    type: Number,
    required: [true, "Duration is required"],
  },
});

export type { MovieSchemaType };
export default mongoose.model<MovieSchemaType>("Movie", movieSchema);
