const config = {
  appName: 'dvelupmint',
  apiBaseUrl: process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:8080',
  endpoints: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
    }
  }
};

export default config;
