const express = require("express");
const morgan = require('morgan');
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const checkAuthRouter = require('./routes/checkAuthRoutes');
const advisorRouter = require("./routes/advisorRoutes");
const clientRouter = require("./routes/clientRoutes");

const AppError = require("./utils/appError");

const globalErrorHandler = require('./controllers/errorController');

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.set('view engine', 'ejs');
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
app.use('/api/v1/advisor', advisorRouter);
app.use('/api/v1/client', clientRouter);


app.all('*', (req, res, next) => {
    next(new AppError(`Can't find the URL: ${req.originalUrl} in this server! :(`, 404));
})

app.use(globalErrorHandler);
module.exports = app;