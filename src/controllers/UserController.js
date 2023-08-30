const { UserModel, OTPModel } = require("../models/User");
const emailService = require("../utils/email/emailService");
require("dotenv").config();

const home = (req, res) => {
  res.send("<p>Welcome to NITSMUN recruitment api.</p>");
};

let storedOTP = "";

const checkEmail = (req, res) => {
  const email = req.body.email;
  UserModel.findOne({ email }, (err, user) => {
    if (err) {
      console.log("Error checking email uniqueness:", err);
      res
        .status(500)
        .json({ error: "An error occurred while checking email uniqueness" });
    } else {
      const unique = !user;
      res.json({ unique });
    }
  });
};

const checkScholarId = (req, res) => {
  const scholarId = req.body.scholarId;
  UserModel.findOne({ scholarId }, (err, user) => {
    if (err) {
      console.log("Error checking scholarId uniqueness:", err);
      res.status(500).json({
        error: "An error occurred while checking scholarId uniqueness",
      });
    } else {
      const unique = !user;
      res.json({ unique });
    }
  });
};

const createUser = async (req, res) => {
  const user = req.body;
  const newUser = new UserModel(user); //creating new user
  await newUser.save();

  //sending confirmation email to the user's entered email and their entered email
  const email = user.email;
  const subject = "Successful Submission of the NITSMUN recruitment form.";
  let text = `Thanks for filling out NITSMUN recruitment form.\n\n\nHere's what we have received.\n\nName: ${user.name}\nScholar ID: ${user.scholarId}\nBranch: ${user.branch}\nEmail: ${user.email}\nMobile number:${user.mobileno}\nWhatsapp number: ${user.wpno}\nTeam applying for: ${user.team}\nHave you ever participated in an MUN conference?: ${user.partinmun}\nIf yes, which conference and share your experience: ${user.yesmun}\nWhy do you want to be a part of NITSMUN? ${user.whynitsmun}\nWhy should we recruit you? ${user.whyrecruit}\nMention your experience supporting your desired team (club, fests, events, etc): ${user.experience}\nMention your achievements supporting the desired team (if any): ${user.achievement}\nMention your hobbies/interests: ${user.hobby}\n If you are applying for the design team, upload sample designs(upload canva link or gdrive link): ${user.poster} \n If you are applying for the content team, upload any content written by you(upload in .pdf or .docx): ${user.content}\n\n`;

  if (user.team.includes("Research & Development Team")) {
    text +=
      "Research & Development Team:\nPlease join this https://chat.whatsapp.com/FJ66NE9iUYl2B8gUx7rnUd whatsapp group as soon as possible for more information regarding further procedure for recruitment.\n\nRegards,\nNITSMUN\nNational Institute of Technology, Silchar";
  }

  if (user.team.includes("Public Relations & Outreach Team")) {
    text +=
      "Public Relations & Outreach Team:\nPlease join this https://chat.whatsapp.com/JRuzuloxBwj3IymuNqrj5b whatsapp group as soon as possible for more information regarding further procedure for recruitment.\n\nRegards,\nNITSMUN\nNational Institute of Technology, Silchar";
  }

  if (user.team.includes("Media & Design Team")) {
    text +=
      "Media & Design Team:\nPlease join this https://chat.whatsapp.com/GI0mZJ6ElEg5v5WzhqBmBN whatsapp group as soon as possible for more information regarding further procedure for recruitment.\n\nRegards,\nNITSMUN\nNational Institute of Technology, Silchar";
  }

  if (user.team.includes("Web Development")) {
    text +=
      "Technical Team:\nPlease join this https://chat.whatsapp.com/LKI0vrRDXIgJ992WkNXUjS whatsapp group as soon as possible for more information regarding further procedure for recruitment.\n\nRegards,\nNITSMUN\nNational Institute of Technology, Silchar";
  }

  if (user.team.includes("UI/UX")) {
    text +=
      "Technical Team:\nPlease join this https://chat.whatsapp.com/LKI0vrRDXIgJ992WkNXUjS whatsapp group as soon as possible for more information regarding further procedure for recruitment.\n\nRegards,\nNITSMUN\nNational Institute of Technology, Silchar";
  }

  if (user.team.includes("Flutter")) {
    text +=
      "Technical Team:\nPlease join this https://chat.whatsapp.com/LKI0vrRDXIgJ992WkNXUjS whatsapp group as soon as possible for more information regarding further procedure for recruitment.\n\nRegards,\nNITSMUN\nNational Institute of Technology, Silchar";
  }

  emailService.sendEmail(email, subject, text);
  res.json(user);
};

const sendOtp = async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    emailService.sendEmail(
      email,
      "[OTP] NITSMUN recruitment",
      `Your OTP for verifying your email is: ${otp}\n\nDo not share with anyone.\n\nRegards,\nNITSMUN Web Team`
    );
    await OTPModel.findOneAndUpdate({ email }, { otp }, { upsert: true });
    res.json({ success: true, otp });
    console.log(`otp sent to ${email} is ${otp}`);
  } catch (error) {
    console.log("Error sending OTP:", error);
    res.status(500).json({ error: "An error occurred while sending the OTP" });
  }
};

const verifyOtp = async (req, res) => {
  console.log("Request Body:", req.body);
  const enteredOTP = req.body.otp.toString().trim();
  const email = req.body.email;

  try {
    const otpData = await OTPModel.findOne({ email }).exec();

    console.log("Entered OTP:", enteredOTP);
    console.log("Stored OTP Data:", otpData.otp);
    // console.log(req.body.email)
    if (otpData) {
      const storedOTP = otpData.otp.toString().trim();
      if (enteredOTP === storedOTP) {
        res.status(200).json({ message: "OTP verified successfully" });
        console.log("otp verified successfully");
      } else {
        res.status(400).json({ message: "Wrong OTP. Please try again" });
        console.log("otp not verified");
      }
    } else {
      console.log("No OTP found for the provided email");
      res.status(400).json({ message: "No OTP found for the provided email" });
    }
  } catch (error) {
    // console.log("Error verifying OTP:", error);
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while verifying the OTP" });
  }
};

const auth = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (
    username === process.env.USERNAME_RESULT &&
    password === process.env.PWD_RESULT
  ) {
    UserModel.find({}, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
        console.log("successful login");
        console.log("Stored data retrieved successfully")
      }
    });
  } else {
    res.status(401).json({ message: "Unauthorized user" });
  }
};

module.exports = {
  home,
  checkEmail,
  auth,
  verifyOtp,
  sendOtp,
  checkScholarId,
  createUser,
};
