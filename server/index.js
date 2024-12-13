const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeModel = require('./models/Employee');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));

mongoose.connect("mongodb+srv://harish:harishk10@cluster0.mlwrhj8.mongodb.net/employee?retryWrites=true&w=majority&appName=Cluster0");

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  EmployeeModel.findOne({ email: email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          // Create access and refresh tokens
          const accessToken = jwt.sign({ email: email }, "jwt-access-token-secret-key", { expiresIn: '1m' });
          const refreshToken = jwt.sign({ email: email }, "jwt-refresh-token-secret-key", { expiresIn: '5m' });

          // Set the tokens as cookies
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

app.post('/register', (req, res) => {
  EmployeeModel.create(req.body)
    .then(employees => res.json(employees))
    .catch(err => res.json(err));
});

// Middleware to verify the access token
const verifyUser = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  // If no access token, try to renew it using the refresh token
  if (!accessToken) {
    return renewToken(req, res, next);
  } else {
    jwt.verify(accessToken, "jwt-access-token-secret-key", (err, decoded) => {
      if (err) {
        // If access token is expired or invalid, try to renew it using the refresh token
        return renewToken(req, res, next);
      } else {
        // If the access token is valid, proceed with the request
        req.email = decoded.email;
        next();
      }
    });
  }
};

// Middleware to renew access token using the refresh token
const renewToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.json({ valid: false, message: "No refresh token found" });
  }

  // Verify the refresh token
  jwt.verify(refreshToken, "jwt-refresh-token-secret-key", (err, decoded) => {
    if (err) {
      return res.json({ valid: false, message: "Invalid or expired refresh token" });
    } else {
      // generate a new access token
      const newAccessToken = jwt.sign({ email: decoded.email }, "jwt-access-token-secret-key", { expiresIn: '1m' });
      
      // Set the new access token in cookies
      res.cookie('accessToken', newAccessToken, { maxAge: 60000, httpOnly: true, secure: true, sameSite: 'Strict' });
      req.email = decoded.email;
      next();
    }
  });
};

app.get('/dashboard', verifyUser, (req, res) => {
  return res.json({ valid: true, message: "Authorized" });
});

app.listen(3001, () => {
  console.log("Server connected successfully");
});
