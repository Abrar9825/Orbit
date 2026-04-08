const requiredEnv = [
  'MONGO_URI',
  'EMAIL_USER',
  'EMAIL_PASS',
  'PORT',
  'NODE_ENV',
  'JWT_SECRET'
];

function validateEnv() {
  const missing = requiredEnv.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
}

module.exports = { validateEnv };
