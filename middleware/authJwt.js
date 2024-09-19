import jwt from "jsonwebtoken";
import { User } from "../model/user.js";
import * as variables from "../variables.js";
const { verify } = jwt;

const loginCheck = (req, resp, next) => {
  if (!req.headers.authorization) {
    return resp.status(500).json({
      status: "error",
      message: "Unauthorized!",
    });
  }

  const { authorization } = req.headers;
  const arr = authorization.split(" ");
  const token = arr[1];

  try {
    if (!token) {
      throw new Error("Unauthorized!");
    }
    verify(token, variables.jwtSecret, async (err, decoded) => {
      if (err) {
        return resp.status(500).json({
          status: "error",
          message: "Unauthorized!",
        });
      }

      req.userId = decoded.id;
      next();
    });
  } catch (error) {
    resp.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

function authGuard(features) {
  return async (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(500).json({
        status: "error",
        message: "Unauthorized!",
      });
    }

    const { authorization } = req.headers;

    const arr = authorization.split(" ");
    const token = arr[1];
    try {
      if (!token) {
        throw new Error("Unauthorized!");
      }

      verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Unauthorized!",
          });
        }
        console.log("decoded", decoded);
        console.log("decoded?.info.id", decoded?.info._id);

        const adminInfo = await User.findById(decoded?.info._id)
          .populate("role_info", "_id permissions")
          .populate("shop_info", "_id shopName phone address")
          .select("role");

        // console.log("adminInfo=", adminInfo);

        if (adminInfo?.role !== "superadmin" && features !== "common") {
          if (!adminInfo?.role_info?.permissions) {
            return res.status(419).json({
              status: "error",
              message: "Access denied!",
            });
          }
          //check permission
          if (
            !adminInfo?.role_info?.permissions[features] ||
            adminInfo?.role_info?.permissions[features] == false
          ) {
            return res.status(419).json({
              status: "error",
              message: "Access denied!",
            });
          }
        }

        req.userId = decoded?.info?._id;
        req.roleId = decoded?.info?.roleId;
        req.role = decoded?.info?.role;
        next();
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };
}

export { authGuard, loginCheck };
