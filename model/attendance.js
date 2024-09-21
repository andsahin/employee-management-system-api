import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    check_in_time: {
      type: Date,
    },
    check_out_time: {
      type: Date,
    },
    check_out_time: {
      type: Date,
    },
    date: {
      type: Date,
    },
    ip_address: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Attendance =
  mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
