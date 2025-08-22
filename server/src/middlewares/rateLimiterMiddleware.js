import rateLimit from 'express-rate-limit';

const rateLimiterMiddleware = rateLimit({
    windowMs: 10 * 1000, // 10 seconds
    max: 5, // limit each IP to 5 requests per windowMs
    massage: {
        status: 429,
        message: "Too many requests, please try again later."
    },
    keyGenerator: (req) => req.user.id,
})

export default rateLimiterMiddleware;