import express from "express";
import * as attendance from "../controller/employee/attendance.js";
import * as leaveRequest from "../controller/employee/leaveRequest.js";
import * as task from "../controller/employee/task.js";
import * as authGuardMiddleware from "../middleware/authGuard.js";
import { validation } from "../middleware/validation.js";

const employeeRouter = express.Router();

employeeRouter.use(function (req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});

/**
 * Attendance API
 */
employeeRouter.post(
  "/attendance",
  [
    authGuardMiddleware.authGuard("add-attendance"),
    validation(attendance.addAttendanceValidationRule),
  ],
  attendance.add
);
employeeRouter.get(
  "/attendance",
  [authGuardMiddleware.authGuard("list-attendance")],
  attendance.getAll
);
/**
 * Leave routes
 */
employeeRouter.post(
  "/leave-request",
  [
    validation(leaveRequest.addLeaveReqValidationRule),
    authGuardMiddleware.authGuard("add-leave-request"),
  ],
  leaveRequest.add
);
employeeRouter.get(
  "/leave-request",
  [authGuardMiddleware.authGuard("list-leave-request")],
  leaveRequest.getAll
);
/**
 * Task routes
 */
employeeRouter.post(
  "/task",
  [
    validation(task.addTaskValidationRule),
    authGuardMiddleware.authGuard("add-task"),
  ],
  task.add
);
employeeRouter.get(
  "/task",
  [authGuardMiddleware.authGuard("list-task")],
  task.getAll
);
employeeRouter.get(
  "/task/:id",
  [authGuardMiddleware.authGuard("list-task")],
  task.getById
);
employeeRouter.put(
  "/update-task/:id",
  [authGuardMiddleware.authGuard("update-task")],
  task.update
);
employeeRouter.put(
  "/update-task-status/:id",
  [
    validation(task.updateTaskTaskValidationRule),
    authGuardMiddleware.authGuard("update-task-status"),
  ],
  task.updateStatus
);
employeeRouter.get(
  "/assigned-task",
  [authGuardMiddleware.authGuard("list-task")],
  task.getAssigned
);

export { employeeRouter };
