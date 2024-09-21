import mongoose from "mongoose";

const leaveReqSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    start_date: {
      type: Date,
    },
    end_date: {
      type: Date,
    },
    request_date: {
      type: Date,
    },
    reason: {
      type: String,
    },
    approved_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comments: {
      type: String,
    },
    ip_address: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
      enum: {
        values: ["pending", "approved", "declined"],
        message: "{VALUE} is not supported",
      },
    },
  },
  { timestamps: true }
);

export const LeaveRequest =
  mongoose.models.Leaverequest ||
  mongoose.model("Leaverequest", leaveReqSchema);
