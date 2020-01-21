const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  githubUsername: {
    type: String
  },
  social: {
    facebook: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    youtube: { type: String },
    twitter: { type: String }
  },
  date: {
    type: Date,
    default: new Date()
  }
});

module.exports = Profile = mongoose.model('profile', profileSchema);
