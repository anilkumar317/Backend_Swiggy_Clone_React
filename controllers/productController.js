const Firm = require('../models/Firm');
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { default: mongoose } = require('mongoose');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
  console.log('Product Info:', req.body);
  console.log('Received Firm ID:', req.params.firmId);
  try {
    const { productName, price, category, bestseller, description } = req.body;

    const image = req.file ? req.file.filename : undefined;

    // Extract firmId from params and validate it
    const firmId = req.params.firmId;
    if (!mongoose.Types.ObjectId.isValid(firmId)) {
      return res.status(400).json({ error: 'Invalid firm ID format' });
    }

    const firm = await Firm.findById(firmId);

    if (!firm) {
      return res.status(404).json({ error: 'No firm found' });
    }

    const categoryArray = Array.isArray(category)
      ? category
      : category
      ? [category]
      : [];

    const product = new Product({
      productName,
      price,
      category: categoryArray,
      bestseller: bestseller === 'true',
      description,
      image,
      firm: firm._id,
    });

    const savedProduct = await product.save();

    firm.products.push(savedProduct);

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

module.exports = {
  addProduct: [upload.single('image'), addProduct],
  getProductByFirm,
  deleteProductById,
};
