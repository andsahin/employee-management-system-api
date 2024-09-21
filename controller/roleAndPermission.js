import { Types } from "mongoose";
import { RoleAndPermission } from "../model/roleAndPermission.js";
import { User } from "../model/user.js";
const { ObjectId } = Types;
export const roleAddValidRules = {
  rolesTitle: "required",
  permissions: "required",
  status: "required",
};
export const addUserRole = async (req, res) => {
  try {
    const { rolesTitle, status, permissions } = req.body;

    let newRole = await new RoleAndPermission({
      role_title: rolesTitle.trim(),
      status,
      role_label: rolesTitle.trim().replaceAll(" ", "_").toLowerCase(),
      permissions,
    }).save();

    res.status(201).json({
      status: "success",
      message: "Role Added Successfully",
      data: newRole,
    });
  } catch (err) {
    if (err.code === 11000) {
      const val = err.keyValue[`${Object.keys(err.keyValue)}`];
      res.status(500).json({
        status: "error",
        message: `Duplicate Your Role Title`,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: err?.message,
      });
    }
  }
};
export const updatePermissionValidateRules = {
  rolesTitle: "required",
  permissions: "required",
  status: "required",
};
export const updateRolePermission = async (req, res) => {
  try {
    const { rolesTitle, status, permissions } = req.body;
    const { id } = req.params;

    const info = await RoleAndPermission.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        role_title: rolesTitle.trim(),
        role_label: rolesTitle.trim().replaceAll(" ", "-").toLowerCase(),
        status,
        permissions,
      },
      { new: true }
    );

    if (status === "inactive" && info?.status === "inactive") {
      await User.updateMany(
        { role_permission: info?._id },
        { status: "inactive" }
      );
    }
    res.status(200).json({
      status: "success",
      message: "Role Updated Successfully",
      data: info,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err?.message,
    });
  }
};

export const getRoles = async (req, res) => {
  try {
    //find all role's for add new admin form
    const roles = await RoleAndPermission.find({
      status: "active",
      ownerId: req.userId,
    }).select({
      label: "$rolesTitle",
      value: "$rolesLabel",
    });

    res.status(200).json({
      status: "success",
      message: "Find Successfully",
      data: roles,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err?.message,
    });
  }
};
export const getRoleList = async (req, res) => {
  try {
    //find all role's
    let where = req?.roleId ? { _id: { $ne: new ObjectId(req?.roleId) } } : {};

    const roles = await RoleAndPermission.find(where);

    res.status(200).json({
      status: "success",
      message: "Find Successfully",
      data: roles,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err?.message,
    });
  }
};
export const deleteRole = async (req, res) => {
  try {
    //find all role's for add new admin form
    const { id } = req.params;

    await RoleAndPermission.findOneAndDelete({ _id: id });

    res.status(200).json({
      status: "success",
      message: "Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err?.message,
    });
  }
};
