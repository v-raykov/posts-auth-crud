const express = require('express');
const authService = require('../services/authService');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const user = await authService.register(
            req.body.email,
            req.body.password
        );
        res.json(user);
    } catch {
        res.status(400).json({error: 'User already exists'});
    }
});

router.post('/login', async (req, res) => {
    try {
        const token = await authService.login(
            req.body.email,
            req.body.password
        );
        res.json({token});
    } catch {
        res.status(401).json({error: 'Invalid credentials'});
    }
});

module.exports = router;
