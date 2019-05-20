module.exports = {
  PORT       : process.env.PORT       || 8000,
  NODE_ENV   : process.env.NODE_ENV   || 'development',
  DB_URL     : process.env.DB_URL     || 'postgresql://enseigne_moi@localhost/enseigne_moi',
  JWT_SECRET : process.env.JWT_SECRET || 'not-much-of-a-secret',
  JWT_EXPIRY : process.env.JWT_EXPIRY || '3h'
};
