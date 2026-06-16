const errorHandler = (err, req, res, next) => {
    let message = err.message;
    let statusCode = err.statusCode || 500;

    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyPattern || err.keyValue || {})[0];
        if (field === 'mobile') {
            message = 'Mobile number already exists';
        } else if (field === 'email') {
            message = 'Email already registered';
        } else {
            message = 'This account already exists';
        }
    }

    const status = err.status || (statusCode >= 400 && statusCode < 500 ? 'fail' : 'error');

    res.status(statusCode).json({
        success: false,
        status,
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export default errorHandler;
