const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,      // name is mandatory
      trim: true,          // removes extra spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,        // no two users can have same email
      lowercase: true,     // stores email in lowercase always
    },
    password: {
      type: String,
      required: true,      // will be stored as a hash, never plain text
    },
  },
  {
    timestamps: true,      // auto adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('User', userSchema);