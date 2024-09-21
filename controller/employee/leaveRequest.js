import { Types } from "mongoose";
import { LeaveRequest } from "../../model/leaveRequest.js";
const { ObjectId } = Types;
export const addLeaveReqValidationRule = {
  start_date: "required",
  end_date: "required",
  request_date: "required",
  reason: "required",
};

export const add = async (req, res) => {
  try {
    const { start_date, end_date, request_date, reason, comments } = req.body;

    const newReq = await LeaveRequest({
      employee: req.userId,
      start_date,
      end_date,
      request_date,
      reason,
      comments,
    }).save();

    res.status(201).json({
      status: "success",
      message: `Request submitted successfully`,
      data: newReq,
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
    const userLeaveReq = await LeaveRequest.find({ employee: req.userId });

    res.status(200).json({
      status: "success",
      message: "Find all leave request successfully",
      data: userLeaveReq,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
