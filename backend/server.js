require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3001;

// Only start server if not in Vercel (serverless environment)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log("Conectando a la base de datos:", {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER
    });
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;