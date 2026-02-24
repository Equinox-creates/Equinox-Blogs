const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// In-memory database (for demonstration purposes)
const users = [];

// Twilio configuration
const twilioClient = twilio('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

// Routes

// Register route
app.post('/register', (req, res) => {
    const { username, email, phone, password } = req.body;

    // Check if user already exists
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Save user
    users.push({ username, email, phone, password });
    res.status(201).json({ message: 'User registered successfully' });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
});

// Recover route
app.post('/recover', (req, res) => {
    const { phone } = req.body;

    const user = users.find(user => user.phone === phone);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Send OTP via Twilio
    twilioClient.messages
        .create({
            body: `Your OTP is ${otp}`,
            from: 'YOUR_TWILIO_PHONE_NUMBER',
            to: phone
        })
        .then(() => {
            // Send recovery email
            transporter.sendMail({
                from: 'your-email@gmail.com',
                to: user.email,
                subject: 'Password Recovery',
                text: `Your password is: ${user.password}`
            });

            res.status(200).json({ message: 'OTP sent and recovery email sent' });
        })
        .catch(err => {
            res.status(500).json({ message: 'Error sending OTP', error: err.message });
        });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});