function healthCheck(req, res) {
  return res.status(200).json({
    status: 'ok',
    message: 'STAR API is running',
    timestamp: new Date().toISOString()
  });
}

module.exports = { healthCheck };
