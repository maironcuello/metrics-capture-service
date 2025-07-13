export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3003',
});