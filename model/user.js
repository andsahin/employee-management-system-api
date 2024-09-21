import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      index: {
        unique: true,
        partialFilterExpression: { email: { $type: "string" } },
      },
      set: (v) => (v === "" ? null : v),
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      default: "admin-hr",
      enum: {
        values: ["admin-hr", "employee"],
        message: "{VALUE} is not supported",
      },
    },
    role_permission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoleAndPermission",
    },
    ip_address: {
      type: String,
    },
    status: {
      type: String,
      default: "active",
      enum: {
        values: ["active", "inactive", "suspended", "deleted"],
        message: "{VALUE} is not supported",
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
