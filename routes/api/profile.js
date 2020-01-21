const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');

// @route     GET api/profile/me
// @desc      Get current user profile
// @access    Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'No Profile for current user' }] });
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
});

// @route     POST api/profile/
// @desc      create/update user profile
// @access    Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills are required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      skills,
      githubUsername,
      facebook,
      instagram,
      youtube,
      twitter,
      linkedin
    } = req.body;

    // Create userProfile
    const userProfile = {};
    userProfile.id = req.user.id;
    if (company) userProfile.company = company;
    if (website) userProfile.website = website;
    if (location) userProfile.location = location;
    if (bio) userProfile.bio = bio;
    if (status) userProfile.status = status;
    if (skills)
      userProfile.skills = skills.split(',').map(skill => skill.trim());
    if (githubUsername) userProfile.githubUsername = githubUsername;

    userProfile.social = {};
    if (facebook) userProfile.social.facebook = facebook;
    if (instagram) userProfile.social.instagram = instagram;
    if (youtube) userProfile.social.youtube = youtube;
    if (twitter) userProfile.social.twitter = twitter;
    if (linkedin) userProfile.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: userProfile },
          { new: true }
        );
        return res.json(profile);
      }
      // Create new profile
      profile = new Profile(userProfile);
      await profile.save();
      res.json(profile);
    } catch (err) {
      res.status(500).send('Server Error');
    }
  }
);

// @route     GET api/profile/
// @desc      Get all profiles
// @access    Public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
