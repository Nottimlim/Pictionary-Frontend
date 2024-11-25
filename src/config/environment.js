const environment = {
  development: {
    API_URL: 'http://localhost:8000',
  },
  production: {
    API_URL: import.meta.env.VITE_API_URL || 'https://whataduudle-game-76f8c0d45ebe.herokuapp.com',
  }
};

const config = import.meta.env.VITE_ENV === 'production' 
  ? environment.production 
  : environment.development;

console.log('ENV:', import.meta.env.VITE_ENV);
console.log('API URL:', config.API_URL);

export default config;