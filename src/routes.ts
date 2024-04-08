import { Express, Request, Response } from 'express';
import { createUserHandler, updateUserHandler } from './resource/user.resource';
import { createUserSchema, updateUserSchema } from './schema/user.schema';
import { validate } from './middleware/validation.middleware';
import { getUserSessionsHandler } from './resource/session.resource';

export function routes(app: Express) {
  app.get('/healthcheck', (_: Request, res: Response) => res.sendStatus(200));

  app.post('/api/sessions', validate(createUserSchema), createUserHandler);
  app.patch('/api/sessions', validate(updateUserSchema), updateUserHandler);
  app.get('/api/sessions', getUserSessionsHandler)
}
