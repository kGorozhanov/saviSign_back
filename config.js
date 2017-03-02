const config = {
  environment: process.env.NODE_ENV || 'dev',
  server: {
    port: process.env.PORT || 8080
  },
  mongo: {
    url: process.env.NODE_ENV === 'prod' ? 'mongodb://user:123@ds163699.mlab.com:63699/savisign' : 'mongodb://localhost/savisign'
  },
  secrets: {
    session: 'ipgard-secret'
  },
  userRoles: ['admin']
};
module.exports = config;
