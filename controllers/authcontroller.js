const AppError = require('./../utils/appError');
const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const bcrypt = require("bcrypt");
const passport = require('passport');
const dotenv = require("dotenv");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./../models/userModel');

dotenv.config({ path: './config.env' });

const signToken = (email) => {
    return jwt.sign({email}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.email);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    // if(process.env.NODE_ENV === 'production'x){
    //     cookieOptions.secure = true
    // }

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;
    // res.status(statusCode).json({
    //     status: 'success',
    //     token,
    //     user
    // });
    res.redirect('/api/v1/check-auth/client-dashboard');
}

exports.signup = asyncErrorHandler(async (req, res, next) => {
    const newUser = await User.create(req.body);

    createSendToken(newUser, 201, res);
})

exports.login = asyncErrorHandler(async(req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password){
        return next(new AppError('Enter the email and password for logging in !!! :(', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if(!user){
        return next(new AppError('User Not found!!! :('));
    }

    if(!(await user.correctPassword(password, user.password))){
        return next(new AppError('Invalid Credentials!!! :('))
    }

    createSendToken(user, 200, res);
})

exports.protect = asyncErrorHandler(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if(req.cookies && req.cookies.jwt){
        token = req.cookies.jwt;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return next(new AppError('You are not logged in, please logged in to get access !!! (⩺_⩹)'))
    }
    
    // 2) Token Verification
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    let currentUser = await User.findOne({email: decoded.email});

    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist ( RIP 八 ) or this user doesn\'t belong to access this route', 401))
    }

    // 4) Check if user changed password after the token was issued

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
})

exports.restrictTo = (role) => {
    return (req, res, next) => {
        if(role !== req.user.role){
            return next(new AppError(`You are not allowed to do ${req.originalUrl}. Let me remind u, U r a ${req.user.role} ¯\\_(ツ)_/¯`, 403))
        }

        next();
    };
}

exports.logout = (req, res, next) => {
    const cookieOptions = {
        expires: new Date(Date.now() - 10 * 1000), // Set to expire 10 seconds ago
        httpOnly: true
    };

    // Set the cookie 'jwt' with an expired date, effectively deleting it
    res.cookie('jwt', 'loggedout', cookieOptions);
    // res.status(200).json({ 
    //     status: 'success',
    //     message: 'Logged Out !!! :)'
    // });
    res.redirect('/api/v1/check-auth/home');
};


// *************************************************************************************************************************************

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/v1/check-auth/auth/google/callback",
    passReqToCallback: true
  },
  async function (request, accessToken, refreshToken, profile, done)  {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      if (!user) {
        // Create a new user if one doesn't exist
        const password = await bcrypt.hash(profile.id, 12);
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          // You might not have a password for OAuth users, handle accordingly
          password, // Consider a more secure approach
          confirmPassword: password,
          OAuthId: profile.id
          //   role: 'client', // Default role, adjust as necessary
        });
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
));

exports.OauthJWTtoken = (req, res, next) => {
    createSendToken(req.user, 200, res);
}