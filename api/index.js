const path = require('path');
const app = require(path.resolve(__dirname, '../server/server.js'));

module.exports = (req, res) => {
  const url = req.url || '';
  console.log(`Vercel Function Hit: ${req.method} ${url}`);
  
  if (url === '/api/health' || url === '/api/health/') {
    return res.status(200).json({ 
      status: 'ok', 
      source: 'vercel-function-direct',
      timestamp: new Date().toISOString()
    });
  }
  
  return app(req, res);
};
