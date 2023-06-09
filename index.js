require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const serviceHandler = require('./routes/v1/service_handler');
const doctorHandler = require('./routes/v1/doctor_handler');
const appointmentHandler = require('./routes/v1/appointment_handler');
const userHandler = require('./routes/v1/user_handler');
const { createZoomMeeting } = require('./helpers/halpers');

const app = express();



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
app.use('/api/v1/appointments', appointmentHandler);
app.use('/api/v1/users', userHandler);

app.get('/zoom/create-meeting', async (req, res) => {

  const meetingInfo = {
    topic: 'health care',
    type: 2, // Scheduled meeting
    duration: 30,
    start_time: new Date().toISOString(),

  }

  const meeting = await createZoomMeeting(meetingInfo);

  res.json(meeting);
});
app.get('/', (req, res) => res.send({ message: 'server is running!' }));
app.listen(process.env.PORT, () => console.log(`server running on ${process.env.PORT}`));