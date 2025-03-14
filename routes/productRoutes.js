const express = require('express');
const prodctController = require('../controllers/productController');

const router = express.Router();

router.post('/add-product/:firmId', prodctController.addProduct);
router.get('/:firmId/products', prodctController.getProductByFirm);
router.get('/upload/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  res.headersSent('Content-Type', 'image/jpeg');
  res.sendFile(__dirname, '..', 'uploads', imageName);
});

router.delete('/:productId', prodctController.deleteProductById);

module.exports = router;
