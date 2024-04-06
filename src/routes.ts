import { Express, Request, Response } from 'express';
import { createUserHandler } from './resource/user.resource';
import { createUserSchema } from './schema/user.schema';
import { validate } from './middleware/validation.middleware';
import { getUserSessionsHandler } from './resource/session.resource';

export function routes(app: Express) {
  app.get('/healthcheck', (_: Request, res: Response) => res.sendStatus(200));

  app.post('/api/sessions', validate(createUserSchema), createUserHandler);
  app.get('/api/sessions', getUserSessionsHandler)
}
