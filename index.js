const mongoose = require('mongoose');
const express = require('express');
const dotEnv = require('dotenv');
const bodyParser = require('body-parser');
const vendorRouts = require('./routes/vendorRoutes');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const path = require('path');

const app = express();

const PORT = 4000;

dotEnv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((error) => console.log(error));

app.use(bodyParser.json());

app.use('/vendor', vendorRouts);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
  console.log(`Server has been started and running at ${PORT}`);
});

app.get('/home', (req, res) => {
  res.send('<h1> Welcome to Swiggy Clone Application </h1>');
});
