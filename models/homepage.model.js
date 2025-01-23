import mongoose from "mongoose";

const homepageSchema = new mongoose.Schema(
  {
    videoLink: {
      type: String,
      required: true,
    },
    title1: {
      type: String,
      required: true,
    },
    title2: {
      type: String,
      required: true,
    },
    title3: {
      type: String,
      required: true,
    },
    title4: {
      type: String,
      required: true,
    },
    title5: {
      type: String,
      required: true,
    },
    title6: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Homepage = mongoose.model("Homepage", homepageSchema);

export default Homepage;
