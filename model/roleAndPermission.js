import mongoose from "mongoose";

const roleAndPermissionSchema = new mongoose.Schema(
  {
    role_title: {
      type: String,
    },
    role_label: {
      type: String,
      lowercase: true,
      unique: true,
    },
    permissions: {
      type: Object,
    },
    status: {
      type: String,
      default: "active",
      enum: {
        values: ["active", "inactive"],
        message: "{VALUE} is not supported",
      },
    },
  },
  { timestamps: true }
);

export const RoleAndPermission =
  mongoose.models.RoleAndPermission ||
  mongoose.model("RoleAndPermission", roleAndPermissionSchema);
