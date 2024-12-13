const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeModel = require('./models/Employee');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: '../.env' }); // Import dotenv to load environment variables

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));

// Use environment variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Failed to connect to MongoDB", err));

// Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  EmployeeModel.findOne({ email: email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          const accessToken = jwt.sign({ email: email }, JWT_ACCESS_SECRET, { expiresIn: '1m' });
          const refreshToken = jwt.sign({ email: email }, JWT_REFRESH_SECRET, { expiresIn: '5m' });

          res.cookie('accessToken', accessToken, { maxAge: 60000, httpOnly: true, secure: true, sameSite: 'Strict' });
          res.cookie('refreshToken', refreshToken, { maxAge: 300000, httpOnly: true, secure: true, sameSite: 'Strict' });

          return res.json({ Login: true });
        } else {
          return res.json({ Login: false, message: "Invalid password" });
        }
      } else {
        return res.json({ message: "No records found" });
      }
    })
    .catch(err => res.json(err));
});

// Register Route
app.post('/register', (req, res) => {
  EmployeeModel.create(req.body)
    .then(employees => res.json(employees))
    .catch(err => res.json(err));
});

// Middleware to verify access token
const verifyUser = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return renewToken(req, res, next);
  } else {
    jwt.verify(accessToken, JWT_ACCESS_SECRET, (err, decoded) => {
      if (err) {
        return renewToken(req, res, next);
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
};

// Middleware to renew token
const renewToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.json({ valid: false, message: "No refresh token found" });
  }

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.json({ valid: false, message: "Invalid or expired refresh token" });
    } else {
      const newAccessToken = jwt.sign({ email: decoded.email }, JWT_ACCESS_SECRET, { expiresIn: '1m' });
      res.cookie('accessToken', newAccessToken, { maxAge: 60000, httpOnly: true, secure: true, sameSite: 'Strict' });
      req.email = decoded.email;
      next();
    }
  });
};

// Protected Route
app.get('/dashboard', verifyUser, (req, res) => {
  return res.json({ valid: true, message: "Authorized" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server connected successfully on port ${PORT}`);
});
