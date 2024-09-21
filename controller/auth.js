import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import string from "string-sanitizer";
import { User } from "../model/user.js";
import { VerificationModel } from "../model/verification.js";
import { sendEmail } from "../utils/emailSender.js";
import { comparePasswords, hashPassword } from "../utils/hashPassword.js";
// import { VerificationModel } from "../model/verification.js";
const { ObjectId } = Types;

const { sign } = jwt;

export const regValidationRule = {
  name: "required",
  email: "required|email",
  password: "required",
};

export const registration = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = hashPassword(password);
    //add user
    const newUser = await User({
      name: string.sanitize.keepSpace(name),
      email: email,
      role: "admin-hr",
      password: hashedPassword,
      ip_address: req.socket.remoteAddress,
    }).save();

    // const newUser = await User({
    //   name: string.sanitize.keepSpace(name),
    //   email: email,
    //   role: "employee",
    //   role_permission: "66ee63dcfb25c6729362ee38",
    //   password: hashedPassword,
    //   ip_address: req.socket.remoteAddress,
    // }).save();

    res.status(201).json({
      status: "success",
      message: "registration successfully",
      data: newUser,
    });
  } catch (err) {
    if (err.code === 11000) {
      res.status(500).json({
        status: "error",
        message: `Duplicate Data ${
          err.keyValue[`${Object.keys(err.keyValue)}`]
        }`,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }
};

export const loginValidateRule = {
  email: "required",
  password: "required",
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userInfo = await User.findOne({
      email: email,
      status: "active",
    }).select({ email: 1, password: 1, status: 1 });

    if (!userInfo) throw new Error("Authorization failure!");

    if (userInfo.status == "inactive") throw new Error("You are inactive!");

    if (userInfo.status == "suspended") throw new Error("You are suspended!");
    //password verify

    let passwordIsValid = comparePasswords(password, userInfo.password);

    if (!passwordIsValid) throw new Error("Authorization failure!");

    //create token for next verify

    const info = await User.findOne({ email: email })
      .populate("role_permission")
      .select("-password");

    let token = await sign({ info }, process.env.JWT_SECRET, {
      expiresIn: 86400, // 24 hours 86400
    });

    res.status(200).json({
      status: "success",
      message: "Login successfully",
      data: info,
      jwt_token: token,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updateProfileValidateRules = {
  name: "required",
};
export const updateMyProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!req?.userId) throw new Error("Unauthorized");

    const updated = await User.findOneAndUpdate(
      { _id: new ObjectId(req?.userId) },
      {
        name,
      },
      { new: true }
    ).select("name email avatar role status");
    res.status(201).json({
      status: "success",
      message: "Updated Successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err?.message,
    });
  }
};
export const myProfile = async (req, res) => {
  try {
    if (!req?.userId) throw new Error("Unauthorized");

    const info = await User.findOne({
      _id: new ObjectId(req?.userId),
      status: "active",
    }).select("name email avatar role status");
    if (!info) throw new Error("Unknown user!");

    res.status(200).json({
      status: "success",
      message: "Find Successfully",
      data: info,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err?.message,
    });
  }
};

export const forgotPassValidity = {
  email: "required",
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    let verifyCode = Math.floor(100000 + Math.random() * 900000);

    let currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + 120);
    let expireAt = new Date(currentDate); // verification's

    const info = await User.findOne({ email: email, status: "active" });
    if (!info) throw new Error("Unknown user!");

    const existVerifyReq = await VerificationModel.findOne({
      requestId: new ObjectId(info?._id),
      requestType: "forgotPass",
    });
    if (existVerifyReq) {
      throw new Error(
        "Your request already submitted, You can check your email!"
      );
    }
    const verifyVal = {
      requestId: info._id,
      requestType: "forgotPass",
      verifyToken: verifyCode,
      expireAt: expireAt,
    };

    const verifyInfo = await new VerificationModel(verifyVal).save();
    if (!verifyInfo) throw new Error("Please try again!");

    const key = `forgotpass,${process.env.JWT_SECRET},${email},${verifyCode}`;
    const base64Key = Buffer.from(key).toString("base64");
    const resetLink = `${process.env.ACCESS_URL}/password-reset/${base64Key}`;

    var source =
      "<p>Hello Mr. {{name}}.</p>" +
      " <p>{{body}}</p>" +
      "<a href='{{resetLink}}'>{{resetLink}}</a>";

    const replacements = {
      name: info?.name,
      description: "Forgot your password?",
      body: "You have received this email because a password reset request for your account was received. To proceed, enter the following reset link. You have a two hour period to change your password. If you did not request a password reset, no further action is required on your part.",
      resetLink: resetLink,
    };
    const sent = await sendEmail(
      source,
      replacements,
      info?.email,
      "Reset Password Request"
    );

    return res.status(200).json({
      status: "success",
      message: "Please check your email, We send password reset link here!",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error?.message,
    });
  }
};

