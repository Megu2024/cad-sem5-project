import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import { seedDoctors } from './config/seedDoctors.js';

// app config
const app = express();
const port = process.env.PORT || 4000;

// connect to services
if (process.env.MONGODB_URI) {
  connectDB()
    .then(() => seedDoctors())
    .catch((err) => console.log('MongoDB connection error:', err.message));
}
if (process.env.CLOUDINARY_NAME) {
  connectCloudinary();
}

// middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


const allowedOrigins = [
  'https://d1i4ralnpk39il.cloudfront.net',
  'http://localhost:5173',
  'http://localhost:5174',
  ...(process.env.FRONTEND_URL || '')
    .split(',')
    .map(origin => origin.trim().replace(/\/$/, ''))
    .filter(Boolean)
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      return callback(null, true);
    }

    console.error('Error: Origin not allowed by CORS:', origin);
    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true
}));





app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'prescripto-api'
  });
});


// api endpoints
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
  res.send('API WORKING');
});

app.listen(port, () => console.log('Server Started on PORT:', port));
