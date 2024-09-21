import string from "string-sanitizer";
import { Attendance } from "../../model/attendance.js";
import { LeaveRequest } from "../../model/leaveRequest.js";
import { User } from "../../model/user.js";
import { hashPassword } from "../../utils/hashPassword.js";

export const addEmployeeValidationRule = {
  name: "required",
  email: "required|email",
  password: "required",
  role: "required",
  role_id: "required",
};

export const addEmployee = async (req, res) => {
  try {
    const { name, email, password, role, role_id } = req.body;

    const hashedPassword = hashPassword(password);

    //add employee
    const newUser = await User({
      name: string.sanitize.keepSpace(name),
      email: email,
      role: role,
      role_permission: role_id,
      password: hashedPassword,
      ip_address: req.socket.remoteAddress,
    }).save();

    res.status(201).json({
      status: "success",
      message: "Employee added successfully",
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

export const getAllEmployee = async (req, res) => {
  try {
    // get all employee attendance and employee wise filtering
    const allEmployee = await User.find({ role: "employee" }).populate(
      "employee",
      "name email role"
    );

    res.status(201).json({
      status: "success",
      message: "Find all employee successfully",
      data: allEmployee,
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
export const employeeAttendance = async (req, res) => {
  try {
    //get all attendance
    const employeeId = req.query.employee_id;
    const where = employeeId ? { employee: employeeId } : {};
    // get all employee attendance and employee wise filtering
    const allAttendance = await Attendance.find(where).populate(
      "employee",
      "name email role"
    );

    res.status(201).json({
      status: "success",
      message: "Find all attendance successfully",
      data: allAttendance,
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

export const getAllLeaveRequest = async (req, res) => {
  try {
    const employeeId = req.query.employee_id;
    const where = employeeId ? { employee: employeeId } : {};
    // get all employee leave request and employee wise filtering
    const allLeaveReq = await LeaveRequest.find(where).populate(
      "employee",
      "name email role"
    );

    res.status(200).json({
      status: "success",
      message: "Find all leave request successfully",
      data: allLeaveReq,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
export const leaveRequestFindById = async (req, res) => {
  try {
    const { id } = req.params;
    // get all employee leave request and employee wise filtering
    const leaveReq = await LeaveRequest.findById(id).populate(
      "employee",
      "name email role"
    );

    res.status(200).json({
      status: "success",
      message: "Find all leave request successfully",
      data: leaveReq,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
export const leaveRequestStatusValidation = { status: "required" };
export const leaveRequestUpdateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    // get all employee leave request and employee wise filtering
    const updatedLeaveReq = await LeaveRequest.findOneAndUpdate(
      { _id: id },
      { status },
      { new: true }
    ).populate("employee", "name email role");

    res.status(200).json({
      status: "success",
      message: "Find all leave request successfully",
      data: updatedLeaveReq,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
