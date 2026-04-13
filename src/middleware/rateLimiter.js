const requests = new Map();

const rateLimiter = (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 60;

  if (!requests.has(ip)) {
    requests.set(ip, { count: 1, start: now });
    return next();
  }

  const data = requests.get(ip);

  if (now - data.start > windowMs) {
    requests.set(ip, { count: 1, start: now });
    return next();
  }

  if (data.count >= maxRequests) {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please slow down.",
    });
  }

  data.count += 1;
  next();
};

setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requests.entries()) {
    if (now - data.start > 60 * 1000) requests.delete(ip);
  }
}, 5 * 60 * 1000);

module.exports = rateLimiter;
