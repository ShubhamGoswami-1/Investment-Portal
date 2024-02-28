const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const AppError = require('./../utils/appError');

exports.badhiyaHai = asyncErrorHandler(async(req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: {
            message: `Sab Badhiya hai ${req.user.name} bhai :)`
        }
    });
})