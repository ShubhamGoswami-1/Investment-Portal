const express = require('express');
const path = require("path");
const passport = require("passport");

const Advisor = require("./../models/advisorModel");

const authController = require('./../controllers/authcontroller');
const checkAuthProtectController = require('./../controllers/checkAuthProtectController');

const router = express.Router();

router.get('/home', (req, res) => {
    // res.sendFile(path.join(__dirname, './../views', 'index.html'));
    res.render('index');
});

router.get('/signup', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/welcome-client', authController.protect, async (req, res) => {
    const advisors = await Advisor.find();
    res.render('welcomepage', { advisors });
});

router.get('/welcome-advisor', authController.protect, (req, res) => {
    res.render('advisordashboard');
});

router.get('/client-dashboard', authController.protect, (req, res) => {
    res.render('clientdashboard')
});

router.get('/add-plan', authController.protect, (req, res) => {
    res.render('addplan')
});

router.get('/adv/:advisorId', authController.protect, async (req, res) => {
    const advisor = await Advisor.findById(req.params.advisorId);
    const indexVal = req.query.index;
    res.render('advisor1', { advisor, indexVal });
});

router.get('/forgot-password', (req, res) => {
    res.render('forgot_password')
});

router.get('/aboutus', (req, res) => {
    res.render('aboutus');
});

router.get('/faq', (req, res) => {
    res.render('faq');
});

router.get('/explore-features', (req, res) => {
    res.render('explorefeatures');
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