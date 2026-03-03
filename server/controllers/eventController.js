const Event = require('../models/Event');

// @route   POST api/events
// @desc    Create a new event
// @access  Private/Admin
exports.createEvent = async (req, res) => {
  const { name, description, startDate, endDate, goalType, goalValue } = req.body;

  try {
    const newEvent = new Event({
      name,
      description,
      startDate,
      endDate,
      goalType,
      goalValue,
    });

    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/events
// @desc    Get all active events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ endDate: { $gte: new Date() } });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST api/events/join/:eventId
// @desc    Join an event
// @access  Private
exports.joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    if (event.participants.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Already participating' });
    }

    event.participants.push(req.user.id);
    await event.save();

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
