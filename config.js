const config = {
  environment: process.env.NODE_ENV || 'dev',
  server: {
    port: process.env.PORT || 8080
  },
  mongo: {
    url: process.env.NODE_ENV === 'prod' ? '' : 'mongodb://localhost/savisign'
  },
  secrets: {
    session: 'ipgard-secret'
  },
  userRoles: ['admin']
};
module.exports = config;
