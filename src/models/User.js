const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  scholarId: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return /^221\d{4}$/.test(value);
      },
      message:
        'Scholar ID must begin with "221" and have 7 numeric characters.',
    },
  },
  branch: {
    type: String,
    enum: ["CE", "CSE", "ME", "ECE", "EE", "EI"],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobileno: {
    type: Number,
    required: true,
  },
  wpno: {
    type: Number,
    required: true,
  },
  team: {
    type: String,
    enum: [
      "Research & Development Team",
      "Public Relations & Outreach Team",
      "Media & Design Team",
      "Web Development",
      "UI/UX",
      "Flutter"
    ],
    required: true,
  },
  partinmun: {
    type: String,
    enum: ["Yes", "No"],
    required: true,
  },
  yesmun:String,
  whynitsmun: {
    type: String,
    required: true,
  },
  whyrecruit: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  achievement: {
    type: String,
  },
  hobby: {
    type: String,
    required: true,
  },
  poster: String,
  content: String,
  ip: String,
  timestamp: Date,
});

const otpSchema = new mongoose.Schema ({
  email: { type: String, required: true },
  otp: { type: String, required: true },
})

const UserModel = mongoose.model("recruit", UserSchema);
const OTPModel = mongoose.model("OTPnitsmunRecruit", otpSchema);

module.exports = {
  UserModel, OTPModel
};