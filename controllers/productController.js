const Firm = require('../models/Firm');
const Product = require('../models/Product');
const multer = require('multer');
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

const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestSeller, description } = req.body;

    const image = req.file ? req.file.filename : undefined;

    const firmId = req.params.firmId;

    const firm = await Firm.findById(firmId);

    if (!firm) {
      return res.status(404).json({ error: 'No firm found' });
    }

    const product = new Product({
      productName,
      price,
      category,
      bestSeller,
      description,
      image,
      firm: firm._id,
    });

    const savedProduct = await product.save();

    firm.product.push(savedProduct);

    await firm.save();

    res.status(200).json({ savedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProductByFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);

    if (!firm) {
      return res.status(404).json({ error: 'No firm found' });
    }

    const restaurantName = firm.firmName;

    const products = await Product.find({ firm: firmId });
    res.status(200).json({ products, restaurantName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// To delete products

const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId;

    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'No product found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { addProduct, upload, getProductByFirm, deleteProductById };
