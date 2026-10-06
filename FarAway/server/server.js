require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors');
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5174', 'http://localhost:5173', 'https://learning-ten-gold.vercel.app'];

const app = express();
const port = process.env.PORT || 3000;

let dbUrl = process.env.DATABASE;
dbUrl = dbUrl.replace('<db_password>', (process.env.DATABASE_PASSWORD))
const connect = async () => {
    try {
        await mongoose.connect(dbUrl);
        console.log('DB connected');
    } catch(error) {
        console.log('Not Connected : ', error);
        process.exit(1);
    }
}

connect();

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
//   credentials: true, // Set to true if you pass cookies or authorization headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use((req, res, next) => {
    console.log('called the server');
    next();
})
app.use('/api/tasks', taskRoutes);

app.listen(port, () => {
    console.log('App started on port ', port);
});
