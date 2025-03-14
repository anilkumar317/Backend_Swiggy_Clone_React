const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv');

dotEnv.config();

const secretKey = process.env.SECRET_KEY;

const vendorRegister = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const vendorEmail = await Vendor.findOne({ email });
    if (vendorEmail) {
      return res.status(400).json('Email already exist');
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newVendor = new Vendor({ username, email, password: hashPassword });

    await newVendor.save();

    res.status(200).json({ message: 'Vendor register successful' });
    console.log(newVendor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: 'Internal server error' });
  }
};

const vendorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const vendor = await Vendor.findOne({ email });
    const comparedPassword = await bcrypt.compare(password, vendor.password);

    if (!vendor || !comparedPassword) {
      return res.status(401).json({ Error: 'Invalid username or password' });
    }

    const token = jwt.sign({ vendorId: vendor._id }, secretKey, {
      expiresIn: '1h',
    });

    res.status(201).json({ success: 'Login Successfully', token });
    console.log(email, 'This is token:', token);
  } catch (error) {
    console.error(error);
    res.status(400).json({ Error: 'Internal server error' });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate('firm');
    res.json({ vendors });
  } catch (err) {
    console.error(err);
    res.status(500).json('Internal server error');
  }
};

const getVendorById = async (req, res) => {
  const vendorId = req.params.id;

  try {
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(400).json({ message: 'vendor not fot found' });
    }

    res.status(200).json({ vendor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: 'Internal server error' });
  }
};

module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById };
