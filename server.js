const dns = require("dns");

dns.setServers(["8.8.8.8"]);
require("dotenv").config();
const employeeRoutes = require("./routes/employeeRoutes");

const express = require("express");
const connectDB = require("./config/db");
const Employee = require("./models/Employee");
const app = express();

connectDB();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");
app.get("/", (req, res) => {
  res.send("Employee Management API");
});
app.use("/employees", employeeRoutes);
app.use(errorHandler);
app.use("/auth", authRoutes);
// app.get("/employees/:id", async (req, res) => {
//   try {
//     const employee = await Employee.findById(req.params.id);

//     if (!employee) {
//       return res.status(404).json({
//         message: "Employee not found",
//       });
//     }

//     res.status(200).json(employee);
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch employee",
//       error: error.message,
//     });
//   }
// });
// app.get("/employees", async (req, res) => {
//   try {
//     const employees = await Employee.find();

//     res.status(200).json(employees);
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch employees",
//       error: error.message,
//     });
//   }
// });
// // app.post("/employees", async (req, res) => {
// //   try {
// //     const { name, email, role, department, salary, status } = req.body;

// //     if (!name || !email || !role || !department || !salary) {
// //       return res.status(400).json({
// //         message: "Name, email, role, department and salary are required",
// //       });
// //     }

// //     const employee = await Employee.create({
// //       name,
// //       email,
// //       role,
// //       department,
// //       salary,
// //       status,
// //     });

// //     res.status(201).json(employee);
// //   } catch (error) {
// //     res.status(500).json({
// //       message: "Failed to create employee",
// //       error: error.message,
// //     });
// //   }
// // });
// app.patch("/employees/:id", async (req, res) => {
//   try {
//     const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!employee) {
//       return res.status(404).json({
//         message: "Employee not found",
//       });
//     }

//     res.status(200).json(employee);
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to update employee",
//       error: error.message,
//     });
//   }
// });
// app.delete("/employees/:id", async (req, res) => {
//   try {
//     const employee = await Employee.findByIdAndDelete(req.params.id);

//     if (!employee) {
//       return res.status(404).json({
//         message: "Employee not found",
//       });
//     }

//     res.status(200).json({
//       message: "Employee deleted successfully",
//       employee,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to delete employee",
//       error: error.message,
//     });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
