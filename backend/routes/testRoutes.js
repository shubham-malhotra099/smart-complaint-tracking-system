const express = require("express");

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
    });
  }
);

router.get(
  "/user",
  protect,
  authorizeRoles("user", "admin"),
  (req, res) => {
    res.json({
      message: "Welcome User",
    });
  }
);

module.exports = router;