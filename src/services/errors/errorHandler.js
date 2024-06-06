const { ErrorCodes } = require('./errorCodes');

/**
 * @type {import("express").ErrorRequestHandler}
 */

const errorHandler = (error, req, res, next) => {
    console.log(error.cause);

    switch (error.code) {
        case ErrorCodes.INVALID_TYPES_ERROR:
            res.status(400).send({ status: 'error', error: error.name, cause: error.cause, code: error.code });
            break;
        case ErrorCodes.DATABASE_ERROR:
            res.status(507).send({ status: 'error', error: error.name, cause: error.cause, code: error.code });
            break;
        case ErrorCodes.ROUTING_ERROR:
            res.status(502).send({ status: 'error', error: error.name, cause: error.cause, code: error.code });
            break;
        default:
            res.status(500).send({ status: 'error', error: 'Unknown error' });
    }

    next();
}

module.exports = { errorHandler }