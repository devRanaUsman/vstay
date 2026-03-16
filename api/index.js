const app = require('../server/server.js');

module.exports = (req, res) => {
  if (req.url === '/api/health' || req.url === '/api/health/') {
    return res.status(200).json({ status: 'ok', source: 'vercel-function-direct' });
  }
  return app(req, res);
};
