const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');

// ── GET /api/listings ─────────────────────────────────
// Public — anyone can see all listings (newest first)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query; // for optional search feature

    let query = {};

    // If search term provided, look in title and location
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },      // case-insensitive
          { location: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const listings = await Listing.find(query)
      .populate('creator', 'name email')  // replace creator ID with actual name/email
      .sort({ createdAt: -1 });           // newest first

    res.json(listings);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── GET /api/listings/:id ─────────────────────────────
// Public — get a single listing by ID
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('creator', 'name email');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json(listing);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── POST /api/listings ────────────────────────────────
// Protected — only logged-in users can create
router.post('/', protect, async (req, res) => {
  try {
    const { title, location, imageUrl, description, price } = req.body;

    // Validate required fields
    if (!title || !location || !imageUrl || !description) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const listing = await Listing.create({
      title,
      location,
      imageUrl,
      description,
      price: price || null,
      creator: req.userId,    // comes from the auth middleware
    });

    // Populate creator info before sending back
    const populated = await listing.populate('creator', 'name email');

    res.status(201).json(populated);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── PUT /api/listings/:id ─────────────────────────────
// Protected — only the creator can edit
router.put('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Make sure the logged-in user is the creator
    if (listing.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this listing' });
    }

    const { title, location, imageUrl, description, price } = req.body;

    listing.title = title || listing.title;
    listing.location = location || listing.location;
    listing.imageUrl = imageUrl || listing.imageUrl;
    listing.description = description || listing.description;
    listing.price = price !== undefined ? price : listing.price;

    const updated = await listing.save();
    const populated = await updated.populate('creator', 'name email');

    res.json(populated);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── DELETE /api/listings/:id ──────────────────────────
// Protected — only the creator can delete
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Make sure the logged-in user is the creator
    if (listing.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await listing.deleteOne();

    res.json({ message: 'Listing deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── POST /api/listings/:id/like ───────────────────────
// Protected — like a listing
router.post('/:id/like', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    listing.likes += 1;
    await listing.save();

    res.json({ likes: listing.likes });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;