const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      set: (value) => value.toLowerCase(),
    },
    lastName: {
      type: String,
      required: true,
      set: (value) => value.toLowerCase(),
    },
    email: {
      type: String,
      match: [/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/],
      required: [true, "Email is required"],
      unique: true,
      set: (value) => value.toLowerCase(),
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: function (value) {
          // Password must be at least 8 characters long
          // and include at least one lowercase letter, one uppercase letter,
          // one digit, and one special character
          const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;
          return passwordRegex.test(value);
        },
        message:
          "Password must be at least 8 characters long and include one lowercase letter, one uppercase letter, one digit, and one special character",
      },
    },
    country: {
      type: String,
      required: true,
      set: (value) => value.toLowerCase(),
    },
    avatar: { type: String, default: "/images/avatar.webp" },
    cover: { type: String, default: "/images/cover.jpg" },
    linkedIn: { type: String, default: "" },
    twitter: { type: String, default: "" },
    facebook: { type: String, default: "" },
    youtube: { type: String, default: "" },
    website: { type: String, default: "" },
    bio: { type: String, default: "Bloggen Star ⭐❤️" },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    dateJoined: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false } // Exclude the "__v" field
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre("save", function (next) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;
  if (!passwordRegex.test(this.password)) {
    const error = new Error(
      "Invalid password. Password must be at least 8 characters long and include one lowercase letter, one uppercase letter, one digit, and one special character"
    );
    next(error);
  } else {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
  }
});


exports.User = model("User", userSchema);
