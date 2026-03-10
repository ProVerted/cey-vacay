const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: null,       // price is optional
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,  // links to a User document
      ref: 'User',                            // tells Mongoose which model to link
      required: true,
    },
    likes: {
      type: Number,
      default: 0,          // starts at 0 likes
    }
  },
  {
    timestamps: true,      // auto adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Listing', listingSchema);