const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Employee name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
  },

  email: {
    type: String,
    required: [true, "Employee email is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },

  role: {
    type: String,
    required: [true, "Employee role is required"],
    trim: true,
  },

  department: {
    type: String,
    required: [true, "Employee department is required"],
    trim: true,
  },

  salary: {
    type: Number,
    required: [true, "Employee salary is required"],
    min: [0, "Salary cannot be negative"],
  },

  status: {
    type: String,
    enum: {
      values: ["active", "inactive"],
      message: "Status must be either active or inactive",
    },
    default: "active",
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
