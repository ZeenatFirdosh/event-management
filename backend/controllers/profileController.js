// controllers/profileController.js
const Profile = require('../models/Profile');
const Event = require('../models/Event');
const EventUpdateLog = require('../models/EventUpdateLog');

exports.createProfile = async (req, res) => {
  try {
    const { name, timezone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Profile name is required'
      });
    }

    const profile = new Profile({
      name: name.trim(),
      timezone: timezone || 'Asia/Kolkata'
    });

    await profile.save();

    res.status(201).json({
      success: true,
      data: profile,
      message: 'Profile created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllProfiles = async (req, res) => {
  try {
    // Using lean() for better performance when we don't need mongoose methods
    const profiles = await Profile.find().lean().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateTimezone = async (req, res) => {
  try {
    const { timezone } = req.body;
    const { id } = req.params;

    if (!timezone) {
      return res.status(400).json({
        success: false,
        message: 'Timezone is required'
      });
    }

    const profile = await Profile.findByIdAndUpdate(
      id,
      { timezone },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
      message: 'Timezone updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};