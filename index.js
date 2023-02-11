const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const serviceHandler = require('./routes/service_handler');
const doctorHandler = require('./routes/doctor_handler');
const bookingHandler = require('./routes/booking_handler');


const app = express();
require('dotenv').config();


app.use(express.json());
app.use(cors());


const connection = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.DB)
    .then(() => console.log('database connection successful'))
    .catch((err) => console.log(err));
}
connection();

app.use('/api/v1/services', serviceHandler);
app.use('/api/v1/doctors', doctorHandler);
app.use('/api/v1/bookings', bookingHandler);


app.get('/', (req, res) => res.send({ message: 'server is running!' }));
app.listen(process.env.PORT, () => console.log(`server running on ${process.env.PORT}`));