const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ name, email, password });
        await user.save();

        // In production, sign a JWT token here
        res.json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        // In production, compare hashed password
        if (password !== user.password) return res.status(400).json({ msg: 'Invalid Credentials' });

        res.json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
