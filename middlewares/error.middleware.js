errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    const error = err.error || "Internal Server Error. Please try again later.";

    console.error(
        `Error-Middleware: [${req.method}]  ${req.path} >> StatusCode:: ${status}, Error:: ${error} `
    );

    console.log(err);

    return res.status(status).json({error});
};

module.exports = errorMiddleware;