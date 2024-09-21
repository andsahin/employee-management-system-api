import express from "express";
import * as auth from "../controller/auth.js";
import * as roleAndPermission from "../controller/roleAndPermission.js";
// import * as settings from "../controller/settings.js";
import * as employee from "../controller/admin-hr/employee.js";
import * as authGuardMiddleware from "../middleware/authGuard.js";
import { validation } from "../middleware/validation.js";

const router = express.Router();

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});

/**
 * AUTH API
 */
router.post(
  "/registration",
  validation(auth.regValidationRule),
  auth.registration
);

router.post("/login", validation(auth.loginValidateRule), auth.login);

//add-employee only for admin-hr
router.post(
  "/add-employee",
  validation(employee.addEmployeeValidationRule),
  authGuardMiddleware.authGuard(""),
  employee.addEmployee
);
router.post(
  "/get-all-employee",
  authGuardMiddleware.authGuard(""),
  employee.getAllEmployee
);

/**
 * Attendance API
 */
router.get(
  "/all-employee-attendance",
  authGuardMiddleware.authGuard(""),
  employee.employeeAttendance
);
/**
 * Leave req API
 */
router.get(
  "/get-all-leave-request",
  authGuardMiddleware.authGuard(""),
  employee.getAllLeaveRequest
);
router.get(
  "/leave-request-by-id/:id",
  authGuardMiddleware.authGuard(""),
  employee.leaveRequestFindById
);
router.put(
  "/leave-request-update-status/:id",
  [
    validation(employee.leaveRequestStatusValidation),
    authGuardMiddleware.authGuard(""),
  ],
  employee.leaveRequestUpdateStatus
);

/**
 * Role Management API
 */

router.post(
  "/add-role",
  [
    authGuardMiddleware.authGuard(""),
    validation(roleAndPermission.roleAddValidRules),
  ],
  roleAndPermission.addUserRole
);
router.put(
  "/update-role/:id",
  [
    authGuardMiddleware.authGuard(""),
    validation(roleAndPermission.updatePermissionValidateRules),
  ],
  roleAndPermission.updateRolePermission
);
router.delete(
  "/delete-role/:id",
  [authGuardMiddleware.authGuard("")],
  roleAndPermission.deleteRole
);

// router.get("/get-user-role", authGuard("common"), roleAndPermission.getRoles);
router.get(
  "/get-all-role",
  authGuardMiddleware.authGuard(""),
  roleAndPermission.getRoleList
);
// router.delete(
//   "/delete-role/:id",
//   authGuard("common"),
//   roleAndPermission.deleteRole
// );

/**
 * Profile API
 */
router.put(
  "/update-my-profile",
  [
    authGuardMiddleware.authGuard("common"),
    validation(auth.updateProfileValidateRules),
  ],
  auth.updateMyProfile
);
router.get(
  "/my-profile",
  authGuardMiddleware.authGuard("common"),
  auth.myProfile
);

router.put(
  "/change-password",
  [
    authGuardMiddleware.authGuard("common"),
    validation(auth.changePassValidity),
  ],
  auth.changePassword
);

/**
 * Forgot password API
 */
router.post(
  "/forgot-password",
  validation(auth.forgotPassValidity),
  auth.forgotPassword
);
router.put(
  "/verify-code-from-forgot-pass",
  validation(auth.verifyCodeValidity),
  auth.verifyCodeForgotPass
);

router.put("/password-reset-verification/:id", auth.passwordResetVerify);
router.put(
  "/password-reset-from-forgot-pass/:id",
  validation(auth.passwordResetFromForgotValidity),
  auth.passwordResetFromForgotPassReq
);

// /**
//  * User API
//  */
// router.post(
//   "/add-admin-user",
//   [authGuard("backofficeUserAdd"), validation(users.signUpValidateRules)],
//   users.addAdminUser
// );

// router.put(
//   "/update-admin-user/:id",
//   [authGuard("backofficeUserEdit"), validation(users.updateValidateRules)],
//   users.updateAdminUser
// );
// router.get(
//   "/get-all-admin-user",
//   authGuard("backofficeUserList"),
//   users.getAllAdminUser
// );
// router.get(
//   "/get-admin-user-by-id/:id",
//   authGuard("backofficeUserEdit"),
//   users.getAdminUserById
// );
// router.delete(
//   "/delete-admin-user/:id",
//   authGuard("backofficeUserDelete"),
//   users.deleteAdminUser
// );

export { router };
