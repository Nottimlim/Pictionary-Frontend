const environment = {
  development: {
    API_URL: 'http://localhost:8000',
  },
  production: {
    API_URL: '/api'  // This will use Netlify's proxy
  }
};

const config = import.meta.env.VITE_ENV === 'production' 
  ? environment.production 
  : environment.development;

console.log('ENV:', import.meta.env.VITE_ENV);
console.log('API URL:', config.API_URL);

export default config;