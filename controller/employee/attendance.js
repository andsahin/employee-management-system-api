import { Types } from "mongoose";
import { Attendance } from "../../model/attendance.js";
const { ObjectId } = Types;
export const addAttendanceValidationRule = {
  type: "required",
};

export const add = async (req, res) => {
  try {
    const { type } = req.body;
    let dateTime = new Date();
    const today = dateTime.toISOString().slice(0, 10);

    let update;
    type === "checkIn"
      ? (update = { check_in_time: new Date() })
      : (update = { check_out_time: new Date() });

    await Attendance.updateOne(
      {
        employee: req.userId,
        date: today,
      },
      update,
      { upsert: true }
    );

    res.status(201).json({
      status: "success",
      message: `${type} successfully`,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    //add attendance

    const userAttendance = await Attendance.find({ employee: req.userId });

    res.status(200).json({
      status: "success",
      message: "Find  attendance successfully",
      data: userAttendance,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
