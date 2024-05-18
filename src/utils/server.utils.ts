import { deserializeUser } from '../middleware/deserialization.middleware';
import express from 'express';
import routes from '../routes';
export function createServer() {
  const app = express();
 
  app.use(express.json());
 
  app.use(deserializeUser);
  
  routes(app);
  
  return app
}