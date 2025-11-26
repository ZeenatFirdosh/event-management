
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const Profile = require('../models/Profile');
const Event = require('../models/Event');
const EventUpdateLog = require('../models/EventUpdateLog');

dayjs.extend(utc);
dayjs.extend(timezone);

exports.createEvent = async (req, res) => {
  try {
    const { profiles, timezone, startDateTime, endDateTime } = req.body;

    // Validation
    if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one profile is required'
      });
    }

    if (!timezone || !startDateTime || !endDateTime) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'End date/time must be after start date/time'
      });
    }

    if (start < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Start date/time cannot be in the past'
      });
    }

    // Verify all profiles exist
    const existingProfiles = await Profile.find({ _id: { $in: profiles } });
    if (existingProfiles.length !== profiles.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more profiles do not exist'
      });
    }

    const event = new Event({
      profiles,
      timezone,
      startDateTime: start,
      endDateTime: end
    });
    console.log(" Creating event:", event);
    const result = await event.save();
    await event.populate('profiles', 'name timezone');

    res.status(201).json({
      success: true,
      data: result,
      message: 'Event created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('profiles', 'name timezone')
      .lean()
      .sort({ startDateTime: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getEventsByProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const { timezone } = req.query;

    // Using indexed query for better performance
    const events = await Event.find({ profiles: profileId })
      .populate('profiles', 'name timezone')
      .lean()
      .sort({ startDateTime: -1 });

    // Convert timestamps to user's timezone if provided
    if (timezone) {
      events.forEach(event => {
        event.startDateTime = dayjs(event.startDateTime).tz(timezone).format();
        event.endDateTime = dayjs(event.endDateTime).tz(timezone).format();
        event.createdAt = dayjs(event.createdAt).tz(timezone).format();
        event.updatedAt = dayjs(event.updatedAt).tz(timezone).format();
      });
    }

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('profiles', 'name timezone');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { profiles, timezone, startDateTime, endDateTime } = req.body;

    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Store changes for logging using efficient comparison
    const logs = [];

    if (profiles && JSON.stringify(profiles) !== JSON.stringify(existingEvent.profiles.map(p => p.toString()))) {
      logs.push({
        eventId: id,
        changes: {
          field: 'profiles',
          oldValue: existingEvent.profiles,
          newValue: profiles
        }
      });
    }

    if (timezone && timezone !== existingEvent.timezone) {
      logs.push({
        eventId: id,
        changes: {
          field: 'timezone',
          oldValue: existingEvent.timezone,
          newValue: timezone
        }
      });
    }

    if (startDateTime) {
      const newStart = new Date(startDateTime);
      if (newStart.getTime() !== existingEvent.startDateTime.getTime()) {
        logs.push({
          eventId: id,
          changes: {
            field: 'startDateTime',
            oldValue: existingEvent.startDateTime,
            newValue: newStart
          }
        });
      }
    }

    if (endDateTime) {
      const newEnd = new Date(endDateTime);
      if (newEnd.getTime() !== existingEvent.endDateTime.getTime()) {
        logs.push({
          eventId: id,
          changes: {
            field: 'endDateTime',
            oldValue: existingEvent.endDateTime,
            newValue: newEnd
          }
        });
      }
    }

    // Update event
    const updateData = {};
    if (profiles) updateData.profiles = profiles;
    if (timezone) updateData.timezone = timezone;
    if (startDateTime) updateData.startDateTime = new Date(startDateTime);
    if (endDateTime) updateData.endDateTime = new Date(endDateTime);

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('profiles', 'name timezone');

    // Batch insert logs for efficiency
    if (logs.length > 0) {
      await EventUpdateLog.insertMany(logs);
    }

    res.status(200).json({
      success: true,
      data: updatedEvent,
      message: 'Event updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Also delete associated logs
    await EventUpdateLog.deleteMany({ eventId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getEventLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const { timezone } = req.query;

    // Using indexed query with sorting
    const logs = await EventUpdateLog.find({ eventId: id })
      .lean()
      .sort({ timestamp: -1 });

    // Convert timestamps to user's timezone if provided
    if (timezone) {
      logs.forEach(log => {
        log.timestamp = dayjs(log.timestamp).tz(timezone).format();
        
        // Convert date values in changes if they exist
        if (log.changes.field === 'startDateTime' || log.changes.field === 'endDateTime') {
          if (log.changes.oldValue) {
            log.changes.oldValue = dayjs(log.changes.oldValue).tz(timezone).format();
          }
          if (log.changes.newValue) {
            log.changes.newValue = dayjs(log.changes.newValue).tz(timezone).format();
          }
        }
      });
    }

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};