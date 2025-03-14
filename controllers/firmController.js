const multer = require('multer');
const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the directory to store uploaded files
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Set the file name (including extension)
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// const upload = multer({ storage: storage });

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept only image files (JPG, PNG, GIF, JPEG)
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'));
    }
  },
}).single('image');

const addFirm = async (req, res) => {
  try {
    const { firmName, area, category, region, offer } = req.body;

    const image = req.file ? req.file.filename : undefined;

    const vendor = await Vendor.findById(req.vendorId);

    if (!vendor) {
      res.status(404).json({ message: 'Vendor not found' });
    }

    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor._id,
    });

    const savedFirm = await firm.save();

    vendor.firm.push(savedFirm);

    await vendor.save();

    return res.status(201).json({ message: 'Firm added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteFirmById = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const deletedFirm = await Firm.findByIdAndDelete('firmId');

    if (!deletedFirm) {
      return res.status(404).json({ error: 'No firm found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { addFirm, upload, deleteFirmById };
