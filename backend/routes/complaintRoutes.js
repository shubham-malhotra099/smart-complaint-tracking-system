const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const upload = require("../middleware/uploadMiddleware");

const {
  createComplaint,
  getMyComplaints,
  getPublicComplaints,
  toggleVoteComplaint,
  getAllComplaints,
  updateComplaintStatus,
  updateMyComplaint,
  deleteMyComplaint,
} = require("../controllers/complaintController");


// USER - CREATE COMPLAINT
router.post(
  "/",
  protect,
  authorizeRoles("user"),
  upload.single("image"),
  createComplaint
);


// USER - GET OWN COMPLAINTS
router.get(
  "/my",
  protect,
  authorizeRoles("user"),
  getMyComplaints
);


// USER - SEE ALL COMPLAINTS FROM EVERY USER
router.get(
  "/public",
  protect,
  authorizeRoles("user"),
  getPublicComplaints
);


// USER - VOTE / UNVOTE COMPLAINT
router.put(
  "/vote/:id",
  protect,
  authorizeRoles("user"),
  toggleVoteComplaint
);


// USER - UPDATE OWN COMPLAINT ONLY IF PENDING
router.put(
  "/my/:id",
  protect,
  authorizeRoles("user"),
  upload.single("image"),
  updateMyComplaint
);


// USER - DELETE OWN COMPLAINT ONLY IF PENDING
router.delete(
  "/my/:id",
  protect,
  authorizeRoles("user"),
  deleteMyComplaint
);


// ADMIN - GET ALL COMPLAINTS
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllComplaints
);


// ADMIN - UPDATE COMPLAINT STATUS
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  upload.single("resolutionImage"),
  updateComplaintStatus
);


module.exports = router;