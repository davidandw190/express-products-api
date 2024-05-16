import { Express, Request, Response } from 'express';
import { createProductHandler, deleteProductHandler, retrieveProductHandler, updateProductHandler } from './resource/product.resource';
import { createUserHandler, deleteUserHandler, getUserHandler, updateUserHandler } from './resource/user.resource';
import { createUserSchema, updateUserSchema } from './schema/user.schema';
import { createUserSessionHandler, deleteUserSessionHandler, getUserSessionsHandler } from './resource/session.resource';

import { requireUser } from './middleware/require-user.middleware';
import { validate } from './middleware/validation.middleware';

export default function routes(app: Express) {
  // API Versioning
  const apiVersion = '/api/v1';

  // Health Check Route
  app.get('/health', (_: Request, res: Response) => res.sendStatus(200));

  // User Routes
  app.get(`${apiVersion}/users/:userId`, getUserHandler);
  app.post(`${apiVersion}/users`, validate(createUserSchema), createUserHandler);
  app.patch(`${apiVersion}/users/:userId`, validate(updateUserSchema), updateUserHandler);
  app.delete(`${apiVersion}/users/:userId`, deleteUserHandler);

  // Session Routes
  app.get(`${apiVersion}/users/:userId/sessions`, requireUser, getUserSessionsHandler);
  app.post(`${apiVersion}/users/:userId/sessions`, createUserSessionHandler);
  app.delete(`${apiVersion}/users/:userId/sessions`, deleteUserSessionHandler);

  // Product Routes
  app.get(`${apiVersion}/products/:productId`, retrieveProductHandler);
  app.post(`${apiVersion}/products`, createProductHandler);
  app.patch(`${apiVersion}/products/:productId`, updateProductHandler);
  app.delete(`${apiVersion}/products/:productId`, deleteProductHandler);

  // Not Found Routes
  app.use((_req, res) => {
    res.status(404).send({ error: 'Route not found' });
  });

  // Error Handling Middleware
  app.use((err: any, _req: Request, res: Response, _next: any) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Internal Server Error' });
  });
}
