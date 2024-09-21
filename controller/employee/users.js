import bcrypt from "bcrypt";
import Handlebars from "handlebars";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import nodemailer from "nodemailer";
import { User } from "../../model/user.js";
const { ObjectId } = Types;

const { sign } = jwt;

export const signUpValidateRules = {
  name: "required",
  email: "required|email",
  phone: "required",
  role: "required",
};

export const addAdminUser = async (req, res) => {
  try {
    const { name, email, phone, role, role_id } = req.body;
    let password = Math.random().toString(36).slice(-8);
    const encryptedPassword = await bcrypt.hashSync(password, 10);
    const insertVal = {
      name,
      email: email,
      phone: phone,
      role,
      status: "active",
      role_info: role_id,
      ip_address: req.socket.remoteAddress,
      password: encryptedPassword,
    };

    //save admin
    const info = await new User(insertVal).save();
    if (info) {
      var source =
        "<p>Hello Mr. {{name}}.</p>" +
        " <p>{{description}}</p>" +
        " <a href=`{{link}}`>Click here to login</a>" +
        " <p>{{email}}</p>" +
        " <p>{{password}}</p>" +
        " <p>{{body}}</p>";
      const template = Handlebars.compile(source);
      const replacements = {
        name: info?.first_name + " " + info?.last_name,
        description: `I hope this email finds you well. We're excited to inform you that you have been granted access to our admin panel, allowing you to manage ${role.replaceAll(
          "_",
          " "
        )}. To activate your ${role.replaceAll(
          "_",
          " "
        )} access, simply click on the link below`,
        link: `${process.env.ACCESS_URL}`,
        body: `If you have any questions or encounter any issues during the setup process, please don't hesitate to reach out to our IT support team at Luxdigit. We're thrilled to have you onboard as part of our admin team, and we look forward to your contributions!`,
        email: `User Email: ${email}`,
        password: `User password: ${password}`,
      };
      const htmlToSend = template(replacements);

      var transporter = nodemailer.createTransport({
        service: "gmail",
        // type: emailGateway?.email_gateway.type,
        host: "smtp.gmail.com",
        // port: "587",
        auth: {
          user: process.env.SMTP_EMAIL_ADDRESS,
          pass: process.env.SMTP_EMAIL_PASS,
        },
      });

      let mailOptions = {
        from: "",
        to: info.email,
        subject:
          "Action Required: Activate Your Admin Access to Luxdigit Admin Panel",
        html: htmlToSend,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res.status(500).json({
            status: "error",
            message: error.message,
          });
        }
      });
    }

    res.status(200).json({
      status: "success",
      message: "Added Successfully",
      data: info,
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
        message: err?.message,
      });
    }
  }
};
export const updateValidateRules = {
  name: "required",
  email: "required|email",
  phone: "required",
  role: "required",
};
export const updateAdminUser = async (req, res) => {
  try {
    const { name, email, phone, role, role_id, status } = req.body;
    const { id } = req.params;

    //update admin
    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        name,
        email,
        phone,
        role,
        status,
        role_info: role_id,
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: "Updated Successfully",
      data: updatedUser,
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
        message: err?.message,
      });
    }
  }
};

export const getAllAdminUser = async (req, res) => {
  try {
    const info = await User.find({
      role: { $ne: "superadmin" },
      _id: { $ne: req.userId },
    }).select("-password");
    res.status(200).json({
      status: "success",
      message: "Login successfully",
      data: info,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const getAdminUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const info = await User.findById(id).select("-password");
    res.status(200).json({
      status: "success",
      message: "Login successfully",
      data: info,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const deleteAdminUser = async (req, res) => {
  try {
    //find and delete
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err?.message,
    });
  }
};
