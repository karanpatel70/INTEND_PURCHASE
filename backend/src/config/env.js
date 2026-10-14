import 'dotenv/config';

export const env = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