export const passwordResetVerify = async (req, res) => {
  try {
    const { id } = req.params;
    const decode = Buffer.from(id, "base64").toString("ascii");
    const splitArr = decode.split(",");

    const key = splitArr[1];

    if (key !== process.env.JWT_SECRET) {
      throw new Error("Unknown request!");
    }

    const email = splitArr[2];
    const verifyCode = splitArr[3];
    const adminInfo = await User.findOne({ email: email }); //get admin info..
    if (!adminInfo) throw new Error("Unknown request!");

    const verifyReqInfo = await VerificationModel.findOne({
      $and: [
        { requestId: adminInfo._id },
        { verifyToken: verifyCode },
        { status: "unverified" },
      ],
    });

    if (!verifyReqInfo) throw new Error("Unknown request!");

    res.status(200).json({
      status: "success",
      message: "Verification Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error?.message,
    });
  }
};

export const verifyCodeValidity = {
  email: "required",
  verifyCode: "required",
};
export const verifyCodeForgotPass = async (req, res) => {
  const { email, verifyCode } = req.body;

  try {
    const adminInfo = await User.findOne({ email: email }); //get admin info..
    if (!adminInfo) throw new Error("Unknown request!");

    const verifyReqInfo = await VerificationModel.findOne({
      requestId: adminInfo._id,
      verifyToken: verifyCode,
    });
    if (!verifyReqInfo) {
      throw new Error("Invalid Code!");
    }

    await VerificationModel.updateOne(
      { requestId: adminInfo._id, verifyToken: verifyCode },
      { status: "verified" }
    );

    if (verifyReqInfo.verifyToken != verifyCode) {
      throw new Error("Invalid Code!");
    }

    return res.status(200).json({
      status: "success",
      message: "verify successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
export const passwordResetFromForgotValidity = {
  newPassword: "required",
};
export const passwordResetFromForgotPassReq = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    const decode = Buffer.from(id, "base64").toString("ascii");
    const splitArr = decode.split(",");

    const key = splitArr[1];

    if (key !== process.env.JWT_SECRET) {
      throw new Error("Unknown request!");
    }

    const email = splitArr[2];
    const verifyCode = splitArr[3];
    const adminInfo = await User.findOne({ email: email }); //get admin info..
    if (!adminInfo) throw new Error("Unknown request!");

    const verifyReqInfo = await VerificationModel.findOne({
      $and: [
        { requestId: adminInfo._id },
        { verifyToken: verifyCode },
        { status: "unverified" },
      ],
    });
    if (!verifyReqInfo) throw new Error("Unknown request!");

    const hashedPassword = hashPassword(newPassword, 10);

    const updateVal = {
      password: hashedPassword,
    };
    const setPass = await User.updateOne({ email: email }, updateVal); //set-password
    if (setPass)
      await VerificationModel.deleteOne({ requestId: adminInfo._id });

    res.status(200).json({
      status: "success",
      message: "Password reset successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error?.message,
    });
  }
};
export const changePassValidity = {
  oldPassword: "required",
  newPassword: "required",
};
export const changePassword = async (req, res) => {
  try {
    const { newPassword, oldPassword } = req.body;
    const { authorization } = req.headers;
    const arr = authorization?.split(" ");
    const token = arr[1];

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      throw new Error("Unauthorized!");
    }

    if (decoded?.info?._id != req?.userId) {
      throw new Error("Unauthorized!");
    }
    const userInfo = await User.findById(decoded?.info?._id).select("password");

    const hashedPassword = hashPassword(newPassword, 10);
    const oldPassIsValid = comparePasswords(oldPassword, userInfo.password); // check old password

    if (!oldPassIsValid) {
      throw new Error("Old password is invalid!");
    }

    await User.updateOne(
      { _id: new ObjectId(decoded?.info?._id) },
      {
        password: hashedPassword,
      }
    );

    return res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
