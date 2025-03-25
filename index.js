const mongoose = require('mongoose');
const express = require('express');
const dotEnv = require('dotenv');
const bodyParser = require('body-parser');
const vendorRouts = require('./routes/vendorRoutes');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');

const app = express();
app.use(
  cors({
    origin: [
      'https://react-swiggy-clone-backend-dashboard.vercel.app',
      'http://localhost:4000', // For local testing
    ],
  })
);

const PORT = process.env.PORT || 4000;

dotEnv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((error) => console.log(error));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/vendor', vendorRouts);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
  console.log(`Server has been started and running at ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('<h1> Welcome to Swiggy Clone Application </h1>');
});
