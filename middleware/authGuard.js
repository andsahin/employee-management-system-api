import jwt from "jsonwebtoken";
import { User } from "../model/user.js";
const { verify } = jwt;

const loginCheck = (req, resp, next) => {
  if (!req.headers.authorization) {
    console.log("--1");

    return resp.status(401).json({
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
        console.log("--2");
        return resp.status(401).json({
          status: "error",
          message: "Unauthorized!",
        });
      }

      req.userId = decoded.id;
      next();
    });
  } catch (error) {
    console.log("--3");
    resp.status(401).json({
      status: "error",
      message: error.message,
    });
  }
};

function authGuard(features) {
  return async (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).json({
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
          return res.status(401).json({
            status: "error",
            message: "Unauthorized!",
          });
        }

        const userInfo = await User.findById(decoded?.info._id)
          .populate("role_permission", "_id permissions")
          .select("-password");

        if (userInfo?.role !== "admin-hr" && features !== "common") {
          if (!userInfo?.role_permission?.permissions) {
            return res.status(419).json({
              status: "error",
              message: "Access denied!",
            });
          }
          //check permission
          if (
            !userInfo?.role_permission?.permissions[features] ||
            userInfo?.role_permission?.permissions[features] == false
          ) {
            return res.status(419).json({
              status: "error",
              message: "Access denied!",
            });
          }
        }
        req.userId = decoded?.info?._id;
        req.role = decoded?.info?.role;
        next();
      });
    } catch (error) {
      console.log(error);

      res.status(401).json({
        status: "error",
        message: error.message,
      });
    }
  };
}
function authGuardBk(features) {
  return async (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).json({
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
          return res.status(401).json({
            status: "error",
            message: "Unauthorized!",
          });
        }

        const userInfo = await User.findById(decoded?.info._id)
          .populate("role_permission", "_id permissions")
          .select("role");

        if (userInfo?.role !== "admin-hr" && features !== "employee") {
          if (!userInfo?.role_permission?.permissions) {
            return res.status(419).json({
              status: "error",
              message: "Access denied!",
            });
          }
          //check permission
          if (
            !userInfo?.role_permission?.permissions[features] ||
            userInfo?.role_permission?.permissions[features] == false
          ) {
            return res.status(419).json({
              status: "error",
              message: "Access denied!",
            });
          }
        }
        req.userId = decoded?.info?._id;
        req.role = decoded?.info?.role;
        next();
      });
    } catch (error) {
      console.log(error);

      res.status(401).json({
        status: "error",
        message: error.message,
      });
    }
  };
}

export { authGuard, loginCheck };
