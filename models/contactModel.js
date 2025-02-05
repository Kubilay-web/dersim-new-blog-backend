import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  nameSurname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Modelin oluşturulması ve dışa aktarılması
const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
