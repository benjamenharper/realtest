import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3D%2522user%2Bicon%2522&psig=AOvVaw2T7g7iywugJm_R7xovI8b7&ust=1704912794510000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCKiqw6L90IMDFQAAAAAdAAAAABA2",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
