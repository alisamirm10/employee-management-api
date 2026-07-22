const Employee = require("../models/Employee");
const AppError = require("../utils/AppError");

const createEmployee = async (req, res, next) => {
  try {
    const { name, email, role, department, salary, status } = req.body;

    if (!name || !email || !role || !department || !salary) {
      return next(
        new AppError(
          "Name, email, role, department and salary are required",
          400,
        ),
      );
    }

    const employee = await Employee.create({
      name,
      email,
      role,
      department,
      salary,
      status,
    });

    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
};
const getAllEmployees = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { department, status, search, sort } = req.query;
    const allowedSortFields = [
      "name",
      "email",
      "salary",
      "department",
      "status",
      "createdAt",
    ];
    let sortOption = {};
    if (sort) {
      const sortFields = sort.split(",");

      sortFields.forEach((field) => {
        const sortOrder = field.startsWith("-") ? -1 : 1;

        const fieldName = field.startsWith("-") ? field.substring(1) : field;

        if (allowedSortFields.includes(fieldName)) {
          sortOption[fieldName] = sortOrder;
        }
      });
    }

    const filter = {};

    if (department) {
      filter.department = department;
    }

    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }
    const skip = (page - 1) * limit;

    const totalEmployees = await Employee.countDocuments(filter);

    const totalPages = Math.ceil(totalEmployees / limit);

    const employees = await Employee.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sortOption);

    res.status(200).json({
      page,
      limit,
      totalEmployees,
      totalPages,
      employees,
    });
  } catch (error) {
    next(error);
  }
};
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch employee",
      error: error.message,
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update employee",
      error: error.message,
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json({
      message: "Employee deleted successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete employee",
      error: error.message,
    });
  }
};
module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
