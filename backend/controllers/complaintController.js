const Complaint = require("../models/Complaint");
const cloudinary = require("../config/cloudinary");


// CREATE COMPLAINT
const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
    } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        req.file.path
      );

      imageUrl = result.secure_url;
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      image: imageUrl,
      createdBy: req.user.id,
    });

    res.status(201).json(complaint);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// GET USER'S OWN COMPLAINTS
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      createdBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(complaints);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET ALL PUBLIC COMPLAINTS FOR NORMAL USERS
const getPublicComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    const formattedComplaints = complaints.map((complaint) => {
      const hasVoted = complaint.votes.some(
        (voteUserId) =>
          voteUserId.toString() === req.user.id.toString()
      );

      return {
        ...complaint.toObject(),
        voteCount: complaint.votes.length,
        hasVoted,
      };
    });

    res.json(formattedComplaints);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// VOTE / UNVOTE COMPLAINT
const toggleVoteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    const userId = req.user.id.toString();

    const alreadyVoted = complaint.votes.some(
      (voteUserId) => voteUserId.toString() === userId
    );

    if (alreadyVoted) {
      complaint.votes = complaint.votes.filter(
        (voteUserId) => voteUserId.toString() !== userId
      );
    } else {
      complaint.votes.push(req.user.id);
    }

    await complaint.save();

    res.json({
      message: alreadyVoted
        ? "Vote removed successfully"
        : "Vote added successfully",
      voteCount: complaint.votes.length,
      hasVoted: !alreadyVoted,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// GET ALL COMPLAINTS - ADMIN
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// UPDATE COMPLAINT STATUS - ADMIN
const updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findById(
      req.params.id
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    complaint.status =
      req.body.status || complaint.status;

    complaint.adminRemark =
      req.body.adminRemark || complaint.adminRemark;

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        req.file.path
      );

      complaint.resolutionImage = result.secure_url;
    }

    await complaint.save();

    res.json({
      message: "Complaint updated successfully",
      complaint,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// UPDATE OWN COMPLAINT - USER ONLY IF PENDING
const updateMyComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(
      req.params.id
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    if (
      complaint.createdBy.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to edit this complaint",
      });
    }

    if (complaint.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending complaints can be edited",
      });
    }

    complaint.title =
      req.body.title || complaint.title;

    complaint.description =
      req.body.description || complaint.description;

    complaint.category =
      req.body.category || complaint.category;

    complaint.location =
      req.body.location || complaint.location;

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        req.file.path
      );

      complaint.image = result.secure_url;
    }

    await complaint.save();

    res.json({
      message: "Complaint updated successfully",
      complaint,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// DELETE OWN COMPLAINT - USER ONLY IF PENDING
const deleteMyComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(
      req.params.id
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    if (
      complaint.createdBy.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to delete this complaint",
      });
    }

    if (complaint.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending complaints can be deleted",
      });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.json({
      message: "Complaint deleted successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  createComplaint,
  getMyComplaints,
  getPublicComplaints,
  toggleVoteComplaint,
  getAllComplaints,
  updateComplaintStatus,
  updateMyComplaint,
  deleteMyComplaint,
};