const express = require('express');
const { validateRequest } = require('../utils/validators');

const middleware = (req, res, next) => {
    // Log the request method and URL
    console.log(`${req.method} request for '${req.url}'`);

    // Validate the request
    const validationError = validateRequest(req);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    next();
};

module.exports = middleware;