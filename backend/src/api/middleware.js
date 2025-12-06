// Simple request logger; attach validators per-route as needed.
const middleware = (req, _res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
};

module.exports = middleware;