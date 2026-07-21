const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
router.get("/", authMiddleware, getAllEmployees);
router.get("/:id", authMiddleware, getEmployeeById);
router.post("/", authMiddleware, roleMiddleware("admin"), createEmployee);
router.patch("/:id", authMiddleware, roleMiddleware("admin"), updateEmployee);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteEmployee);
module.exports = router;
