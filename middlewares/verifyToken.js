const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

dotEnv.config();

const secretKey = process.env.SECRET_KEY;

const verifyToken = async (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    res.status(400).json({ Error: 'Token has been required' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const vendor = await Vendor.findById(decoded.vendorId);

    if (!vendor) {
      return res.status(404).json({ Error: 'vendor not found' });
    }

    req.vendorId = vendor._id;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Invalid token' });
  }
};

module.exports = verifyToken;
