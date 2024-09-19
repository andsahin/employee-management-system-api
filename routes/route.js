import express from "express";
import * as auth from "../controller/auth.js";
import * as roleAndPermission from "../controller/roleAndPermission.js";
import * as settings from "../controller/settings.js";
import * as users from "../controller/users.js";
import * as verify from "../middleware/authJwt.js";
import { authGuard } from "../middleware/authJwt.js";
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
router.post("/login", validation(auth.loginValidateRule), auth.loginUser);

/**
 * Others api
 */

/** settings routes */
router.put("/settings", verify.loginCheck, settings.settings);
router.post("/addPlan", verify.loginCheck, settings.addSubscriptionPlane);
router.put("/buyPlan", verify.loginCheck, auth.buySubscription);

/**
 * Role Management API
 */

router.post(
  "/add-role",
  [authGuard("common"), validation(roleAndPermission.roleAddValidRules)],
  roleAndPermission.addUserRole
);
router.put(
  "/update-role/:id",
  [
    authGuard("common"),
    validation(roleAndPermission.updatePermissionValidateRules),
  ],
  roleAndPermission.updateRolePermission
);

router.get("/get-user-role", authGuard("common"), roleAndPermission.getRoles);
router.get("/get-all-role", authGuard("common"), roleAndPermission.getRoleList);
router.delete(
  "/delete-role/:id",
  authGuard("common"),
  roleAndPermission.deleteRole
);

/**
 * Profile API
 */
router.put(
  "/update-my-profile",
  [authGuard("common"), validation(auth.updateProfileValidateRules)],
  auth.updateMyProfile
);
router.get("/my-profile", authGuard("common"), auth.myProfile);

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

router.get("/password-reset-verification/:id", auth.passwordResetVerify);
router.put(
  "/password-reset-from-forgot-pass/:id",
  validation(auth.passwordResetFromForgotValidity),
  auth.passwordResetFromForgotPassReq
);
router.put(
  "/change-password",
  [authGuard("common"), validation(auth.changePassValidity)],
  auth.changePassword
);

/**
 * User API
 */
router.post(
  "/add-admin-user",
  [authGuard("backofficeUserAdd"), validation(users.signUpValidateRules)],
  users.addAdminUser
);

router.put(
  "/update-admin-user/:id",
  [authGuard("backofficeUserEdit"), validation(users.updateValidateRules)],
  users.updateAdminUser
);
router.get(
  "/get-all-admin-user",
  authGuard("backofficeUserList"),
  users.getAllAdminUser
);
router.get(
  "/get-admin-user-by-id/:id",
  authGuard("backofficeUserEdit"),
  users.getAdminUserById
);
router.delete(
  "/delete-admin-user/:id",
  authGuard("backofficeUserDelete"),
  users.deleteAdminUser
);

export { router };
