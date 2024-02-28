const express = require('express');
const path = require("path");
const passport = require("passport");

const authController = require('./../controllers/authcontroller');
const checkAuthProtectController = require('./../controllers/checkAuthProtectController');

const router = express.Router();

router.get('/home', (req, res) => {
    // __dirname is the directory name of the current module, e.g., '/your-project-folder'
    res.sendFile(path.join(__dirname, './../views', 'index.html'));
});

router.get('/signup', (req, res) => {
    // __dirname is the directory name of the current module, e.g., '/your-project-folder'
    res.sendFile(path.join(__dirname, './../views', 'register.html'));
});

router.get('/login', (req, res) => {
    // __dirname is the directory name of the current module, e.g., '/your-project-folder'
    res.sendFile(path.join(__dirname, './../views', 'login.html'));
});

router.get('/client-dashboard', authController.protect, (req, res) => {
    // __dirname is the directory name of the current module, e.g., '/your-project-folder'
    res.sendFile(path.join(__dirname, './../views', 'clientdashboard.html'));
});

router.get('/forgot-password', (req, res) => {
    // __dirname is the directory name of the current module, e.g., '/your-project-folder'
    res.sendFile(path.join(__dirname, './../views', 'forgot-password.html'));
});

router.get('/aboutus', (req, res) => {
    // __dirname is the directory name of the current module, e.g., '/your-project-folder'
    res.sendFile(path.join(__dirname, './../views', 'aboutus.html'));
});

router.get('/faq', (req, res) => {
    // __dirname is the directory name of the current module, e.g., '/your-project-folder'
    res.sendFile(path.join(__dirname, './../views', 'faq.html'));
});

router.get('/success', (req, res, next) => {res.sendFile(path.join(__dirname, './../views', 'success.html'))});
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.protect, authController.logout);
router.get('/hehe-client', authController.protect, authController.restrictTo('client'), checkAuthProtectController.badhiyaHai);
router.get('/hehe-advisor', authController.protect, authController.restrictTo('advisor'), checkAuthProtectController.badhiyaHai);

router.get('/signin-google', passport.authenticate('google', { scope: ['profile', 'email'] })); //http://localhost:3000/ap1/v1/check-auth/signin-google
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), authController.OauthJWTtoken);

module.exports = router;