import { Express, Request, Response } from 'express';
import { createUserHandler, deleteUserHandler, updateUserHandler } from './resource/user.resource';
import { createUserSchema, updateUserSchema } from './schema/user.schema';
import { validate } from './middleware/validation.middleware';
import { getUserSessionsHandler } from './resource/session.resource';

export function routes(app: Express) {
  // API Versioning
  const apiVersion = '/api/v1';

  // Health Check Route
  app.get('/health', (_: Request, res: Response) => res.sendStatus(200));

  // User Routes
  app.post(`${apiVersion}/users`, validate(createUserSchema), createUserHandler);
  app.patch(`${apiVersion}/users/:userId`, validate(updateUserSchema), updateUserHandler);
  app.delete(`${apiVersion}/users/:userId`, deleteUserHandler);

  // Session Routes
  app.get(`${apiVersion}/users/:userId/sessions`, getUserSessionsHandler);

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
