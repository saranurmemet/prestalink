const Contact = require('../models/Contact');
const asyncHandler = require('../utils/asyncHandler');

exports.submitContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ 
      message: 'Name, email, and message are required' 
    });
  }

  // Create contact message
  const contact = await Contact.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim(),
  });

  res.status(201).json({
    message: 'Contact form submitted successfully',
    contact: {
      id: contact._id,
      name: contact.name,
      email: contact.email,
      status: contact.status,
      createdAt: contact.createdAt,
    },
  });
});

exports.getContacts = asyncHandler(async (req, res) => {
  // Only admins can view contact messages
  if (!['admin', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const contacts = await Contact.find()
    .sort({ createdAt: -1 })
    .select('-__v');

  res.json(contacts);
});

exports.updateContactStatus = asyncHandler(async (req, res) => {
  // Only admins can update contact status
  if (!['admin', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { id } = req.params;
  const { status } = req.body;

  const contact = await Contact.findById(id);
  if (!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }

  contact.status = status || contact.status;
  await contact.save();

  res.json(contact);
});


