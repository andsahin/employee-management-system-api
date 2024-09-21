import { Types } from "mongoose";
import { Task } from "../../model/task.js";
const { ObjectId } = Types;

export const addTaskValidationRule = {
  title: "required",
  description: "required",
  due_date: "required",
  priority: "required",
};
export const updateTaskValidationRule = {
  title: "required",
  description: "required",
  due_date: "required",
  priority: "required",
};
export const updateTaskTaskValidationRule = {
  status: "required",
};

export const add = async (req, res) => {
  try {
    const { title, description, due_date, priority } = req.body;

    const newTask = await Task({
      title,
      description,
      created_by: req.userId,
      due_date,
      priority,
      ip_address: req.socket.remoteAddress,
    }).save();

    res.status(201).json({
      status: "success",
      message: `Task created successfully`,
      data: newTask,
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
    const myTask = await Task.find({ created_by: req.userId });

    res.status(200).json({
      status: "success",
      message: "Find my all task successfully",
      data: myTask,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    res.status(200).json({
      status: "success",
      message: "Find task successfully",
      data: task,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, priority } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, status: { $ne: "done" } },
      {
        title,
        description,
        due_date,
        priority,
      },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: `Task updated successfully`,
      data: updatedTask,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, status: { $ne: "done" } },
      {
        status,
      },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: `Task status updated successfully`,
      data: updatedTask,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const getAssigned = async (req, res) => {
  try {
    const myTask = await Task.find({ assigned_to: req.userId });

    res.status(200).json({
      status: "success",
      message: "Find assigned task successfully",
      data: myTask,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
