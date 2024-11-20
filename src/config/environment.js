const environment = {
  development: {
    API_URL: 'http://localhost:8000',
  },
  production: {
    // Replace with Heroku app URL
    API_URL: process.env.VITE_API_URL || 'https://your-heroku-app-name.herokuapp.com',
  }
};

const config = process.env.VITE_ENV === 'production' 
  ? environment.production 
  : environment.development;

export default config;
