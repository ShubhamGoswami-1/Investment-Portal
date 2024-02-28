const express = require("express");
const morgan = require('morgan');
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();

const checkAuthRouter = require('./routes/checkAuthRoutes');
const globalErrorHandler = require('./controllers/errorController');

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'))

app.use(cookieParser());
app.use('/', (req, res, next) => {
    // console.log('Cookies: ', req.cookies);
    next();
})
app.use('/api/v1/check-auth', checkAuthRouter);

app.all('*', (req, res, next) => {
    // const err = new Error(`Can't find the url:${req.originalUrl} in this server`);
    // err.status = "fail";
    // err.statusCode = 404;
    // next(err);

    next(new AppError(`Can't find the URL: ${req.originalUrl} in this server! :(`, 404));
})

app.use(globalErrorHandler);
module.exports = app;